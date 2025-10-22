# RSVP Feature - Example Configuration

## Example Contentful Event with RSVP Enabled

```json
{
  "title": "Summer Gallery Opening",
  "slug": "summer-gallery-opening-2025",
  "date": "2025-08-15T18:00:00Z",
  "rsvpEnabled": true,
  "rsvpCapacity": 50,
  "rsvpDeadline": "2025-08-14T23:59:59Z",
  "description": "Join us for an evening of art and culture...",
  ...
}
```

## Expected Baserow Table Structure

| Field Name | Field Type | Description | Example |
|------------|------------|-------------|---------|
| name | Text | Registrant's name | "John Doe" |
| email | Text | Registrant's email | "john@example.com" |
| comment | Long Text | Optional comment | "Looking forward to it!" |
| eventId | Text | Contentful event ID | "5KsDBWseXY6QegucYAoacS" |
| eventTitle | Text | Event title (for filtering) | "Summer Gallery Opening" |
| registeredAt | Date | ISO timestamp | "2025-06-15T10:30:00Z" |

## Example API Request to Serverless Function

```javascript
POST /.netlify/functions/rsvp-submit
Content-Type: application/json

{
  "name": "Jane Smith",
  "email": "jane@example.com",
  "comment": "Excited to attend!",
  "eventId": "5KsDBWseXY6QegucYAoacS",
  "eventTitle": "Summer Gallery Opening",
  "capacity": 50,
  "honeypot": ""
}
```

## Example Success Response

```json
{
  "message": "Registration successful",
  "id": "12345"
}
```

## Example Error Responses

### Capacity Reached
```json
{
  "error": "RSVP capacity reached"
}
```
HTTP Status: 409

### Rate Limited
```json
{
  "error": "Too many requests. Please try again later."
}
```
HTTP Status: 429

### Invalid Email
```json
{
  "error": "Invalid email format"
}
```
HTTP Status: 400

## Visual Flow

```
User visits event page
        ↓
Is rsvpEnabled true?  → No → No form shown
        ↓ Yes
Is before deadline?   → No → "Registration closed" message
        ↓ Yes
Display RSVP form
        ↓
User fills & submits
        ↓
Client validates required fields
        ↓
POST to /.netlify/functions/rsvp-submit
        ↓
Server checks:
  - Rate limit
  - Honeypot
  - Email format
  - Current capacity
        ↓
All checks pass?      → No → Error message
        ↓ Yes
Create record in Baserow
        ↓
Return success
        ↓
Show confirmation message
```

## Admin View in Baserow

After some registrations, the Baserow table might look like:

| ID | name | email | comment | eventId | eventTitle | registeredAt |
|----|------|-------|---------|---------|------------|--------------|
| 1 | Jane Smith | jane@example.com | Excited to attend! | 5Ks... | Summer Gallery Opening | 2025-06-15T10:30:00Z |
| 2 | Bob Johnson | bob@example.com | Can't wait! | 5Ks... | Summer Gallery Opening | 2025-06-15T11:15:00Z |
| 3 | Alice Brown | alice@example.com | | 5Ks... | Summer Gallery Opening | 2025-06-15T14:22:00Z |
| 4 | Carol White | carol@example.com | | 7Xy... | Autumn Exhibition | 2025-09-01T09:00:00Z |

Admins can:
- Filter by `eventId` to get all registrations for a specific event
- Use `eventTitle` for quick identification
- Export as CSV for email campaigns
- See timestamps to track registration patterns
