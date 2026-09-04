# Audioguide — Task Breakdown

Companion to [SPECS.md](SPECS.md). Split into three phases so work can be picked up by an AI coding agent one phase at a time. Each task lists the files it touches and how to tell it's done. Phase 1 is scoped tightly to ship by Monday; phases 2–3 are follow-ups, not blockers for the first exhibition.

---

## Phase 1 — Monday deadline (minimal dev time)

Goal: a working `/guide/{reference_number}` page per artwork, a `/print-sheet` with QR codes, plain `<audio>` playback, styled to match the rest of the site. No fancy player, no overview page, no auto-linking yet.

### 1.1 Baserow → Gatsby data source

- [ ] Add a Baserow API token as an env var, following the existing Contentful pattern in [gatsby-config.js](gatsby-config.js) (`.env.${NODE_ENV}`, read via `dotenv`). Name it `BASEROW_API_TOKEN`; also add `BASEROW_AUDIOGUIDE_TABLE_ID`.
- [ ] Write a custom `sourceNodes` function (in `gatsby-node.js` or a new `gatsby/source-baserow.js` required from it) that fetches all rows from the Baserow "Audioguide" table via its REST API (`node-fetch` is already a dependency — no new HTTP client needed) and creates a Gatsby node per row, typed e.g. `AudioguideStop`.
- [ ] Fields to bring in at minimum: `reference_number`, `artwork_name`, `artist`, `description`, `audio_url`, `exhibition_slug`, `transcript` (nullable — don't fail the build if empty).
- [ ] Acceptance: `gatsby develop` runs without errors and `AudioguideStop` nodes are queryable in GraphiQL (`http://localhost:8000/___graphql`).

### 1.2 Per-stop page template

- [ ] Create `src/templates/guide-stop.js`, modeled on `src/templates/exhibition.js` (same `Layout` wrapper, same `Helmet` title pattern, same `get(this.props, 'data...')` style).
- [ ] Wire it up in `gatsby-node.js`'s `createPages`: one `createPage` call per `AudioguideStop` node, `path: /guide/${reference_number}/`, `context: { reference_number }` (mirror how exhibitions/events/editions are created in the same file).
- [ ] Page content, in order: artwork name (`h1`), artist, description, a plain `<audio controls src={audio_url} />`, transcript below the player if present (plain text block, not expandable yet — that's phase 2).
- [ ] Reuse existing styled-components rather than inventing new ones: `HeadSection` / `InfoSection` / `Meta` from [Content.styles.js](src/components/content/Content.styles.js) for headings and layout rhythm, `Row`/`Col` from [Layout.styles.js](src/components/layout/Layout.styles.js) for the two-column about-style layout. Match the uppercase-letter-spaced `h1`/`h2` treatment already used on the exhibition template — don't introduce new type scale.
- [ ] Acceptance: visiting `/guide/{reference_number}/` for a real Baserow row renders a page that looks like a sibling of `/exhibition/{slug}/` (same header, footer, color-swap, container width), not a bare unstyled page.

### 1.3 QR code generator + print sheet

- [ ] `npm install qrcode` (MIT, SVG output, no external service — per SPECS §8).
- [ ] In `gatsby-node.js`, after creating the per-stop pages, generate an SVG string per row with `qrcode`, encoding the **full production page URL** (not the raw Nextcloud link). Before wiring this: check [gatsby-config.js](gatsby-config.js)'s `pathPrefix: '/panke-gallery'` — confirm whether it's active in production (i.e. whether the real URL is `panke.gallery/panke-gallery/guide/03` or `panke.gallery/guide/03`) so the encoded URL is correct the first time.
- [ ] Pass the generated SVGs + row data (reference number, artwork name) into a new `src/pages/print-sheet.js` via `createPage` context (or a page query against the `AudioguideStop` nodes — pick whichever is less code).
- [ ] Print sheet layout: grid of QR codes, each with reference number + artwork name printed beneath, using the existing `Row`/`Col` grid rather than a new grid system.
- [ ] Add a print stylesheet (`@media print`, `@page { size: A4; }`) so the browser's Print → Save as PDF paginates cleanly.
- [ ] Acceptance: `/print-sheet/` shows one QR per Baserow row; scanning one with a phone camera opens the correct `/guide/{reference_number}/` page; Print Preview shows a clean A4 grid with no cut-off codes.

### 1.4 Non-dev, parallel track (editor, not agent)

- [ ] Editor populates the Baserow "Audioguide" table for the upcoming exhibition's artworks, including `exhibition_slug` (must match the Contentful `Exhibition.slug` for that show exactly — check `/exhibition/{slug}/` in the live site or Contentful entry).
- [ ] Nextcloud share links created and pasted into `audio_url` before the Monday build.

---

## Phase 2 — Neat-looking stop page, fancy player

Not required for the first exhibition to go live; do once Phase 1 is stable and there's a signal that the guide is actually being used.

- [ ] Decide plain-`<audio>`-with-custom-UI vs. adopting [AudioGuideKit](https://audioguidekit.org/) components (SPECS §7, option B) — evaluate bundle size / integration effort vs. building a custom player with play/pause, scrubber, and elapsed/remaining time using the native `<audio>` element's API.
- [ ] Verify Nextcloud's `Range` header support on the real instance (`curl -I -H "Range: bytes=100-200" <share-link>/download`, expect `206 Partial Content`) — determines whether seeking works or whether a prefetch-to-blob approach is needed (SPECS §7 action item).
- [ ] Build the chosen player as a component (e.g. `src/components/audio-player.js` + `.styles.js`) so `guide-stop.js` stays a thin page shell — keep it in the panke.gallery visual language (theme colors/fonts from `src/theme/theme.js`), not a copy of AudioGuideKit's default skin.
- [ ] Make the transcript expandable/collapsible instead of always-visible plain text.
- [ ] Add next/previous stop navigation if `room`/`order` is populated in Baserow (SPECS §10 open item — confirm with editorial whether this is wanted before building it).
- [ ] Accessibility pass: keyboard-operable player controls, visible focus states, transcript reachable without audio.

---

## Phase 3 — Exhibition overview page + other ideas

- [ ] Audioguide overview page per exhibition: group `AudioguideStop` nodes by `exhibition_slug`, pull the exhibition's title/dates from Contentful (same query shape as `exhibition.js`), list all stops with links. Route suggestion: `/guide/{exhibition_slug}/` as an index, with individual stops staying at `/guide/{reference_number}/` (already unique per SPECS §5.1 — no collision).
- [ ] Auto-link from the exhibition page: in `src/templates/exhibition.js`, if any `AudioguideStop` exists with a matching `exhibition_slug` and non-empty `audio_url`, render a link/button to the guide overview page. Needs the `exhibition_slug` cross-reference from Phase 1 — already in the data model, no Baserow schema change needed.
- [ ] Print-sheet access control decision (SPECS §10): Netlify basic auth vs. leaving it unlinked/unindexed. Low priority since it has no visitor-facing value, but worth closing out before it's forgotten.
- [ ] Multilingual support if/when `language` rows start being used — likely just a filter on the overview page plus a language switcher on stop pages, no data model change needed.
- [ ] Usage stats, only if requested: self-hosted/privacy-respecting option (Plausible or GoatCounter), scoped to `/guide/*` and `/exhibition/*` pages only — no tracking scripts anywhere else per SPECS §9.