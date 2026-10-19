import React, { useEffect } from 'react'
import Helmet from 'react-helmet'
import { graphql } from 'gatsby'

import Layout from '../components/layout'
import ExhibitionItem from '../components/exhibition-item'
import YearIndex from '../components/year-index'
import { Grid } from '../components/layout/Layout.styles'
import { Section, Headline, YearSection, YearHeading } from '../components/content/Content.styles'
import { theme } from '../theme/theme'
import { RECENT_COUNT, isCurrent, isUpcoming, isPast } from '../utils/exhibition-archive.mjs'
import { groupByOpeningYear } from '../utils/group-by-opening-year.mjs'
import { useRouteParam } from '../utils/use-route-param'
import { useYearImages } from '../utils/use-year-images'

/**
 * Where the past show at `index` (newest first) is a Recent card:
 * `'always'`, from a `media` breakpoint (`'md'` or `'xl'`), or `null` for
 * never. Below that breakpoint it is an archive row instead.
 *
 * Recent renders all `RECENT_COUNT.xl` shows and CSS hides the ones that
 * don't fit, while the archive renders the same shows with the opposite
 * visibility. So each past show appears exactly once at every width, and
 * the server-rendered HTML already matches the screen (no width check in
 * JS, no layout jump on hydration).
 */
const recentFrom = (index) => {
  if (index < RECENT_COUNT.sm) return 'always'
  if (index < RECENT_COUNT.md) return 'md'
  if (index < RECENT_COUNT.xl) return 'xl'
  return null
}

/**
 * A year is hidden where all of its shows are hidden, i.e. in Recent: from
 * the latest breakpoint any of them is hidden from, or never if one of them
 * is always in the archive.
 */
const yearHideFrom = (entries) => {
  if (entries.some(({ hideFrom }) => !hideFrom)) return undefined
  return entries.some(({ hideFrom }) => hideFrom === 'xl') ? 'xl' : 'md'
}

/**
 * Moves to the archive year in the URL (/exhibitions/<year>/) and loads its
 * images: when the page is opened at that URL, when a chip in the year index
 * is picked, and on back and forward (gatsby-browser.js leaves the scrolling
 * of these URLs to this hook). A year hidden at this width has all its shows
 * in Recent, so the page moves there instead. After a pick in the year index
 * the keyboard focus moves to the year heading too, as it would with an
 * in-page link.
 *
 * @param {string} year - The year in the URL, or `''`.
 * @param {Object} location - The page's `location` prop.
 * @param {(year: string) => void} loadYear
 */
const useOpenYear = (year, location, loadYear) => {
  const fromYearIndex = Boolean(location.state?.fromYearIndex)

  useEffect(() => {
    const section = year && document.getElementById(year)
    if (!section) return
    loadYear(year)

    if (section.offsetParent === null) {
      document.getElementById('recent')?.scrollIntoView()
      return
    }
    section.scrollIntoView()
    if (fromYearIndex) section.querySelector('h3')?.focus({ preventScroll: true })
    // `location.key` changes on every navigation, so picking the year that
    // is already in the URL scrolls back to it.
  }, [year, location.key, fromYearIndex, loadYear])
}

/**
 * /exhibitions: current and upcoming shows large, then the Recent grid of
 * the latest past shows, then the archive of all other past shows by
 * opening year, with a year index on top. Everything sits on the page
 * `Grid`, so features, cards and rows share their column edges.
 *
 * The page stays one page (#68). Its HTML holds every show as text, so all
 * of them are indexable, but images only from `imagesSince` on: the
 * features, Recent and the archive years that share shows with Recent.
 * Older years load their images when they come near the viewport or are
 * opened (`useYearImages`), into boxes of a fixed size. The page also
 * answers to /exhibitions/<year>/ (`MATCH_PATHS` in gatsby-node.js), which
 * opens the archive at that year.
 *
 * @param {Object} props
 * @param {Object} props.data - Page query result: all exhibitions as text,
 *   newest first, and the images and long teasers of the newer ones.
 * @param {Object} props.params - Route parameters; `*` is the year.
 * @param {Object} props.location
 */
