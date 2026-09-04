# Audioguide — Project Specification

Status: draft, for task breakdown
Owner: panke.gallery
Last updated: 2026-09-04

## 1. Goal

Add a self-guided audioguide to the panke.gallery exhibition site. Requirements:

- Free / open-source only — no paid services, no per-visitor fees, no vendor lock-in.
- Built on top of existing infrastructure: Gatsby (site), Netlify (hosting), Contentful (main site CMS), Nextcloud (self-hosted file storage), Baserow (self-hosted database).
- Usable, accessible, and privacy-respecting (no tracking, no login, no unnecessary third-party requests).
- Low admin overhead — content editors should not need to touch code or use git.
- Audience is technically literate and privacy-conscious; open-source and self-hosted choices are a feature, not just a cost-saving measure.

## 2. Architecture overview

| Layer | Tool | Notes |
|---|---|---|
| Main site content | Contentful | Unchanged, existing pipeline |
| Audioguide stop data | Baserow | New table, one row per artwork/stop |
| Audio files | Nextcloud | Public share links, pasted into Baserow |
| Site + player | Gatsby | New page template, generated per stop |
| Hosting | Netlify | Unchanged — audio never passes through Netlify's bandwidth |
| QR codes | Generated at Gatsby build time from Baserow data | Rendered on a `/print-sheet` page |

Key design decision: **audio bytes are never served through Netlify or Contentful.** Both have free-tier bandwidth ceilings (Netlify: reduced/credit-based free bandwidth as of 2026; Contentful Community: 50GB/month CDN bandwidth with a hard cutoff on delivery API when exceeded) that a popular audioguide could realistically hit. Routing audio through self-hosted Nextcloud removes this risk entirely and keeps the gallery in full control of its own media.

## 3. Content workflow (editorial)

1. Editor records/prepares audio file (see §6 for format guidance).
2. Editor uploads file to a Nextcloud folder (e.g. via desktop sync client or web upload) and creates a public share link.
3. Editor adds/edits a row in the Baserow "Audioguide" table with:
   - Reference number (stable identifier, printed on wall labels — see §5)
   - Artwork name
   - Artist
   - Description / curatorial text
   - Nextcloud public share link (audio file URL)
   - Exhibition slug (relates the stop to its Contentful exhibition — see §4)
   - Optional: artwork image, transcript, duration, room/order, language
4. Next Gatsby build/deploy picks up the new/changed row automatically — no manual step beyond triggering a Netlify build (or wait for scheduled/webhook build).

No git, no code, no CMS-specific training beyond "add a row to this table" is required for day-to-day content changes.

## 4. Data model (Baserow table: `Audioguide`)

| Field | Type | Required | Notes |
|---|---|---|---|
| `reference_number` | Text/Number | Yes | Stable ID, used in URL path and printed on labels (e.g. `03`) |
| `artwork_name` | Text | Yes | |
| `artist` | Text | No | |
| `description` | Long text | Yes | Shown on the stop page |
| `audio_url` | URL | Yes | Nextcloud public share/direct-download link |
| `exhibition_slug` | Text | Yes | Contentful `Exhibition.slug` this stop belongs to (matches the field used to build `/exhibitions/{slug}` pages, e.g. `src/templates/exhibition.js`). Populate now for the upcoming exhibition even though the automated link/overview page (below) is deferred. |
| `transcript` | Long text | Recommended | Accessibility — always ship a transcript alongside audio |
| `duration` | Text | No | Display only, e.g. "4:30" |
| `room` / `order` | Number/Text | No | For sequential tour ordering, if desired |
| `language` | Text | No | If multilingual guides are planned |
| `artwork_image` | Image | No | Optional artwork image for display |

## 5. Site structure

### 5.1 Per-stop pages

- New Gatsby page template: `src/templates/guide-stop.js`
- Generated once per Baserow row via `createPages` in `gatsby-node.js` (standard Gatsby CMS-to-pages pattern, same shape as how Contentful pages are already generated).
- Route: `panke.gallery/guide/{reference_number}` (e.g. `/guide/03`) — **not** a slugified title, so the URL and printed QR code stay stable even if the artwork name/description is edited later.
- Page contents:
  - Artwork name, artist, description
  - `<audio>` element (or richer player component, see §7), `src` = the Nextcloud `audio_url`
  - Transcript (visible or expandable)
  - Optional: link back to the exhibition page, next/previous stop navigation

### 5.2 Print sheet page

- Route: `panke.gallery/print-sheet` (see §8 for full QR/print-sheet spec).
- Not intended for visitors — used internally to produce printed labels. Consider gating with Netlify basic-auth/password protection (free feature) since it has no visitor-facing value.

## 6. Audio file preparation

