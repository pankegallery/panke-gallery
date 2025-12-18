# RSVP Feature Documentation

## Overview
This feature enables event registration (RSVP) on event pages. It's controlled via Contentful and stores all responses in Baserow.

## Configuration

### 1. Contentful Setup
Add the following fields to your Event content type in Contentful:
- `rsvpEnabled` (Boolean): Toggle to enable/disable registration
- `rsvpCapacity` (Integer): Maximum allowed registrations
- `rsvpDeadline` (Date): Registration deadline

### 2. Baserow Setup
Create a table in Baserow with the following fields:
- `Name` (Text): Registrant's name
- `Email` (Text): Registrant's email
- `Comment` (Long Text): Optional comment
- `Event ID` (Text): Contentful event ID
- `Event Title` (Text): Event title for human readability
- `Registered at` (Date): Registration timestamp

### 3. Environment Variables
Set the following environment variables in your Netlify dashboard:

```
BASEROW_TOKEN=your_baserow_api_token
BASEROW_URL=https://api.baserow.io
BASEROW_TABLE_ID=your_table_id
```

To get these values:
1. **BASEROW_TOKEN**: Generate in Baserow Settings > API Tokens
2. **BASEROW_URL**: Use `https://api.baserow.io` for Baserow cloud, or your self-hosted URL
3. **BASEROW_TABLE_ID**: Found in the URL when viewing your table (e.g., `https://api.baserow.io/database/123/table/456` - use `456`)

## Usage

### For Content Editors
1. Open an event in Contentful
2. Toggle `rsvpEnabled` to `true`
3. Set `rsvpCapacity` (e.g., 50)
4. Set `rsvpDeadline` to the registration cutoff date
5. Publish the event

The RSVP form will automatically appear on the event page if:
- RSVP is enabled
- Current date is before the deadline
- Capacity hasn't been reached

### For Administrators
View and manage registrations in Baserow:
1. Filter by `eventId` to see registrations for a specific event
2. Use `eventTitle` for easy identification
3. Export data as CSV for email lists or analysis

## Features

### Security
- **Honeypot field**: Invisible field catches spam bots
- **Rate limiting**: Max 3 submissions per IP per minute
- **Email validation**: Server-side validation of email format
- **Required fields**: Name and email are mandatory

### User Experience
- Simple form with name, email, and optional comment
- Clear success/error messages
- Disabled state while submitting
- "Registration closed" message after deadline

### Technical Details
- Serverless function at `/.netlify/functions/rsvp-submit`
- Real-time capacity checking before submission
- Automatic timestamp on registration
- Returns 409 status when capacity reached

## Troubleshooting

### Form not appearing
- Check `rsvpEnabled` is `true` in Contentful
- Verify deadline hasn't passed
- Clear Gatsby cache: `npm run clean`

### Submissions failing
- Verify environment variables are set correctly
- Check Baserow table structure matches expected fields
- Review Netlify function logs for errors

### Capacity issues
- Small events may experience rare double-booking (by design)
- Capacity is checked at submission time, not form display
- Consider setting capacity slightly lower than actual to account for this

## Development

### Local Testing
1. Create `.env.development` with test environment variables
2. Run `npm run dev`
3. Use Netlify CLI for local function testing: `netlify dev`

### Function Testing
The serverless function can be tested locally:
```bash
netlify dev
# Then submit to http://localhost:8888/.netlify/functions/rsvp-submit
```

## Support
For issues or questions, contact the development team or refer to the main repository documentation.
