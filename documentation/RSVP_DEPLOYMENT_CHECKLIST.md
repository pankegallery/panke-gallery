# RSVP Feature - Deployment Checklist

Use this checklist to verify the RSVP feature is working correctly after deployment.

## Pre-Deployment Setup

### 1. Baserow Setup
- [ ] Create Baserow account (if not already done)
- [ ] Create new table called "Event Registrations" or similar
- [ ] Add the following fields to the table:
  - [ ] `Name` (Text field)
  - [ ] `Email` (Text field)
  - [ ] `Comment` (Long Text field)
  - [ ] `Event ID` (Text field)
  - [ ] `Event Title` (Text field)
  - [ ] `Registered at` (Date field)
- [ ] Generate API token in Baserow (Settings > API Tokens)
- [ ] Note down the table ID from the URL

### 2. Contentful Setup
- [ ] Add `rsvpEnabled` field (Boolean) to Event content type
- [ ] Add `rsvpCapacity` field (Integer) to Event content type
- [ ] Add `rsvpDeadline` field (Date) to Event content type
- [ ] Publish the content type changes

### 3. Netlify Environment Variables
- [ ] Set `BASEROW_TOKEN` in Netlify dashboard
- [ ] Set `BASEROW_URL` in Netlify dashboard (e.g., https://api.baserow.io)
- [ ] Set `BASEROW_TABLE_ID` in Netlify dashboard
- [ ] Verify existing Contentful variables are still set

## Post-Deployment Verification

### 4. Basic Deployment
- [ ] Deploy succeeds without errors
- [ ] No build warnings about missing dependencies
- [ ] Site loads correctly

### 5. RSVP Feature Visibility
- [ ] Create a test event in Contentful with:
  - [ ] `rsvpEnabled` set to `true`
  - [ ] `rsvpCapacity` set to `5` (small number for testing)
  - [ ] `rsvpDeadline` set to a future date
- [ ] Publish the event
- [ ] Visit the event page
- [ ] Verify RSVP form appears on the page
- [ ] Form should show:
  - [ ] "Register for this event" heading
  - [ ] Name field
  - [ ] Email field
  - [ ] Comment field (optional)
  - [ ] "Register" button

### 6. Form Functionality
- [ ] Fill out form with valid data
- [ ] Submit the form
- [ ] Verify success message appears
- [ ] Check Baserow table - new row should appear with:
  - [ ] Your name
  - [ ] Your email
  - [ ] Comment (if provided)
  - [ ] Correct Event ID
  - [ ] Correct Event Title
  - [ ] Registered at timestamp

### 7. Validation Testing
- [ ] Try submitting without name - should show error
- [ ] Try submitting without email - should show error
- [ ] Try submitting with invalid email format - should show error
- [ ] All validations should show appropriate error messages

### 8. Capacity Limits
- [ ] Submit registrations until capacity is reached (5 in test event)
- [ ] Try to submit one more registration
- [ ] Should receive "RSVP capacity reached" error

### 9. Deadline Testing
- [ ] Edit test event in Contentful
- [ ] Set `rsvpDeadline` to a past date
- [ ] Publish changes
- [ ] Visit event page
- [ ] Should show "Registration for this event has closed" instead of form

### 10. Rate Limiting (Optional)
- [ ] Try submitting form 4 times quickly
- [ ] 4th submission should be rate limited
- [ ] Should see "Too many requests" error

### 11. Spam Protection
- [ ] Honeypot field is hidden and not visible to users
- [ ] Regular users can submit successfully
- [ ] (Bots filling honeypot would get fake success message)

### 12. Multiple Events
- [ ] Create a second test event with RSVP enabled
- [ ] Submit registration to second event
- [ ] Check Baserow - should have rows for both events
- [ ] Verify you can filter by Event ID or Event Title

### 13. RSVP Disabled
- [ ] Create or edit an event with `rsvpEnabled` set to `false`
- [ ] Visit event page
- [ ] Verify no RSVP section appears at all

## Troubleshooting

If something doesn't work:

1. **Check Netlify Function Logs**
   - Go to Netlify dashboard > Functions
   - Check logs for `rsvp-submit` function
   - Look for error messages

2. **Verify Environment Variables**
   - Netlify dashboard > Site settings > Environment variables
   - All three Baserow variables should be set
   - Try redeploying after setting variables

3. **Check Browser Console**
   - Open browser developer tools (F12)
   - Look for JavaScript errors
   - Check Network tab for failed requests

4. **Baserow API Access**
   - Verify token has correct permissions
   - Try making a test API call manually
   - Check Baserow API documentation

5. **Contentful Fields**
   - Verify field names match exactly
   - Check field types are correct
   - Ensure event has all required fields

## Success Criteria

✅ The feature is working correctly if:
- RSVP form appears on events when enabled
- Form submissions create records in Baserow
- Capacity limits are enforced
- Deadline checks work correctly
- Form is hidden when RSVP is disabled or closed
- All validation works as expected
- No console errors or warnings

## Support

If you encounter issues not covered here:
1. Check the main documentation in `RSVP_FEATURE.md`
2. Review examples in `RSVP_EXAMPLES.md`
3. Contact the development team
