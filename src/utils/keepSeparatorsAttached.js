// Characters that separate the parts of a headline, e.g.
// "panke.gallery • screening • 03 • The Emotional Life of the Net" or
// "Talk – Net Art Now". A hyphen inside a word ("Re-Enchanted") is not one.
const SEPARATORS = ['•', '·', '|', '–', '—', '/', '×']

const escapeForCharClass = (char) => char.replace(/[\\\]^-]/g, '\\$&')

// The spaces before a separator that stands on its own, i.e. is followed
// by a space or ends the text. "/rosa" or "3–5" have no space after the
// separator and stay as they are.
const SPACE_BEFORE_SEPARATOR = new RegExp(
  `[ \\t]+(?=[${SEPARATORS.map(escapeForCharClass).join('')}](?:\\s|$))`,
  'g'
)

const NO_BREAK_SPACE = ' '

/**
 * Keeps separators such as "•", "|" or "–" on the line of the word before
 * them, so a headline never wraps into a new line that starts with a
 * separator:
 *
 *   panke.gallery • screening • 03 •
 *   The Emotional Life of the Net
 *
 * instead of a line starting with "• The Emotional…". The space before each
 * separator becomes a non-breaking space; the one after it stays a normal
 * space, so the line breaks there. CSS has no rule for this, and doing it
 * here means editors don't have to type non-breaking spaces in Contentful.
 *
 * Use it on plain-text headlines (titles from Contentful), not on HTML.
 *
 * @param {string} text - A headline, e.g. an exhibition or event title.
 * @returns {string} The same text with non-breaking spaces before separators.
 *   Anything that isn't a string is returned unchanged.
 */
export function keepSeparatorsAttached(text) {
  if (typeof text !== 'string') return text
  return text.replace(SPACE_BEFORE_SEPARATOR, NO_BREAK_SPACE)
}
