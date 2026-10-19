# CLAUDE.md

Guidance for AI assistants working in this repository.

**Follow `CONTRIBUTING.md`.** It defines branch names, the commit and pull-request workflow, and the code conventions. The essentials:

- **Branches:** `<type>/<issue-number>-<meaningful-slug>`, with type `feature/`, `bug/`, `refactor/` or `chore/`. No leading slash and no random or auto-generated names. Branch from `development`, and open pull requests into `development`.
- **Components:** reuse or extend existing components in `src/components/` before adding new ones, and merge near-duplicates. Say in the pull request why a new component was unavoidable.
- **Conventions:**
  - kebab-case component files, with styles in a matching folder as PascalCase `*.styles.js` (styled-components)
  - `$`-prefixed transient props
  - all colours, sizes and breakpoints from `src/theme/theme.js`
- **Readability:** function components for new or reworked code, a JSDoc block per component, comments that explain why, and removal of anything that becomes unused.
- **Content vs code:** texts and images live in Contentful. Content fixes go into the checklist in issue #63, not into code.
- **Privacy:** no third-party CDNs or embeds that load without consent (#60).

## Stack and commands

- Gatsby 5, Contentful (source), styled-components, deployed on Netlify (`production` branch is live).
- Node version in `.nvmrc`.
- `npm run dev` starts the dev server, and `npm run build` makes the production build.
- Refresh decisions (layout, type values, date formats) are recorded in issues #57–#70.
