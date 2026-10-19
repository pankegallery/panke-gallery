import React from 'react'
import Helmet from 'react-helmet'
import Moment from 'moment'
import { graphql } from 'gatsby'

import Layout from '../components/layout'
import ExhibitionItem from '../components/exhibition-item'
import YearIndex from '../components/year-index'
import { Grid } from '../components/layout/Layout.styles'
import { Section, Headline, YearSection, YearHeading } from '../components/content/Content.styles'
import { theme } from '../theme/theme'
import { groupByOpeningYear } from '../utils/group-by-opening-year'

// Compare whole days in Berlin summer time, as the page always has.
const day = (date) => Moment(new Date(date)).utcOffset(120)
const isCurrent = ({ startDate, endDate }) =>
  day(startDate).isSameOrBefore(new Date(), 'day') && day(endDate).isSameOrAfter(new Date(), 'day')
const isUpcoming = ({ startDate }) => day(startDate).isAfter(new Date(), 'day')
const isPast = ({ endDate }) => day(endDate).isBefore(new Date(), 'day')

// Recent shows 4 shows on phones (one full-width column), then two lines of
// the page grid: 6 from `breakpoints.sm`, 8 from `breakpoints.xl`. All 8 are
// rendered and CSS hides
// the ones that don't fit, while the archive renders the same shows with the
// opposite visibility. So each past show appears exactly once at every width,
// and the server-rendered HTML already matches the screen (no width check in
// JS, no layout jump on hydration).
const RECENT_COUNT = { sm: 4, md: 6, xl: 8 }

/**
 * Where the past show at `index` (newest first) is a Recent card:
 * `'always'`, from a `media` breakpoint (`'md'` or `'xl'`), or `null` for
 * never. Below that breakpoint it is an archive row instead.
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
 * /exhibitions: current and upcoming shows large, then the Recent grid of
 * the latest past shows, then the archive of all other past shows by
 * opening year, with a year index on top. Everything sits on the page
 * `Grid`, so features, cards and rows share their column edges.
 *
 * @param {Object} props
 * @param {Object} props.data - Page query result: all exhibitions, newest first.
 */
const PankeExhibitions = ({ data }) => {
  const exhibitions = data.allContentfulExhibition.nodes

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
        <Section>
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
              <YearHeading id={`year-${year}`}>{year}</YearHeading>
              <Grid>
                {entries.map(({ exhibition, hideFrom }) => (
                  <ExhibitionItem
                    key={exhibition.slug}
                    exhibition={exhibition}
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

export const pageQuery = graphql`
  query PankeExhibitionsQuery {
    allContentfulExhibition(sort: { startDate: DESC }) {
      nodes {
        title
        slug
        startDate
        endDate
        dateTbc
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
        subtitleShortDescription {
          childMarkdownRemark {
            html
          }
        }
      }
    }
  }
`
