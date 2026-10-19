import { useEffect, useRef } from 'react'

// Email addresses never appear as `name@domain` in the server-rendered HTML,
// where address harvesters read them. Pages show `name [at] domain` instead,
// and the real mailto link is only built in the browser after hydration
// (#62). Without JavaScript the `[at]` text stays as a readable fallback.

// `info [at] panke.gallery`, with or without spaces around `[at]`.
// Only use it with matchAll and replace. replace resets lastIndex itself, but
// matchAll starts at it, and test() or exec() would leave it at the end of a
// match, so an address in the last text node of a block would not be linked.
const OBFUSCATED_EMAIL = /([\w.+-]+)\s*\[at\]\s*([\w-]+(?:\.[\w-]+)+)/g

/**
 * The text shown before hydration and without JavaScript.
 *
 * @param {string} user - Part before the @, e.g. `info`.
 * @param {string} domain - Part after the @, e.g. `panke.gallery`.
 * @returns {string} e.g. `info [at] panke.gallery`
 */
export const obfuscateEmail = (user, domain) => `${user} [at] ${domain}`

/**
 * The real address, assembled at runtime so it is never in the static HTML.
 *
 * @param {string} user - Part before the @.
 * @param {string} domain - Part after the @.
 * @returns {string} `user` and `domain` joined with an @.
 */
export const joinEmail = (user, domain) => `${user}@${domain}`

/**
 * Replaces every `name [at] domain` in a string with the real address.
 *
 * @param {string} text - e.g. `write to info [at] panke.gallery`.
 * @returns {string} e.g. `write to info@panke.gallery`
 */
const revealEmails = (text) =>
  text.replace(OBFUSCATED_EMAIL, (whole, user, domain) => joinEmail(user, domain))

/**
 * Turns every `name [at] domain` in the text of `root` into a mailto link,
 * and repairs mailto links whose address editors wrote with `[at]`, e.g.
 * `mailto:info[at]panke.gallery?subject=…`, keeping subject and body.
 *
 * For HTML from Contentful, which React renders with dangerouslySetInnerHTML
 * and never diffs inside, so changing those nodes after hydration is safe.
 * Do not run it on markup React renders itself; use EmailLink there.
 * Running it twice is harmless: linked text and repaired links no longer
 * contain `[at]`.
 *
 * @param {HTMLElement} root - Container of the Contentful HTML.
 */
export function linkObfuscatedEmails(root) {
  if (!root) return

  const found = []
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT)
  while (walker.nextNode()) {
    const node = walker.currentNode
    const matches = [...node.nodeValue.matchAll(OBFUSCATED_EMAIL)]
    // Text inside links is handled with its link below.
    if (matches.length && !node.parentElement.closest('a')) {
      found.push({ node, matches })
    }
  }

  found.forEach(({ node, matches }) => {
    const text = node.nodeValue
    const fragment = document.createDocumentFragment()
    let last = 0

    for (const match of matches) {
      const [whole, user, domain] = match
      const email = joinEmail(user, domain)
      const link = document.createElement('a')
      link.href = `mailto:${email}`
      link.textContent = email

      fragment.append(text.slice(last, match.index), link)
      last = match.index + whole.length
    }

    fragment.append(text.slice(last))
    node.replaceWith(fragment)
  })

  // Mailto links written with `[at]`: only the address before the `?` is
  // decoded and replaced, the query (subject, body) stays byte for byte.
  // Without JavaScript the link still opens the mail client with subject and
  // body, but the recipient reads `info[at]panke.gallery`.
  root.querySelectorAll('a[href^="mailto:" i]').forEach((link) => {
    const href = link.getAttribute('href')
    const queryStart = href.indexOf('?')
    const addressEnd = queryStart === -1 ? href.length : queryStart

    let address
    try {
      // remark encodes markdown link URLs, e.g. `info%5Bat%5Dpanke.gallery`.
      address = decodeURIComponent(href.slice('mailto:'.length, addressEnd))
    } catch {
      return // Malformed escape: leave the link as the editor wrote it.
    }
    if (!address.includes('[at]')) return

    link.setAttribute('href', `mailto:${revealEmails(address.trim())}${href.slice(addressEnd)}`)

    // Link text that is an `[at]` address shows the real one; other text,
    // e.g. "contact us", stays.
    const linkWalker = document.createTreeWalker(link, NodeFilter.SHOW_TEXT)
    while (linkWalker.nextNode()) {
      const node = linkWalker.currentNode
      node.nodeValue = revealEmails(node.nodeValue)
    }
  })
}

/**
 * Runs linkObfuscatedEmails on an element once it is in the page: after
 * hydration on a direct load, after mounting on client-side navigation, and
 * again whenever the HTML changes, because React then replaces the element's
 * content and the links with it.
 *
 * @param {string} html - The HTML rendered into the element.
 * @returns {React.RefObject<HTMLElement>} Ref for that element.
 */
export function useLinkedEmails(html) {
  const ref = useRef(null)

  useEffect(() => {
    linkObfuscatedEmails(ref.current)
  }, [html])

  return ref
}
