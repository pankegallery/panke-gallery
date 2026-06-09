// Netlify serverless function for RSVP submission
// This function handles event registration with Baserow backend
// Environment variables needed: BASEROW_TOKEN, BASEROW_URL, BASEROW_TABLE_ID

const fetch = require('node-fetch');

// Rate limiting: simple in-memory store (resets on cold start)
const submissions = new Map();
const RATE_LIMIT_WINDOW = 60000; // 1 minute
const MAX_SUBMISSIONS_PER_IP = 3;

// Helper function to check rate limit
function checkRateLimit(ip) {
  const now = Date.now();
  const userSubmissions = submissions.get(ip) || [];

  // Clean old submissions outside the window
  const recentSubmissions = userSubmissions.filter(
    timestamp => now - timestamp < RATE_LIMIT_WINDOW
  );

  if (recentSubmissions.length >= MAX_SUBMISSIONS_PER_IP) {
    return false;
  }

  recentSubmissions.push(now);
  submissions.set(ip, recentSubmissions);
  return true;
}

// Helper function to validate email
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Send a confirmation email via Resend. Returns true on success.
// Non-fatal: callers should not fail the RSVP if this throws/returns false.
async function sendConfirmationEmail({ name, email, eventTitle, eventDate }) {
  const apiKey = process.env.RESEND_API_KEY;
  const fromAddress = process.env.RSVP_FROM_EMAIL; // e.g. "panke.gallery <rsvp@panke.gallery>"

  if (!apiKey || !fromAddress) {
    console.warn('Email not sent: RESEND_API_KEY or RSVP_FROM_EMAIL not configured');
    return false;
  }

  // Optional human-readable date line
  let dateLine = '';
  if (eventDate) {
    const d = new Date(eventDate);
    if (!isNaN(d)) {
      dateLine = `<p><strong>When:</strong> ${d.toLocaleString('en-GB', {
        dateStyle: 'full',
        timeStyle: 'short',
        timeZone: 'Europe/Berlin'
      })}</p>`;
    }
  }

  const html = `
    <div style="font-family: Helvetica, Arial, sans-serif; font-size: 15px; line-height: 1.5; color: #111;">
      <p>Hi ${name},</p>
      <p>Thank you for registering for <strong>${eventTitle}</strong> at panke.gallery.
         Your spot is reserved.</p>
      ${dateLine}
      <p>If you can no longer attend, please contact info@panke.gallery so we can free up your spot.</p>
      <p>See you soon,<br/>panke.gallery</p>
    </div>
  `;

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      from: fromAddress,
      to: email,
      subject: `[RSVP] Your registration for ${eventTitle} at panke.gallery`,
      html
    })
  });

  if (!res.ok) {
    console.error('Resend email failed:', res.status, await res.text());
    return false;
  }
  return true;
}

exports.handler = async (event, context) => {
  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  // Only allow POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  // Check rate limit
  const clientIp = event.headers['x-forwarded-for'] ||
    event.headers['client-ip'] ||
    context.clientContext?.ip ||
    'unknown';

  if (!checkRateLimit(clientIp)) {
    return {
      statusCode: 429,
      headers,
      body: JSON.stringify({ error: 'Too many requests. Please try again later.' })
    };
  }

  try {
    const { name, email, comment, eventId, eventTitle, eventDate, capacity, honeypot } = JSON.parse(event.body);

    // Honeypot check - if filled, it's a bot
    if (honeypot) {
      console.log('Honeypot triggered');
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ message: 'Registration successful' })
      };
    }

    // Validate required fields
    if (!name || !email || !eventId || !eventTitle || !capacity) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Missing required fields' })
      };
    }

    // Validate email format
    if (!isValidEmail(email)) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Invalid email format' })
      };
    }

    // Check environment variables
    const baserowToken = process.env.BASEROW_TOKEN;
    const baserowUrl = process.env.BASEROW_URL;
    const tableId = process.env.BASEROW_TABLE_ID;

    if (!baserowToken || !baserowUrl || !tableId) {
      console.error('Missing Baserow configuration');
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: 'Server configuration error' })
      };
    }

    // Get current registration count for this event
    const filterUrl = `${baserowUrl}/api/database/rows/table/${tableId}/?user_field_names=true&filter__field_eventId__equal=${eventId}`;

    const countResponse = await fetch(filterUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Token ${baserowToken}`,
        'Content-Type': 'application/json'
      }
    });

    if (!countResponse.ok) {
      console.error('Failed to fetch registration count:', await countResponse.text());
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: 'Failed to check registration status' })
      };
    }

    const countData = await countResponse.json();
    const currentCount = countData.count || 0;

    // Check if capacity is reached
    if (currentCount >= capacity) {
      return {
        statusCode: 409,
        headers,
        body: JSON.stringify({ error: 'RSVP capacity reached' })
      };
    }

    // Create new registration in Baserow
    const createUrl = `${baserowUrl}/api/database/rows/table/${tableId}/?user_field_names=true`;

    const createResponse = await fetch(createUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Token ${baserowToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        "Name": name,
        "Email": email,
        "Comment": comment || '',
        "Event ID": eventId,
        "Event Title": eventTitle,
        "Registered at": new Date().toISOString()
      })
    });

    if (!createResponse.ok) {
      const errorText = await createResponse.text();
      console.error('Failed to create registration:', errorText);
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: 'Failed to save registration' })
      };
    }

    const registration = await createResponse.json();
    console.log('Baserow create response', registration);

    // Send confirmation email — must never fail the RSVP itself
    try {
      const emailed = await sendConfirmationEmail({
        name,
        email,
        eventTitle,
        eventDate // available if you add it to the request payload (step 4)
      });
      if (!emailed) {
        console.warn('Registration saved but confirmation email not sent for', email);
      }
    } catch (err) {
      console.error('Confirmation email threw:', err);
    }
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        message: 'Registration successful',
        id: registration.id
      })
    };

  } catch (error) {
    console.error('Error processing RSVP:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal server error' })
    };
  }
};