const PankeExhibitions = ({ data, params, location }) => {
  const details = new Map(data.withImages.nodes.map((node) => [node.slug, node]))
  const exhibitions = data.allContentfulExhibition.nodes.map((node) => ({
    ...node,
    ...details.get(node.slug),
  }))

  // The query sorts newest first; current and upcoming read soonest first.
  const current = exhibitions.filter(isCurrent).reverse()
  const upcoming = exhibitions.filter(isUpcoming).reverse()
  const past = exhibitions.filter(isPast)

  const recent = past.slice(0, RECENT_COUNT.xl)

  // Every past show that isn't always in Recent, hidden from where it is.
  const archiveEntries = past.flatMap((exhibition, index) => {
    const from = recentFrom(index)
    return from === 'always' ? [] : [{ exhibition, hideFrom: from || undefined }]
  })
  const archive = groupByOpeningYear(archiveEntries, ({ exhibition }) => exhibition.startDate)
    .map(({ year, items }) => ({ year, entries: items, hideFrom: yearHideFrom(items) }))

  const pendingYears = archive
    .filter(({ entries }) => entries.some(({ exhibition }) => !exhibition.featuredImage))
    .map(({ year }) => year)
  const [yearImages, loadYear] = useYearImages(pendingYears)
  const withYearImage = (exhibition, year) => {
    const image = yearImages[year]?.[exhibition.slug]
    return image ? { ...exhibition, featuredImage: { gatsbyImageData: image } } : exhibition
  }

  useOpenYear(useRouteParam(params), location, loadYear)

  return (
    <Layout wide>
      <Helmet
        title="Exhibitions"
        meta={[
          {
            name: 'description',
            content: 'Upcoming and past exhibitions of panke.gallery in Berlin-Wedding. The gallery seeks to open up a dialogue between established and emerging artists whose work comes out of the connections between digital or net-based art and club culture.'
          }
        ]}
      />

      {current.length > 0 && (
        <Section>
          <Headline>
            <h2>Current</h2>
          </Headline>
          <Grid>
            {current.map((exhibition) => (
              <ExhibitionItem key={exhibition.slug} exhibition={exhibition} variant="feature" />
            ))}
          </Grid>
        </Section>
      )}

      {upcoming.length > 0 && (
        <Section>
          <Headline>
            <h2>Upcoming</h2>
          </Headline>
          <Grid>
            {upcoming.map((exhibition) => (
              <ExhibitionItem key={exhibition.slug} exhibition={exhibition} variant="feature-small" />
            ))}
          </Grid>
        </Section>
      )}

      {recent.length > 0 && (
        <Section id="recent">
          <Headline>
            <h2>Recent</h2>
          </Headline>
          <Grid $rowGap={theme.spacing.cardLineGap}>
            {recent.map((exhibition, index) => {
              const from = recentFrom(index)
              return (
                <ExhibitionItem
                  key={exhibition.slug}
                  exhibition={exhibition}
                  variant="card"
                  hideBelow={from === 'always' ? undefined : from}
                />
              )
            })}
          </Grid>
        </Section>
      )}

      {archive.length > 0 && (
        <Section>
          <Headline>
            <h2>Archive</h2>
          </Headline>
          <YearIndex years={archive.map(({ year, hideFrom }) => ({ year, hideFrom }))} />

          {archive.map(({ year, entries, hideFrom }) => (
            <YearSection key={year} id={String(year)} $hideFrom={hideFrom} aria-labelledby={`year-${year}`}>
              {/* Focusable by script only, for useOpenYear. */}
              <YearHeading id={`year-${year}`} tabIndex={-1}>{year}</YearHeading>
              <Grid>
                {entries.map(({ exhibition, hideFrom }) => (
                  <ExhibitionItem
                    key={exhibition.slug}
                    exhibition={withYearImage(exhibition, year)}
                    variant="row"
                    headingLevel={4}
                    hideFrom={hideFrom}
                  />
                ))}
              </Grid>
            </YearSection>
          ))}
        </Section>
      )}
    </Layout>
  )
}

export default PankeExhibitions

// Two lists of the same shows, newest first: every show as text, which is
// all the archive needs in the HTML, and the images and the rest of the
// shows from `imagesSince` on (set by gatsby-node.js), which the features,
// Recent and the newest archive years need. The images of older years load
// later from files that gatsby-node.js writes with the same image arguments.
export const pageQuery = graphql`
  query PankeExhibitionsQuery($imagesSince: Date) {
    allContentfulExhibition(sort: { startDate: DESC }) {
      nodes {
        title
        slug
        startDate
        endDate
        dateTbc
        # Archive rows show three lines of teaser, at most 60ch wide: about
        # 220 characters.
        description {
          childMarkdownRemark {
            excerpt(pruneLength: 300)
          }
        }
        subtitleShortDescription {
          childMarkdownRemark {
            html
          }
        }
      }
    }
    withImages: allContentfulExhibition(
      sort: { startDate: DESC },
      filter: { startDate: { gte: $imagesSince } }
    ) {
      nodes {
        slug
        # Every image on the page is shown at 16:10, cropped around the
        # centre by Contentful, as in the archive prototype.
        featuredImage {
          gatsbyImageData(
            layout: CONSTRAINED,
            width: 1050,
            aspectRatio: 1.6,
            resizingBehavior: FILL,
            cropFocus: CENTER,
            placeholder: BLURRED
          )
          description
        }
        description {
          childMarkdownRemark {
            excerpt(pruneLength: 1200)
          }
        }
        openingHours
        vernissageInfos
      }
    }
  }
`
