# Audioguide — Specification

**Status:** implemented and live · a handful of open decisions remain — jump to [Open decisions](#open-decisions)
**Last updated:** 2026-09-09 · **Companion doc:** [AUDIOGUIDE_TASKS.md](AUDIOGUIDE_TASKS.md) (implementation reference, file by file)

A self-guided audioguide for the panke.gallery exhibition site: visitors scan a QR code next to an artwork and get a page with the audio, a transcript, and the curatorial text.

<br>

## Goal

- Free / open-source only — no paid services, no per-visitor fees, no vendor lock-in.
- Built on infrastructure the gallery already runs: Gatsby (site), Netlify (hosting), Contentful (main site CMS), Nextcloud (self-hosted files), Baserow (self-hosted database).
- Privacy-respecting — no tracking, no login, no unnecessary third-party requests.
- Low admin overhead — an editor adds rows to a table; no code or git for day-to-day changes.

<br>

## Architecture

| Layer | Tool | Notes |
|---|---|---|
| Main site content | Contentful | Unchanged, existing pipeline |
| Audioguide stop data | Baserow | One table, one row per artwork/stop *per language* |
| Audio files | Nextcloud | Public share links, pasted into Baserow |
| Site + player | Gatsby | Pages generated per stop / exhibition at build time |
| Hosting | Netlify | Audio never passes through Netlify's bandwidth |
| QR codes | Generated at build time | Rendered on `/codes` pages |

> [!IMPORTANT]
> **Audio bytes are never served through Netlify or Contentful.** Both have free-tier bandwidth ceilings a popular audioguide could realistically hit. Self-hosted Nextcloud removes that risk and keeps the gallery in control of its own media.

<br>

## Editorial workflow

1. Editor records/prepares an audio file — see [Audio file preparation](#audio-file-preparation).
2. Uploads it to Nextcloud, creates a public share link.
3. Adds/edits a row in the Baserow `Audioguide` table — see [Data model](#data-model).
4. Next Gatsby build picks the change up automatically.

No git, no code, no CMS training required for day-to-day content changes.

<br>

## Data model

Baserow table: `Audioguide`

| Field | Type | Required | Notes |
|---|---|---|---|
| `reference_number` | Text/Number | Yes | Stable ID *per exhibition*, printed on the wall label (e.g. `03`) |
| `artwork_name` | Text | Yes | May differ per language row |
| `artist` | Text | No | |
| `description` | Long text | Yes | May differ per language row |
| `audio_url` | URL | Yes | Nextcloud public share link |
| `exhibition_slug` | Text | Yes | Must exactly match the Contentful `Exhibition.slug` |
| `transcript` | Long text | Recommended | Ship one alongside every audio file |
| `artwork_image` | Image | No | |
| `language` | Single select | No | See [Multi-language stops](#multi-language-stops) |
| `duration` | Text | No | Display only — not currently rendered |
| `room` / `order` | Number/Text | No | For tour ordering — not currently used |

> [!NOTE]
> **"Position"** = `exhibition_slug` + `reference_number` — one wall label, one QR code, one URL. Normally one row. It's more than one row **only** when it has language variants (same slug + reference number, different `language`) — and every field can differ between those rows, not just the audio: name and description are free to be fully translated, not merely narrated differently.

> [!WARNING]
> `exhibition_slug` must be typed identically to Contentful's slug, character for character — a mismatch silently produces an exhibition page with no title/dates (falls back to showing the raw slug) rather than an error. A `Single select` field is recommended for `language` specifically because free text drifted (`"english"` vs `"English"`) in testing.

<br>

## Routes

| Route | Renders |
|---|---|
| `/guide/` | Every exhibition with stops (title/dates from Contentful) + an "Other stops" list |
| `/guide/{exhibition_slug}/` | That exhibition's stop list, name/dates in the header |
| `/guide/{exhibition_slug}/{reference_number}/` | One stop — name, artist, description, image, player |
| `/guide/stop/{reference_number}/` | Same, for a stop with no `exhibition_slug` |
| `/codes` | Print sheet, every stop grouped by exhibition — password-protected |
| `/codes/{exhibition_slug}/` | Print sheet for one exhibition only |

> [!NOTE]
> Reference numbers are only unique *within* an exhibition (they're renumbered per show) — never used alone in a URL. An earlier flat `/guide/{reference_number}/` scheme collided the moment two exhibitions both used `01`.
>
> The `stop` segment is a placeholder (`UNASSIGNED_EXHIBITION_SLUG` in `gatsby-node.js`) — renamed freely, nothing physical has been printed with it yet.

<br>

## Multi-language stops

A position becomes multi-language by adding a second Baserow row with the same `exhibition_slug` + `reference_number` and a different `language`.

**Visitor flow:**
1. Landing on a position with 2+ distinct languages → a full-screen prompt shows immediately, before anything else renders. Not gated behind tapping play.
2. Choosing a language affects **everything** for that position — name, description, image, audio, transcript.
3. The choice is remembered on-device (not scoped per exhibition) — picking "English" once carries over anywhere else "English" is offered.
4. A control in the player lets a visitor change the language later.

> [!NOTE]
> Rows with no `language` set are language-agnostic — always shown, and used as a fallback if the chosen language isn't available at a given position.
>
> Overview lists show one entry per position: whichever row matches the already-chosen language, or the first row before any choice is made.

<br>

## Audio file preparation

Format: Opus or AAC, **mono**, 64–96 kbps — good spoken-word quality at roughly a third the size of a default 128kbps stereo MP3. Encode with `ffmpeg`.

<br>

## Player

Custom-built (`src/components/audio-player.js`) — not the third-party AudioGuideKit library originally considered, for full control and no new dependency. Play/pause, scrubber, expandable transcript, language switcher when relevant, all within a full-screen view reachable from a persistent mini bar.

> [!WARNING]
> **Open:** Nextcloud's `Range` header support hasn't been verified on the real instance:
> ```
> curl -I -H "Range: bytes=100-200" <share-link>/download
> ```
> expect `206 Partial Content`. If unsupported, seeking restarts playback from the beginning — a UX tradeoff, not a blocker.

<br>

## QR codes & print sheets

- Generated at build time with `qrcode` (SVG, no external service).
- Each QR encodes the stop's **page URL**, not the raw Nextcloud link — audio can be replaced without reprinting, and the page gives context a bare file link can't.
- Each exhibition also gets an **entrance QR** (its overview page), separate from per-artwork codes.
- `/codes` (global) and `/codes/{exhibition_slug}/` (one show) both exist.

> [!CAUTION]
> **Password-protected, but not real access control** — `/codes` is a statically-generated page, so its rendered HTML (and Gatsby's own page-data JSON) exists as a plain file on the CDN regardless of the gate. It stops a casual visitor or a crawler that only looks at what's rendered/linked — which is the actual bar this needed to clear — but not a request that fetches the static files directly.
>
> The password check itself is server-side (a Netlify Function, `CODES_PASSWORD` env var) — never in the repo or the client bundle. Remembered per device for 30 days. Netlify Basic Auth is the next step up if this ever proves insufficient.

<br>

## Privacy & accessibility

- No login, no cookies, no autoplay, no third-party analytics on guide pages.
- Every stop ships with a text transcript.
- Keyboard-operable controls, visible `:focus-visible` states.
- Subtle hover (mouse-only) and `:active` (touch) feedback throughout.

<br>

## Open decisions

| # | Decision | Status |
|---|---|---|
| 1 | Nextcloud `Range` header support | Not verified |
| 2 | Tour order / next-previous navigation | Not built — `room`/`order` not even sourced from Baserow yet |
| 3 | Is the `/codes` password gate sufficient long-term, or worth Netlify Basic Auth | Password gate shipped; upgrade not decided |
| 4 | Usage stats | Only if requested — self-hosted option (Plausible/GoatCounter), scoped to `/guide/*` + `/exhibition/*` |
| 5 | No way back to the main site from the guide UI | Logo was removed to fix a layout issue; replacement not decided |

For how each of these — and everything already shipped — is actually implemented, see [AUDIOGUIDE_TASKS.md](AUDIOGUIDE_TASKS.md).
