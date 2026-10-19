import { useEffect, useRef } from 'react'

// Email addresses never appear as `name@domain` in the server-rendered HTML,
// where address harvesters read them. Pages show `name [at] domain` instead,
// and the real mailto link is only built in the browser after hydration
// (#62). Without JavaScript the `[at]` text stays as a readable fallback.

// `info [at] panke.gallery`, with or without spaces around `[at]`.
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
 * Turns every `name [at] domain` in the text of `root` into a mailto link.
 *
 * For HTML from Contentful, which React renders with dangerouslySetInnerHTML
 * and never diffs inside, so changing those nodes after hydration is safe.
 * Do not run it on markup React renders itself; use EmailLink there.
 * Running it twice is harmless: linked text no longer contains `[at]`.
 *
 * @param {HTMLElement} root - Container of the Contentful HTML.
 */
export function linkObfuscatedEmails(root) {
  if (!root) return

  const textNodes = []
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT)
  while (walker.nextNode()) {
    const node = walker.currentNode
    OBFUSCATED_EMAIL.lastIndex = 0
    // Leave text alone that editors already put inside a link.
    if (OBFUSCATED_EMAIL.test(node.nodeValue) && !node.parentElement.closest('a')) {
      textNodes.push(node)
    }
  }

  textNodes.forEach((node) => {
    const text = node.nodeValue
    const fragment = document.createDocumentFragment()
    let last = 0

    for (const match of text.matchAll(OBFUSCATED_EMAIL)) {
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