- Format: Opus or AAC, **mono**, 64–96 kbps — sufficient quality for spoken narration at roughly a third the file size of a default 128kbps stereo MP3 export.
- Tooling: `ffmpeg` (open source) for encoding/compression.
- Keep individual files well under any platform limits (not a practical concern at these bitrates for typical stop lengths).

## 7. Player implementation

Two viable approaches — decide based on desired feature set vs. build effort:

**A. Plain `<audio>` element inside the Gatsby page template**
- Minimal effort, full control, no new dependency.
- No offline caching or advanced UI out of the box.

**B. Adopt [AudioGuideKit](https://audioguidekit.org/) (MIT-licensed React player) component(s) inside the same Gatsby page template**
- Provides: offline caching (service worker), fullscreen player, transcript display, progress tracking — without adopting its whole separate app scaffold.
- Worth it primarily if offline playback (weak/no signal in parts of the gallery) is a priority; can be added later without changing the URL structure or data model.

**Action item:** verify Nextcloud's HTTP `Range` header support on the actual instance/version before finalizing the player (`curl -I -H "Range: bytes=100-200" <share-link>/download` should return `206 Partial Content`). If unsupported, seeking will restart playback from the beginning rather than jumping — a UX tradeoff, not a blocker. A prefetch-to-blob approach (fetch full file once, play from memory) sidesteps this entirely and is what AudioGuideKit's offline mode effectively does anyway.

## 8. QR code generation

- Library: `qrcode` (npm, open source), generating SVG strings directly — no external QR-generator service.
- Generated at build time in `gatsby-node.js`, looping over the same Baserow rows used to create the `/guide/{reference_number}` pages.
- **Each QR code encodes the Gatsby page URL** (`https://panke.gallery/guide/03`), **not** the raw Nextcloud file link. This indirection means:
  - Audio files can be replaced/moved/re-encoded in Nextcloud without reprinting any QR code — only the Baserow row's `audio_url` needs updating.
  - The page provides visitor context (title, description, transcript) that a bare file link cannot.
- All generated SVGs are rendered together on the `/print-sheet` page, laid out in a grid with each artwork's reference number and name printed beneath its code.
- A print stylesheet (`@media print`, `@page { size: A4; }`) makes the page paginate correctly onto A4 sheets via the browser's own Print → Save as PDF / print dialog — no PDF-generation library needed.
- Regenerating labels is just: edit Baserow → rebuild site → reopen `/print-sheet` → print. Always in sync with current data, no manual export step to forget.

## 9. Privacy & accessibility

- No login, no cookies, no autoplay permission prompts.
- No third-party analytics/tracking scripts on guide pages. If usage stats are wanted later, use a self-hostable/privacy-respecting option (e.g. Plausible, GoatCounter) rather than anything that fingerprints visitors.
- Every audio stop ships with a text transcript (accessibility for deaf/hard-of-hearing visitors, and usable without headphones/audio).
- No new external dependency is introduced beyond what the gallery already runs (Nextcloud) and free npm packages resolved at build time.

## 10. Open items / decisions needed before implementation

- [ ] Confirm Nextcloud Range-header support on current instance/version (§7).
- [ ] Decide plain `<audio>` vs. AudioGuideKit component adoption (§7).
- [ ] Confirm Baserow API token/auth approach for build-time fetch (no official Gatsby-Baserow source plugin exists; plan is a custom `sourceNodes` function using Baserow's REST API, ~30 lines).
- [ ] Decide whether tour order/navigation (next/previous) is needed for v1 or can be added later.
- [ ] Decide print-sheet access control (basic auth vs. build-only/branch-only).
- [ ] Confirm target audio bitrate/format with whoever records narration.
- [ ] Decide whether to auto-add an audioguide link on the matching exhibition page (via `exhibition_slug`) when at least one stop with an `audio_url` exists for that exhibition.
- [ ] Decide whether to build an audioguide overview page per exhibition (grouping stops by `exhibition_slug`, pulling exhibition title/dates from Contentful).

## 11. Suggested task breakdown

1. Create Baserow "Audioguide" table with schema from §4.
2. Write custom Gatsby source function to fetch Baserow rows at build time.
3. Build `src/templates/guide-stop.js` page template + `createPages` wiring.
4. Implement audio player (plain `<audio>` for v1; evaluate AudioGuideKit component later).
5. Add transcript rendering + basic accessibility pass.
6. Implement QR generation step in `gatsby-node.js` (`qrcode` package).
7. Build `/print-sheet` page + print stylesheet.
8. Test Nextcloud Range-header behavior; adjust player strategy if needed.
9. Populate Baserow with real content + Nextcloud audio links for the first exhibition.
10. Print and place labels; QA end-to-end (scan → page → playback) in the gallery space.
