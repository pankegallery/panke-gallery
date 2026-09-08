import React, { useState, useEffect } from 'react';

import { isAuthenticated, rememberAuthenticated } from '../utils/codes-auth';
import { Screen, Form, Input, Submit, ErrorNote } from './password-gate/PasswordGate.styles';

// Not real access control — this is a static site, so the page's own markup
// is still fetchable directly by anyone who knows to look, password or not.
// This only stops a casual visitor or crawler from ever seeing it rendered.
// The password check itself happens server-side (see codes-auth-check
// Netlify Function) so the real value is never in the repo or the JS bundle.
const PasswordGate = ({ children }) => {
  const [unlocked, setUnlocked] = useState(false)
  const [checked, setChecked] = useState(false)
  const [value, setValue] = useState('')
  const [error, setError] = useState(false)
  const [checking, setChecking] = useState(false)

  useEffect(() => {
    setUnlocked(isAuthenticated())
    setChecked(true)
  }, [])

  const handleSubmit = async e => {
    e.preventDefault()
    setChecking(true)
    setError(false)

    try {
      const response = await fetch('/.netlify/functions/codes-auth-check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: value }),
      })
      const data = await response.json()

      if (data.ok) {
        rememberAuthenticated()
        setUnlocked(true)
      } else {
        setError(true)
      }
    } catch (err) {
      // Also covers `gatsby develop` without `netlify dev` — the function
      // endpoint doesn't exist there, so this fails the same way a wrong
      // password would rather than throwing an unhandled error.
      setError(true)
    } finally {
      setChecking(false)
    }
  }

  if (!checked) return null

  if (!unlocked) {
    return (
      <Screen>
        <Form onSubmit={handleSubmit}>
          <p>This page is password-protected.</p>
          <Input
            type="password"
            value={value}
            onChange={e => {
              setValue(e.target.value)
              setError(false)
            }}
            placeholder="Password"
            autoFocus
          />
          <Submit type="submit" disabled={checking}>
            {checking ? 'Checking…' : 'Continue'}
          </Submit>
          {error && <ErrorNote>That password isn't right.</ErrorNote>}
        </Form>
      </Screen>
    );
  }

  return children;
};

export default PasswordGate;
