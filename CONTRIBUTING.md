# Contributing to panke.gallery

How we work on this repository: branches, commits and code conventions. These rules apply to everyone, including AI assistants (see `CLAUDE.md`).

## Workflow

1. **Start from an issue.** Every change should have a GitHub issue that describes the problem and the agreed solution. Small content fixes are the exception: they go into the running checklist in #63.
2. **Branch from `development`,** named as described below.
3. **Open a pull request into `development`.** Reference the issue in the description, e.g. `Closes #58`.
4. **Deploy:** `development` is merged into `production` via a pull request. `production` is what runs on panke.gallery.

Content changes (texts, images, dates) are made in **Contentful**, not in the code. If a change needs both, open an issue for the code part and add the content part to #63.

## Branch names

Format: `<type>/<issue-number>-<meaningful-slug>`

| Type | Use for | Matching label |
| --- | --- | --- |
| `feature/` | New features and visible UI changes | `c _ feature`, `x _ UI/X enhancement` |
| `bugfix/` | Fixes for something that is broken | `c _ bug` |
| `refactor/` | Code clean-ups without visible change (e.g. merging components) | `x _ code enhancement` |
| `chore/` | Maintenance: dependencies, build, tooling, docs | – |

Rules:
- Always start with the type, **without a leading slash**. Git rejects names like `/bugfix/…`.
- Put the issue number right after the slash when there is an issue. Without an issue, use the slug only.
- Use a lowercase slug of a few words, separated by hyphens, that says what the branch does.
- No random or auto-generated names (e.g. `copilot/…`). Rename such branches before opening a pull request.

Examples:
- `bugfix/58-mailerlite-newsletter`
- `feature/67-exhibitions-archive`
- `refactor/66-exhibition-item`
- `chore/60-self-host-fonts`
- `chore/contributing-guidelines`

## Commits

- Short subject line in the imperative, e.g. `Fix date range across years`.
- Reference the issue where it helps, e.g. `Fix date range across years (#59)`. In the pull request, use `Closes #59` so the issue closes on merge.
- One logical change per commit where practical.

## Code and components

The site is built with Gatsby 5, Contentful and styled-components, and is deployed on Netlify.

### Reuse and extend before adding
- Check `src/components/`, `src/utils/` and `src/theme/` before writing something new.
- Extend an existing component, or merge near-duplicates, rather than adding a parallel one. Example: one exhibition item component with variants instead of separate list and preview components (#66).
- If a new component is unavoidable, explain why in the pull request.
- Remove what becomes unused in the same pull request: components, styles and commented-out code.

### Naming and structure
- **Component files:** kebab-case in `src/components/`, e.g. `exhibition-item.js`.
- **Styles:** in a matching folder, as a PascalCase `*.styles.js` file using styled-components, e.g. `color-swap.js` + `color-swap/ColorSwap.styles.js`.
- **Shared layout and content styles:** `src/components/layout/Layout.styles.js` (`Row`, `Col`, …) and `src/components/content/Content.styles.js` (`HeadSection`, `InfoSection`, `Meta`, …). Reuse these rather than restyling locally.
- **Props on styled components:** use transient props with a `$` prefix (`$md`, `$color`) so they don't end up in the HTML.
- **Shared logic:** helpers such as date formatting belong in `src/utils/`, used everywhere instead of copied.

### Theme values
- Take colours, font sizes, weights, spacing and breakpoints from `src/theme/theme.js`. Never hard-code them in components.
- New values the design needs become new theme tokens first (#65).

### Readability
- Use function components for new or reworked code.
- Give each component a short JSDoc block describing its purpose, props and variants.
- Write comments that explain *why*, not *what*, especially for anything non-obvious (CSS tricks, data quirks, workarounds).

### Accessibility and privacy
- **Text contrast:** at least 4.5:1. The lightest grey for text on white is `#767676`.
- **Tap targets:** at least 44 × 44 px on touch screens.
- **Images:** meaningful `alt` text from the Contentful asset description, or `alt=""` for decorative images.
- **No third-party CDNs or embeds** that load without consent. Self-host fonts and scripts (#60); embeds such as maps or video load only on click.

### Gatsby practices
- Images via `gatsby-plugin-image`, lazy loaded.
- Data via build-time GraphQL queries rather than fetches in the browser.
- Internal links via Gatsby's `<Link>`, so pages are prefetched.

## Local development

```bash
nvm use          # Node version from .nvmrc
npm install
npm run dev      # gatsby develop
npm run build    # production build
```

Contentful credentials go in `.env.development` / `.env.production`. Never commit them.
