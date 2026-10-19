import React, { useEffect, useState } from 'react'
import { joinEmail, obfuscateEmail } from '../utils/email-address'

/**
 * Email address that harvesters can't read from the static HTML (#62).
 *
 * The server-rendered page only has `user [at] domain`, which also stays as
 * the fallback without JavaScript. After hydration it becomes a normal
 * mailto link. For addresses inside Contentful text, see
 * `linkObfuscatedEmails` in utils/email-address.js, which builds the same
 * link.
 *
 * @param {object} props
 * @param {string} props.user - Part before the @, e.g. `info`.
 * @param {string} props.domain - Part after the @, e.g. `panke.gallery`.
 * @param {string} [props.label] - Link text; defaults to the address. Only
 *   shown once the link is built, the fallback is always the `[at]` text.
 */
const EmailLink = ({ user, domain, label }) => {
  // Effects don't run during server rendering, so the address is only
  // assembled in the browser. Rendering the `[at]` text on the first client
  // render too keeps hydration in sync with the server HTML.
  const [isLinked, setIsLinked] = useState(false)

  useEffect(() => {
    setIsLinked(true)
  }, [])

  if (!isLinked) return obfuscateEmail(user, domain)

  const email = joinEmail(user, domain)
  return <a href={`mailto:${email}`}>{label || email}</a>
}

export default EmailLink
