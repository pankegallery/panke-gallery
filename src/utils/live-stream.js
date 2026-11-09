// Live streams on Twitch (#74). An event marked "Live on Twitch" in
// Contentful (`liveOnTwitch`) counts as live from its start to its end time.
// That is worked out in the visitor's browser from the event times already in
// the page: no Netlify Function, no Twitch API, nothing sent to Twitch until
// the visitor clicks "Play stream" (#60).

export const TWITCH_CHANNEL = 'pankegallery'
export const TWITCH_URL = `https://www.twitch.tv/${TWITCH_CHANNEL}`

/**
 * When an event's stream runs. Without an end time (`openEnd`, or simply
 * none entered) it runs until the end of the event's day, in the visitor's
 * time zone.
 *
 * @param {{date: string, endTime?: string, openEnd?: boolean}} event - A Contentful event node.
 * @returns {{start: Date, end: Date}|null} Null without a valid start date.
 */
export const getLiveWindow = (event) => {
  const start = new Date(event?.date)
  if (Number.isNaN(start.getTime())) return null

  const endTime = event.endTime && !event.openEnd ? new Date(event.endTime) : null
  if (endTime && endTime > start) return { start, end: endTime }

  const endOfDay = new Date(start)
  endOfDay.setHours(23, 59, 59, 999)
  return { start, end: endOfDay }
}

/**
 * Whether an event is being streamed right now.
 *
 * @param {object} event - A Contentful event node with `liveOnTwitch`, `date`, `endTime` and `openEnd`.
 * @param {Date|null} now - The current time, or null before the page runs in the browser.
 * @returns {boolean}
 */
export const isLiveNow = (event, now) => {
  if (!event?.liveOnTwitch || !now) return false
  const span = getLiveWindow(event)
  return Boolean(span) && now >= span.start && now < span.end
}

/**
 * The Twitch player URL. Twitch only plays inside the domains named in
 * `parent`, so this names the domain the page is on: panke.gallery, but also
 * a Netlify deploy preview or localhost. It is read only when the visitor
 * clicks, in the browser; the build falls back to panke.gallery.
 *
 * @returns {string} The iframe URL.
 */
export const getTwitchPlayerUrl = () => {
  const host = typeof window !== 'undefined' ? window.location.hostname : 'www.panke.gallery'
  return `https://player.twitch.tv/?channel=${TWITCH_CHANNEL}&parent=${encodeURIComponent(host)}&autoplay=true`
}
