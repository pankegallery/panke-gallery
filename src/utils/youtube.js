// YouTube recordings on event pages (#75). Editors paste a normal YouTube
// link into the Contentful field `recordingUrl`; the page only ever embeds
// it through youtube-nocookie.com, and only after a click (#60).

// `youtube.com/watch?v=<id>` (with or without www and further parameters)
// and the short form `youtu.be/<id>`. Video IDs are 11 characters long.
const YOUTUBE_ID = /^https:\/\/(?:(?:www\.)?youtube\.com\/watch\?(?:.*&)?v=|youtu\.be\/)([A-Za-z0-9_-]{11})(?:[&?#]|$)/

/**
 * The video ID of a YouTube link.
 *
 * @param {string} [url] - A `youtube.com/watch?v=…` or `youtu.be/…` link.
 * @returns {string|null} The 11-character ID, or null if the link has another
 *   form (a playlist or channel link, say), so the page can leave it out.
 */
export const getYouTubeId = (url) => {
  const match = url?.trim().match(YOUTUBE_ID)
  return match ? match[1] : null
}

/**
 * Embed URL on YouTube's privacy-enhanced domain. `autoplay=1` because the
 * visitor already clicked to watch, so a second click on YouTube's own play
 * button isn't needed. `rel=0` keeps suggestions at the end to our channel.
 *
 * @param {string} id - Video ID from `getYouTubeId`.
 * @returns {string} The iframe URL.
 */
export const getYouTubeEmbedUrl = (id) =>
  `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`
