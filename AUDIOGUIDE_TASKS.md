# Audioguide — Task Breakdown

Companion to [AUDIOGUIDE_SPECS.md](AUDIOGUIDE_SPECS.md). Split into three phases so work can be picked up by an AI coding agent one phase at a time. Each task lists the files it touches and how to tell it's done. Phase 1 is scoped tightly to ship by Monday; phases 2–3 are follow-ups, not blockers for the first exhibition.

Phase 1 shipped. A real reference-number collision (two `01` rows across different exhibitions) then surfaced in Baserow, since numbers only restart per exhibition, not globally — Phase 3 now leads with the URL restructuring that fixes this, ahead of the rest of the exhibition-overview work it was originally scoped for.

---

## Phase 1 — Monday deadline (minimal dev time)

Goal: a working `/guide/{reference_number}` page per artwork, a `/print-codes` with QR codes, plain `<audio>` playback, styled to match the rest of the site. No fancy player, no overview page, no auto-linking yet.

### 1.1 Baserow → Gatsby data source

- [x] Add a Baserow API token as an env var, following the existing Contentful pattern in [gatsby-config.js](gatsby-config.js) (`.env.${NODE_ENV}`, read via `dotenv`). Name it `BASEROW_API_TOKEN`; also add `BASEROW_AUDIOGUIDE_TABLE_ID`.
- [x] Write a custom `sourceNodes` function (in `gatsby-node.js` or a new `gatsby/source-baserow.js` required from it) that fetches all rows from the Baserow "Audioguide" table via its REST API (`node-fetch` is already a dependency — no new HTTP client needed) and creates a Gatsby node per row, typed e.g. `AudioguideStop`.
- [x] Fields to bring in at minimum: `reference_number`, `artwork_name`, `artist`, `description`, `audio_url`, `exhibition_slug`, `transcript` (nullable — don't fail the build if empty).
- [x] Acceptance: `gatsby develop` runs without errors and `AudioguideStop` nodes are queryable in GraphiQL (`http://localhost:8000/___graphql`).

### 1.2 Per-stop page template

- [x] Create `src/templates/guide-stop.js`, modeled on `src/templates/exhibition.js` (same `Layout` wrapper, same `Helmet` title pattern, same `get(this.props, 'data...')` style).
- [x] Wire it up in `gatsby-node.js`'s `createPages`: one `createPage` call per `AudioguideStop` node, `path: /guide/${reference_number}/`, `context: { reference_number }` (mirror how exhibitions/events/editions are created in the same file). *(superseded by Phase 3.1 below — path/context are now `/guide/${exhibitionSlug}/${referenceNumber}/`)*
- [x] Page content, in order: artwork name (`h1`), artist, description, a plain `<audio controls src={audio_url} />`, transcript below the player if present (plain text block, not expandable yet — that's phase 2).
- [x] Reuse existing styled-components rather than inventing new ones: `HeadSection` / `InfoSection` / `Meta` from [Content.styles.js](src/components/content/Content.styles.js) for headings and layout rhythm, `Row`/`Col` from [Layout.styles.js](src/components/layout/Layout.styles.js) for the two-column about-style layout. Match the uppercase-letter-spaced `h1`/`h2` treatment already used on the exhibition template — don't introduce new type scale.
- [x] Acceptance: visiting `/guide/{reference_number}/` for a real Baserow row renders a page that looks like a sibling of `/exhibition/{slug}/` (same header, footer, color-swap, container width), not a bare unstyled page.

### 1.3 QR code generator + print sheet

- [x] `npm install qrcode` (MIT, SVG output, no external service — per SPECS §8).
- [x] In `gatsby-node.js`, after creating the per-stop pages, generate an SVG string per row with `qrcode`, encoding the **full production page URL** (not the raw Nextcloud link). Before wiring this: check [gatsby-config.js](gatsby-config.js)'s `pathPrefix: '/panke-gallery'` — confirm whether it's active in production (i.e. whether the real URL is `panke.gallery/panke-gallery/guide/03` or `panke.gallery/guide/03`) so the encoded URL is correct the first time.
- [x] Pass the generated SVGs + row data (reference number, artwork name) into a new `src/pages/print-codes.js` via `createPage` context (or a page query against the `AudioguideStop` nodes — pick whichever is less code).
- [x] Print sheet layout: grid of QR codes, each with reference number + artwork name printed beneath, using the existing `Row`/`Col` grid rather than a new grid system.
- [x] Add a print stylesheet (`@media print`, `@page { size: A4; }`) so the browser's Print → Save as PDF paginates cleanly.
- [x] Acceptance: `/print-codes/` shows one QR per Baserow row; scanning one with a phone camera opens the correct `/guide/{reference_number}/` page; Print Preview shows a clean A4 grid with no cut-off codes.

### 1.4 Non-dev, parallel track (editor, not agent)

- [ ] Editor populates the Baserow "Audioguide" table for the upcoming exhibition's artworks, including `exhibition_slug` (must match the Contentful `Exhibition.slug` for that show exactly — check `/exhibition/{slug}/` in the live site or Contentful entry).
- [ ] Nextcloud share links created and pasted into `audio_url` before the Monday build.

---

## Phase 2 — Neat-looking stop page, fancy player

Not required for the first exhibition to go live; do once Phase 1 is stable and there's a signal that the guide is actually being used.

- [x] Decide plain-`<audio>`-with-custom-UI vs. adopting [AudioGuideKit](https://audioguidekit.org/) components (SPECS §7, option B) — decided in practice: a custom component was built, not the AudioGuideKit library.
- [ ] Verify Nextcloud's `Range` header support on the real instance (`curl -I -H "Range: bytes=100-200" <share-link>/download`, expect `206 Partial Content`) — determines whether seeking works or whether a prefetch-to-blob approach is needed (SPECS §7 action item). Not yet run.
- [x] Build the chosen player as a component (e.g. `src/components/audio-player.js` + `.styles.js`) so `guide-stop.js` stays a thin page shell — keep it in the panke.gallery visual language (theme colors/fonts from `src/theme/theme.js`), not a copy of AudioGuideKit's default skin.
- [x] Make the transcript expandable/collapsible instead of always-visible plain text — now a "Read transcript" toggle (icon + label, `TranscriptToggle` in [audio-player.js](src/components/audio-player.js)) at the bottom of the full-screen player; the transcript text itself is hidden until tapped, not just hidden behind the player-expand step.
- [ ] Add next/previous stop navigation if `room`/`order` is populated in Baserow (SPECS §10 open item — confirm with editorial whether this is wanted before building it). Not started — `room`/`order` aren't even sourced from Baserow yet ([source-baserow.js](gatsby/source-baserow.js) `FIELDS` map has no such keys).
- [x] Accessibility pass: keyboard-operable player controls (native `<button>`/`<input type="range">`, done from the start), transcript reachable without audio (done). **Visible focus states were actually broken, not just unbuilt** — [GlobalStyles.js](src/theme/GlobalStyles.js) stripped the focus outline from every `button`/`a` site-wide with no replacement, so keyboard users had no focus indicator anywhere on the site, not only in the player. Fixed by switching to `:focus-visible` (outline hidden for mouse clicks, shown for keyboard focus).

### Bugs found and fixed along the way

- **No visible keyboard focus indicator, site-wide** — `button:focus { outline: none; }` / `a:focus { outline: none; }` in [GlobalStyles.js](src/theme/GlobalStyles.js) removed the focus ring with no replacement. Fixed with `:focus-visible` (see accessibility item above). This was a live accessibility bug on the whole site, not specific to the audioguide.
- **Stray line breaks mid-sentence in transcripts/descriptions** — e.g. on `/guide/{exhibitionSlug}/01/`, some rendered text had a line break in the middle of a sentence. Cause: `description`/`transcript` render with `white-space: pre-wrap`, and the Baserow long-text field carried a literal line break at that point (typically from a pasted source like a word processor, not a real paragraph break). Fixed at the source in [source-baserow.js](gatsby/source-baserow.js) — a `normalizeLineBreaks()` step now collapses single line breaks into spaces while preserving real paragraph breaks (2+ newlines in a row), so this can't silently reintroduce itself from future pasted content.
- **Unhandled runtime error when a stop's audio fails to load** — a missing/broken `audio_url` (e.g. an empty Baserow field, or an expired Nextcloud share link) made `audio.play()` reject, which surfaced as an uncaught "media resource … not suitable" error instead of failing gracefully for the visitor. Fixed in [audio-player.js](src/components/audio-player.js): the rejected play promise and the `<audio>` element's own `error` event are both caught, the Play button disables itself, and the player shows "Audio unavailable" / "Audio for this stop isn't available right now" instead — the transcript toggle (if a transcript exists) still works, so there's still an accessible fallback. This does **not** fix any specific row's broken link — check Baserow's "Audio URL" field for the row that triggered it.

---

## Phase 3 — Exhibition-scoped URLs, overview page + other ideas

### 3.1 Restructure stop pages to be exhibition-scoped

Reference numbers restart per exhibition (they're printed on physical wall labels per show) and are therefore only unique combined with `exhibition_slug`, not globally — a real collision (two `01` rows in different exhibitions) turned up in the Baserow table. Nothing had been printed with the old URLs yet, so the change was made cleanly with no redirects needed.

- [x] In `gatsby-node.js`'s `createPages`, change the per-stop page to `path: /guide/${exhibitionSlug}/${referenceNumber}/` and pass both `exhibitionSlug` and `referenceNumber` in `context`.
- [x] Update `src/templates/guide-stop.js`'s page query to look up the node by both fields (referenceNumber alone no longer disambiguates).
- [x] Update the `pageUrl`/`qrCodeSvg` resolvers in `gatsby-node.js`'s `createResolvers` to build the same two-segment URL, so QR codes keep encoding the right page.
- [x] Update the stop links/keys built in `src/pages/guide.js` and `src/pages/print-codes.js` to include the exhibition slug segment (also shown as a caption on each printed QR card, since two different exhibitions can now share the same reference number on one print run).
- [x] Add a build-time warning (`console.warn` during `createPages`, doesn't fail the build) for rows missing `exhibitionSlug`, and for any remaining `(exhibitionSlug, referenceNumber)` duplicates after this change — so a genuine data-entry duplicate is caught, not silently overwritten by Gatsby.
- [ ] Acceptance: every `AudioguideStop` row with an `exhibitionSlug` gets a page at `/guide/{exhibitionSlug}/{referenceNumber}/`; the two existing `01` rows (different exhibitions) both build and are reachable at distinct URLs; QR codes on `/print-codes/` point at the new URLs. *(needs a real `gatsby build` against live Baserow data to confirm — not yet run)*

### 3.2 Audioguide overview page per exhibition

- [x] Group `AudioguideStop` nodes by `exhibitionSlug`, pull the exhibition's title/dates from Contentful (same query shape as `exhibition.js`), list all stops with links. Route: `/guide/{exhibitionSlug}/` as an index (distinct from the per-stop `/guide/{exhibitionSlug}/{referenceNumber}/` pages from 3.1) — new template [src/templates/guide-exhibition.js](src/templates/guide-exhibition.js), wired up in `gatsby-node.js`'s `createPages` for every distinct `exhibitionSlug` seen among guide stops. Falls back to showing just the slug as a heading (no dates) if the slug doesn't match a Contentful exhibition, with a build warning in that case. The stop list itself was extracted into a shared `GuideStopList` component (`src/components/guide-stop-list.js`) so this page and the existing global `/guide/` page don't duplicate the same markup/styles.
- [x] The global `/guide/` page no longer lists a flat mix of every stop — it now shows two sections: "Exhibitions" (one entry per exhibition that has stops, title/dates pulled from Contentful, linking to `/guide/{exhibitionSlug}/`) and "Other stops" (any stop with no `exhibitionSlug` at all, listed directly since there's no exhibition to group it under).
- [x] Per-stop pages now link "back to overview" to their own exhibition's `/guide/{exhibitionSlug}/` page instead of the global `/guide/` list (`GuideLayout`'s `overviewHref` prop, set from `guide-stop.js`).
- [x] Stops with no `exhibitionSlug` are no longer skipped/orphaned: they're filed under a reserved bucket (`stop`, defined once in `gatsby-node.js` as `UNASSIGNED_EXHIBITION_SLUG` — a placeholder name, easy to rename in the handful of places that reference it, listed in that file's comment). They get real pages at `/guide/stop/{referenceNumber}/`, and `/guide/stop/` is their own overview page (heading "Other stops" instead of a real exhibition title, since there's no Contentful entry to pull from — the "doesn't match any Contentful Exhibition slug" build warning is suppressed specifically for this bucket, since that mismatch is expected here).
- [ ] Not yet verified against a real `gatsby build` with live Baserow/Contentful data (same caveat as 3.1's acceptance line).

### 3.3 Auto-link from the exhibition page — on hold

No decision yet on whether a link from the exhibition page to the audioguide makes sense (open question, not a rejected idea) — **not implemented**, `src/templates/exhibition.js` is untouched. Data already flows the other direction: the new `/guide/{exhibitionSlug}/` page (3.2) pulls the exhibition's own title/dates in from Contentful, so if a forward link is wanted later, the cross-reference is already proven to work both ways.

- [ ] If/when decided: in `src/templates/exhibition.js`, add an `allAudioguideStop(filter: { exhibitionSlug: { eq: $slug } })` query; if any result has a non-empty `audioUrl`, render a "Listen to the audioguide" button linking to `/guide/{exhibitionSlug}/`.

### 3.4 `/codes` access & scope

- [ ] `/codes` access control decision (SPECS §10) — still undecided; see the pros/cons write-up below. Low priority since it has no visitor-facing value, but worth closing out before it's forgotten.
- [x] `/codes` (renamed from `/print-codes`) now does both: the original global page still exists (all stops, one sheet), and `/codes/{exhibitionSlug}/` pages were added for a single show's print run (including `/codes/stop/` for stops with no exhibition) — new template [src/templates/codes-exhibition.js](src/templates/codes-exhibition.js), wired up the same way as 3.2's overview pages. The shared QR-grid markup/styles were extracted into `src/components/print-sheet.js` so the two page types (and any future ones) don't duplicate it.
- [x] Print sheets no longer use the full site `Layout` (header/nav/footer/CDN scripts) or the audioguide's `GuideLayout` — a new bare `PrintLayout` ([src/components/print-layout.js](src/components/print-layout.js)) provides just the styled-components theme/reset, since these are internal-only pages with no visitor-facing chrome to show.
- [x] Each print sheet now also carries an "entrance" QR per section, linking to that exhibition's (or the `stop` bucket's) own `/guide/.../` overview page — not just per-artwork QR codes. Sourced from a new `audioguideOverviewQrCodeSvg` resolver on `ContentfulExhibition`, plus a matching root-level `audioguideUnassignedOverviewQrCodeSvg` field for the `stop` bucket (which has no Contentful node to hang a resolver off).

**`/codes` access control options considered (no decision made):**

| Option | Pros | Cons |
|---|---|---|
| Netlify Basic Auth | Zero code, built into hosting, blocks crawlers and casual visitors alike | Shared single password to distribute/rotate; blocks the editor too without credentials handy; unpolished browser prompt |
| `robots.txt` disallow + `<meta name="robots" content="noindex,nofollow">` | Trivial to add; keeps it out of Google/well-behaved crawlers | Doesn't stop a human with the URL, or a non-compliant scraper; not real access control, just discouragement |
| Obscurity (unlinked, unguessable path) | No extra config; no login friction | Not real security — leaks via browser history, server logs, an accidental share; same URL forever unless rotated |
| IP allowlist | No password to share; tight control if printing always happens from one known network | Breaks the moment someone needs it from a different network; more upkeep as IPs change; overkill for a low-stakes internal page |
| Keep off production entirely (deploy-preview/branch only) | Never reachable at the production domain | Real added complexity — a second build pipeline just for this page, awkward to keep in sync with live Baserow data |

Leaning recommendation if/when this gets decided: Basic Auth (real access control, no code) plus `robots`/`noindex` as a free extra layer — skip IP allowlisting or a separate deploy pipeline as overkill for an internal print tool.

### 3.5 Other ideas

- [ ] Usage stats, only if requested: self-hosted/privacy-respecting option (Plausible or GoatCounter), scoped to `/guide/*` and `/exhibition/*` pages only — no tracking scripts anywhere else per SPECS §9.

### 3.6 Multilingual support — language picker on the exhibition overview

- [x] `language` sourced from Baserow (`Language` column, optional, free text matched exactly like `exhibition_slug`) — [gatsby/source-baserow.js](gatsby/source-baserow.js) `FIELDS` map + `AudioguideStop.language` in `gatsby-node.js`'s schema.
- [x] `src/templates/guide-exhibition.js` computes the distinct `language` values among that exhibition's stops; if there are 2+, a centered `LanguagePicker` ([src/components/language-picker.js](src/components/language-picker.js)) shows before the stop list instead of it. A single (or no) language value skips the picker entirely.
- [x] Choosing a language stores it via a new shared helper, [src/utils/audioguide-language.js](src/utils/audioguide-language.js) (`getStoredLanguage`/`setStoredLanguage`/`clearStoredLanguage`, `localStorage` key `audioguide-language`) — deliberately **not** scoped per exhibition, so picking "English" on one show also applies automatically to any other exhibition that offers "English", per the ask. SSR-safe (`typeof window` guard) and wrapped in try/catch (private browsing can throw on `localStorage` access).
- [x] Stops with no `language` value are always shown regardless of the selected language (treated as language-agnostic), rather than being hidden by a language filter they don't participate in.
- [x] A "change language" text control below the list clears the in-memory selection (not the stored value) so the picker re-shows; picking again overwrites the stored value.
- [ ] Not yet verified against a real `gatsby build` with live Baserow data carrying actual `Language` values (same standing caveat as the rest of Phase 3).

### 3.7 Persistent language indicator in the guide header — proposed, not built

Suggestion evaluated: shrink the logo in `GuideLayout`'s header and show the current language centered there instead, clickable to reopen the picker — available from any guide page (overview, exhibition, or stop page), not just from within an exhibition's own overview.

**Assessment:** worth doing, but not as a trivial prop addition — `GuideLayout` is currently a dumb, data-agnostic shell (it only knows `showOverviewLink`/`overviewHref`, no audioguide data). Making it language-aware runs into a real design question: *which* exhibition's language list does the header refer to?
- On a stop page or that exhibition's own overview page, the answer is obvious — that exhibition's language set.
- On the global `/guide/` overview, which spans every exhibition (plus the `stop` bucket), there's no single "current exhibition" — showing a switcher there would need either the union of every exhibition's languages (confusing: not all shown to be relevant to whichever exhibition the visitor picks next) or just a plain read-only label with no active switching (simplest).

**Recommended approach if this gets built:**
1. Keep `GuideLayout` itself data-agnostic — add a small optional header slot (e.g. a `headerCenter` node prop) rather than teaching it about languages directly, consistent with how it already just takes `overviewHref` rather than knowing about exhibitions.
2. On `guide-exhibition.js` and `guide-stop.js` (which would need its query extended to also fetch sibling stops' `language` values, since today it only queries its own stop), read the stored language via the existing `src/utils/audioguide-language.js` helper and pass a small `<LanguageLabel>` into that slot — click clears the stored value (`clearStoredLanguage()`) and, on the exhibition page, re-shows the picker in place; on a stop page, most simply navigates back to `/guide/{exhibitionSlug}/` where the picker can re-show cleanly (a stop page mid-scroll is an awkward place to re-render a full picker inline).
3. On the global `/guide/` overview and the `stop` bucket, keep it simple: show the stored language (if any) as a small label with no active re-pick affordance there — re-selecting only happens from within a specific exhibition's page, where a real language list exists to choose from.
4. Shrinking the logo is a pure CSS change to `Logotype`/`GuideHeader`, independent of the above — low risk either way.

Not implemented pending confirmation this approach (in particular point 3 — a read-only label on the global overview) matches what's actually wanted, since it's a visible compromise on the original "click to retrigger… anywhere" idea rather than a full implementation of it everywhere.