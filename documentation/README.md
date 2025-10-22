# RSVP Feature - Quick Start Guide

This directory contains complete documentation for the RSVP (event registration) feature.

## 📁 Documentation Files

- **[RSVP_FEATURE.md](RSVP_FEATURE.md)** - Complete setup and usage guide
  - Configuration instructions
  - Environment variables
  - Usage for editors and admins
  - Technical details and troubleshooting

- **[RSVP_EXAMPLES.md](RSVP_EXAMPLES.md)** - Examples and data structures
  - Example Contentful event configuration
  - Baserow table structure
  - API request/response examples
  - Visual workflow diagram

- **[RSVP_DEPLOYMENT_CHECKLIST.md](RSVP_DEPLOYMENT_CHECKLIST.md)** - Deployment verification
  - Pre-deployment setup steps
  - Post-deployment testing checklist
  - Troubleshooting guide

## 🚀 Quick Start

### 1. Prerequisites
- Baserow account with API access
- Contentful access to edit Event content type
- Netlify deployment access

### 2. Setup (5 minutes)

#### Baserow
1. Create table: "Event Registrations"
2. Add fields: `name`, `email`, `comment`, `eventId`, `eventTitle`, `registeredAt`
3. Generate API token
4. Note table ID from URL

#### Contentful
1. Add fields to Event content type:
   - `rsvpEnabled` (Boolean)
   - `rsvpCapacity` (Integer)
   - `rsvpDeadline` (Date)
2. Publish content type

#### Netlify
1. Set environment variables:
   ```
   BASEROW_TOKEN=your_token_here
   BASEROW_URL=https://api.baserow.io
   BASEROW_TABLE_ID=your_table_id
   ```
2. Deploy site

### 3. Usage

#### Enable RSVP for an event:
1. Edit event in Contentful
2. Set `rsvpEnabled` to `true`
3. Set `rsvpCapacity` (e.g., 50)
4. Set `rsvpDeadline` (registration closes at this date)
5. Publish

The RSVP form will automatically appear on the event page!

#### View registrations:
1. Open Baserow table
2. Filter by `eventId` to see registrations for specific event
3. Export to CSV for email campaigns

## 🎨 What It Looks Like

### Event Page with RSVP Form
```
┌─────────────────────────────────────────┐
│  EVENT TITLE                            │
│  Description...                         │
│  Date: August 15, 2025                 │
├─────────────────────────────────────────┤
│  RSVP                                   │
│                                         │
│  Register for this event                │
│  ┌───────────────────────────────────┐ │
│  │ Name *                            │ │
│  │ [____________________________]    │ │
│  │                                   │ │
│  │ Email *                           │ │
│  │ [____________________________]    │ │
│  │                                   │ │
│  │ Comment (optional)                │ │
│  │ [____________________________]    │ │
│  │ [____________________________]    │ │
│  │                                   │ │
│  │ [ Register ]                      │ │
│  └───────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

### After Successful Registration
```
┌─────────────────────────────────────────┐
│  RSVP                                   │
│                                         │
│  ✓ Registration Successful!             │
│                                         │
│  Thank you for registering for this     │
│  event. You should receive a            │
│  confirmation email shortly.            │
└─────────────────────────────────────────┘
```

### When Registration is Closed
```
┌─────────────────────────────────────────┐
│  RSVP                                   │
│                                         │
│  ⚠ Registration for this event has      │
│     closed.                             │
└─────────────────────────────────────────┘
```

## 📊 Baserow Table View

```
┌────┬──────────────┬───────────────────┬──────────────┬──────────┬────────────────────┬─────────────────────┐
│ ID │ name         │ email             │ comment      │ eventId  │ eventTitle         │ registeredAt        │
├────┼──────────────┼───────────────────┼──────────────┼──────────┼────────────────────┼─────────────────────┤
│ 1  │ Jane Smith   │ jane@example.com  │ Excited!     │ 5Ks...   │ Summer Opening     │ 2025-06-15T10:30:00 │
│ 2  │ Bob Johnson  │ bob@example.com   │              │ 5Ks...   │ Summer Opening     │ 2025-06-15T11:15:00 │
│ 3  │ Alice Brown  │ alice@example.com │ Can't wait!  │ 7Xy...   │ Autumn Exhibition  │ 2025-09-01T09:00:00 │
└────┴──────────────┴───────────────────┴──────────────┴──────────┴────────────────────┴─────────────────────┘
```

## 🔒 Security Features

✅ Rate limiting (3 requests/minute per IP)  
✅ Honeypot spam protection  
✅ Email validation  
✅ CORS protection  
✅ Input sanitization  
✅ CodeQL security verified  

## 🐛 Troubleshooting

**Form not showing?**
- Check `rsvpEnabled` is `true`
- Verify deadline hasn't passed
- Clear Gatsby cache: `gatsby clean`

**Submissions failing?**
- Check Netlify function logs
- Verify environment variables
- Check Baserow table structure

**Need more help?**
- See [RSVP_FEATURE.md](RSVP_FEATURE.md) for detailed troubleshooting
- Check [RSVP_DEPLOYMENT_CHECKLIST.md](RSVP_DEPLOYMENT_CHECKLIST.md) for testing steps

## 🎯 Key Files in Project

- `netlify/functions/rsvp-submit.js` - Serverless API endpoint
- `src/components/rsvp-form.js` - React form component
- `src/templates/event.js` - Event page template (includes RSVP)
- `src/styles/_theme.scss` - RSVP form styles
- `netlify.toml` - Netlify configuration

## 🤝 Support

For questions or issues:
1. Check the documentation files in this directory
2. Review Netlify function logs
3. Contact the development team

---

**Implementation Status:** ✅ Complete and ready for deployment  
**Security Status:** ✅ Verified with CodeQL (0 vulnerabilities)  
**Testing Status:** ⏳ Awaiting environment setup for live testing
