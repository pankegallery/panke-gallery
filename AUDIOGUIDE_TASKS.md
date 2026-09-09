# Audioguide — Implementation Reference

**Companion to:** [AUDIOGUIDE_SPECS.md](AUDIOGUIDE_SPECS.md) (what it is / how it's meant to work) — this doc is **how each piece is actually built**, file by file, plus the non-obvious bugs found along the way.

**Status:** shipped and live. Open decisions are tracked in [AUDIOGUIDE_SPECS.md § Open decisions](AUDIOGUIDE_SPECS.md#open-decisions), not duplicated here.

<br>

## Data sourcing — Baserow → Gatsby

| File | Role |
|---|---|
| `gatsby/source-baserow.js` | Custom `sourceNodes`, fetches the Baserow table, creates one `AudioguideStop` node per row |
| `gatsby-node.js` | `AudioguideStop` schema (`createSchemaCustomization`), `pageUrl`/`qrCodeSvg` resolvers |

> [!WARNING]
> **Baserow "Single select" fields don't return a plain string.** Switching `language` from Text to a dropdown (recommended in the spec, to stop spelling drift) changes the API shape to `{ id, value, color }`. `String(thatObject)` silently coerces to the literal text `"[object Object]"` for *every* row — all languages then look identical, and multi-language detection (`languages.length > 1`) never fires. Fixed with a `selectValue()` helper that unwraps `.value` from the dropdown shape while still accepting a plain string, so switching field types again doesn't silently break this a second time.

> [!NOTE]
> **Pasted long text can carry stray line breaks mid-sentence** (a hard wrap from a word processor, not a real paragraph break) which then render literally wherever `white-space: pre-wrap` is used. `normalizeLineBreaks()` collapses single line breaks into spaces while preserving real paragraph breaks (2+ newlines), applied to both `description` and `transcript` at the source.

<br>

## URL structure & page generation

| File | Role |
|---|---|
| `gatsby-node.js` (`createPages`) | Groups stops into pages by **position** (`exhibitionSlug` + `referenceNumber`), not by reference number alone |

A position is grouped from potentially several `AudioguideStop` rows (language variants). One page is created per position regardless of row count — the stop page itself queries all rows at that position and resolves which one to show (see [Guide pages](#guide-pages) below).

> [!NOTE]
> **Telling a genuine duplicate apart from a language variant:** two rows sharing a position used to always mean a data-entry mistake (the original bug this whole scheme fixes — two exhibitions both using reference number `01`). Now that two rows at the *same* position can be legitimate (one per language), the check groups by position first and only warns when the rows there **aren't** distinguishable by `language` (e.g. both blank, or both `"English"`) — a real language variant no longer trips a false warning.

<br>

## Guide pages

| File | Route | Role |
|---|---|---|
| `src/pages/guide.js` | `/guide/` | Every exhibition with stops + "Other stops" |
| `src/templates/guide-exhibition.js` | `/guide/{slug}/` | One exhibition's stop list |
| `src/templates/guide-stop.js` | `/guide/{slug}/{ref}/` | One stop — owns the language decision (below) |
| `src/components/guide-stop-list.js` | — | Shared list markup, used by both overview types |
| `src/components/guide-layout.js` | — | Shared header/shell — data-agnostic, just renders whatever `headerAction` node it's given |

**Header:** left side shows exhibition context (name on a stop page; name + dates on that exhibition's own overview); right side is the "back to this exhibition's overview" icon, when relevant. No logo — see [SPECS § Open decisions](AUDIOGUIDE_SPECS.md#open-decisions) item 5.

**Language resolution lives in `guide-stop.js`**, not the audio player:

```
rows = all AudioguideStop rows at this position
languages = distinct rows[].language
activeRow = row matching the chosen language, else a language-agnostic row
```

`activeRow` supplies *everything* rendered for the stop — name, artist, description, image, and the `audioUrl`/`transcript` handed to `AudioPlayer`. Picking a language re-renders the page with a **freshly-mounted** player (so it starts collapsed, not mid-overlay); "change language" in the player's footer resets the choice and swaps back to the full-page picker.

> [!IMPORTANT]
> **This was tried the other way first** — language living entirely inside `AudioPlayer` (a `tracks` prop, its own picker) — on the theory that language only ever affects which audio file plays. That's wrong whenever the *name itself* is translated (confirmed with test data: `"To test"`/English vs `"Testen"`/Deutsch at the same position) — a player-scoped picker has no way to affect the page's own `<h1>`. Both overview lists (`guide.js`'s "Other stops", `guide-exhibition.js`'s stop list) need the identical fix: group by position, prefer the row matching the stored language, not a plain first-match dedupe.

<br>

## Audio player

**File:** `src/components/audio-player.js` + `audio-player/AudioPlayer.styles.js`

Takes plain `audioUrl`/`transcript`/`title`/`artist` props — language was resolved by the caller before this component ever mounts. `language`/`onChangeLanguage` props are display-only (the footer button), not player-managed state.

**Fullscreen overlay layout: three regions, one scrollable.** `Overlay` itself is `overflow: hidden` and never scrolls. `OverlayTop` (stop number centered, collapse icon right) and `OverlayFooter` (transcript/language pill buttons) are fixed-size flex children that can never be scrolled out of view; `OverlayCenter` (title, artist, play button, scrubber, and — when open — the transcript) is the *only* scrollable region (`min-height: 0; overflow-y: auto`), vertically centered when its content fits.

> [!WARNING]
> **Earlier version had two nested scrollable regions** (the whole overlay, plus `TranscriptSection`'s own `max-height`/`overflow-y: auto`) inside a shared `OverlayBody` wrapper. On a two-line title this pushed content taller than the viewport, which broke centering, produced visible double-scrolling, and let the top row's collapse button scroll out of reach entirely. Fixed by removing `OverlayBody`, making `Overlay` itself non-scrolling, and giving `OverlayCenter` sole ownership of scrolling — `TranscriptSection` now just flows inside it rather than scrolling on its own.

> [!WARNING]
> **Changing `<audio src>` reactively doesn't reliably make the browser switch sources** once it's already loaded one — confirmed live (kept playing the first-resolved language regardless of what was picked). Fixed with an explicit `audioRef.current.load()` in a `useEffect` keyed on `audioUrl`, which also resets `currentTime` and any stale error state.

> [!NOTE]
> **A missing/broken `audio_url` used to surface as an uncaught runtime error** (`audio.play()` rejecting). Both the rejected promise and the `<audio>` element's own `error` event are now caught — the play button disables and the player shows "Audio unavailable" instead. The transcript toggle still works, so there's still an accessible fallback with no audio.

<br>

## Print sheets (`/codes`)

| File | Role |
|---|---|
| `src/pages/codes.js` | Global sheet, all stops grouped by exhibition |
| `src/templates/codes-exhibition.js` | One exhibition's sheet |
| `src/components/print-sheet.js` | Shared QR-grid rendering for both |
| `src/components/print-layout.js` | Bare wrapper (no site chrome) + the password gate |
| `src/components/password-gate.js`, `src/utils/codes-auth.js` | Full-screen password prompt; 30-day device-remembered unlock |
| `netlify/functions/codes-auth-check.js` | Server-side password check — real value lives only in `CODES_PASSWORD`, never client-side |

Each sheet's sections carry an **entrance QR** (linking to the exhibition's own overview page) ahead of the per-artwork codes — sourced from an `audioguideOverviewQrCodeSvg` resolver on `ContentfulExhibition` (and a root-level equivalent for the unassigned bucket, which has no Contentful node to hang a resolver off).

> [!NOTE]
> **Language variants share one QR code** (same position → same `pageUrl`/`qrCodeSvg`) — printing one card per row would print the same code twice. `src/utils/dedupe-stops-by-position.js` keeps one row per position before rendering; used here and nowhere else, since the print sheet doesn't need to reflect a language *preference* the way the guide pages do — the physical QR code is identical regardless.

**`/codes` access control — options considered before choosing the password gate:**

| Option | Pros | Cons |
|---|---|---|
| **Password prompt, server-side check (chosen)** | No hosting/dashboard config beyond one env var; works the same everywhere | Still not real access control on a static site (SPECS §9); needs `netlify dev`, not plain `gatsby develop`, to test locally |
| Netlify Basic Auth | Real CDN-level access control, zero code | Netlify dashboard/plan config; shared password to distribute/rotate |
| `robots.txt` + `noindex` | Trivial, keeps well-behaved crawlers out | Not real access control — done anyway, alongside the password prompt, since it's free |
| Obscurity (unlinked path) | No config | Leaks via history/logs/an accidental share |
| IP allowlist | No password to share | Breaks the moment printing happens from a different network |
| Keep off production (branch/preview only) | Never reachable at the real domain | A second build pipeline just for this page |

<br>

## Exhibition-page audioguide link

**File:** `src/templates/exhibition.js`, `src/components/content/Content.styles.js` (new `Button` export)

Queries `allAudioguideStop(filter: { exhibitionSlug: { eq: $slug } })` for just `audioUrl`; if any row has a non-empty one, a section renders between the further-content-blocks and the documentation images — short explanation + an "Open the audioguide" button to `/guide/{slug}/`. Reuses the `Row`/`Col`/`InfoSection` layout already used by "About the exhibition" above it.

> [!NOTE]
> No canonical site-wide button component existed. The closest reusable style was the RSVP form's own submit button — its CSS was copied into a generically-named `Button` in `Content.styles.js` rather than importing something named `RsvpSubmitButton` into an unrelated page. The RSVP form itself is untouched.

<br>

## Accessibility & interaction polish

- **Site-wide focus outline was actually broken**, not just unstyled — `GlobalStyles.js` had `button:focus { outline: none; }` / `a:focus { outline: none; }` with no replacement, so keyboard users had no focus indicator *anywhere on the site*. Fixed with `:focus-visible` (outline hidden for mouse clicks, shown for keyboard focus).
- Subtle hover (`@media (hover: hover)`, so it only triggers for mouse-type input) and `:active` (touch tap) feedback added across list rows, icon buttons, and the language picker.
- **iOS Safari doesn't apply `:active` styles at all** unless a touch listener exists somewhere on the page — a one-time no-op `touchstart` listener in `GuideLayout` unlocks it site-wide.
- **Player pill buttons (transcript/language) and `LanguagePicker`'s buttons share one feedback pattern**: a filled black-background/white-text swap on hover and on press (`PillButton`, `LanguageButton`). Two of these also carry a *persistent* version of that same fill, independent of hover/press — the transcript toggle (`$active`, filled while the transcript is showing) and the language picker's already-chosen option (`$selected`, filled when reopened via the player's "change language" control) — so "current state," not just "being interacted with," is visible at a glance.
