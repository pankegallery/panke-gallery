import React from 'react'

// Matches http(s):// URLs and bare www.* domains. Has a capturing group so
// String.split() below splices the matches themselves into the result,
// interleaved with the surrounding plain text.
const URL_PATTERN = /(https?:\/\/[^\s]+|www\.[^\s]+)/gi

// Trailing characters that read as sentence/bracket punctuation rather than
// part of the URL itself, e.g. "see (https://x.com)." or "visit https://x.com."
const TRAILING_PUNCTUATION = /[).,;:!?'"\]]+$/

// Turns any http(s)/www URL in freeform, editor-authored text (Baserow
// descriptions, transcripts) into a link that opens in a new tab. Returns
// an array of strings/elements rather than a string, so it can be dropped
// straight into JSX, e.g. <p>{linkify(text)}</p>.
export const linkify = text => {
  if (!text) return text

  return text.split(URL_PATTERN).map((part, index) => {
    // Odd indices are exactly the captured URLs — split() interleaves them
    // with the plain-text segments in order.
    if (index % 2 === 0) return part

    const trailingMatch = part.match(TRAILING_PUNCTUATION)
    const trailing = trailingMatch ? trailingMatch[0] : ''
    const url = trailing ? part.slice(0, -trailing.length) : part
    const href = url.startsWith('www.') ? `https://${url}` : url

    return (
      <React.Fragment key={index}>
        <a href={href} target="_blank" rel="noopener noreferrer">
          {url}
        </a>
        {trailing}
      </React.Fragment>
    )
  })
}
