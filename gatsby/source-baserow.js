// Fetches rows from the Baserow "Audioguide" table and creates one
// `AudioguideStop` Gatsby node per row.
//
// Reuses the BASEROW_TOKEN / BASEROW_URL env vars already used by the RSVP
// Netlify function (netlify/functions/rsvp-submit.js) — same Baserow
// instance, same token, just a different table. Only the table id differs,
// via BASEROW_AUDIOGUIDE_TABLE_ID.
//
// Expected Baserow field names (must match exactly, case-sensitive):
// Reference Number, Artwork Name, Artist, Description, Audio URL,
// Exhibition Slug, Transcript, Artwork Image (optional).

const fetch = require('node-fetch')

// A Nextcloud public share link (what "Copy link" gives editors, e.g.
// https://host/s/<token>) serves an HTML preview page, not the audio file —
// only appending /download returns the actual bytes with the right
// Content-Type (see SPECS.md §7). Normalize here so editors can paste the
// plain share link without needing to know about /download.
function toDirectDownloadUrl(rawUrl) {
  const trimmed = String(rawUrl || '').trim()
  if (!trimmed) return trimmed

  try {
    const parsed = new URL(trimmed)
    if (!/\/download\/?$/.test(parsed.pathname)) {
      parsed.pathname = `${parsed.pathname.replace(/\/+$/, '')}/download`
    }
    return parsed.toString()
  } catch (err) {
    return trimmed
  }
}

const FIELDS = {
  referenceNumber: 'Reference Number',
  artworkName: 'Artwork Name',
  artist: 'Artist',
  description: 'Description',
  audioUrl: 'Audio URL',
  exhibitionSlug: 'Exhibition Slug',
  transcript: 'Transcript',
  artworkImage: 'Artwork Image',
}

// Baserow file fields come back as an array of attachments; take the first one's URL.
function firstAttachmentUrl(value) {
  return (Array.isArray(value) && value.length > 0 && value[0].url) || null
}

exports.sourceNodes = async ({ actions, createNodeId, createContentDigest }) => {
  const { createNode } = actions

  const baserowUrl = process.env.BASEROW_URL
  const baserowToken = process.env.BASEROW_TOKEN
  const tableId = process.env.BASEROW_AUDIOGUIDE_TABLE_ID

  if (!baserowUrl || !baserowToken || !tableId) {
    console.warn(
      'Audioguide: BASEROW_URL, BASEROW_TOKEN or BASEROW_AUDIOGUIDE_TABLE_ID is not set — skipping AudioguideStop nodes.'
    )
    return
  }

  const rows = []
  let url = `${baserowUrl}/api/database/rows/table/${tableId}/?user_field_names=true&size=200`

  while (url) {
    const response = await fetch(url, {
      headers: { Authorization: `Token ${baserowToken}` },
    })

    if (!response.ok) {
      throw new Error(
        `Audioguide: failed to fetch Baserow rows (${response.status}): ${await response.text()}`
      )
    }

    const data = await response.json()
    rows.push(...data.results)
    url = data.next
  }

  rows.forEach(row => {
    const referenceNumber = String(row[FIELDS.referenceNumber] || '').trim()

    if (!referenceNumber) {
      console.warn(`Audioguide: skipping Baserow row ${row.id} — missing Reference Number.`)
      return
    }

    const nodeContent = {
      referenceNumber,
      artworkName: row[FIELDS.artworkName] || '',
      artist: row[FIELDS.artist] || '',
      description: row[FIELDS.description] || '',
      audioUrl: toDirectDownloadUrl(row[FIELDS.audioUrl]),
      exhibitionSlug: row[FIELDS.exhibitionSlug] || '',
      transcript: row[FIELDS.transcript] || null,
      artworkImage: firstAttachmentUrl(row[FIELDS.artworkImage]),
    }

    createNode({
      ...nodeContent,
      id: createNodeId(`AudioguideStop-${row.id}`),
      parent: null,
      children: [],
      internal: {
        type: 'AudioguideStop',
        contentDigest: createContentDigest(nodeContent),
      },
    })
  })
}
