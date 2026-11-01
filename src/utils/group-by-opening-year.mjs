/**
 * Groups exhibitions by the year they opened, for the archive on
 * /exhibitions and the per-year image files gatsby-node.js writes for it
 * (#68). An `.mjs` file without dependencies, so gatsby-node.js can
 * `import()` it on Node 18.
 *
 * A show belongs to the year of its `startDate` only, so one that runs
 * across New Year appears once, under its opening year. The year is read
 * from the ISO date string as entered in Contentful ("2022-12-10…"), not
 * through a Date, so the build machine's time zone can't move a show
 * opening on 1 January into the year before.
 *
 * The items must be sorted by `startDate` (as the page query does), since a
 * new group starts whenever the year changes. Groups and the items in them
 * keep that order, so shows sorted newest first give the newest year first.
 *
 * @template T
 * @param {T[]} items - Exhibition nodes, or anything that leads to one.
 * @param {(item: T) => string} [getStartDate] - Reads the ISO start date
 *   from an item. Defaults to `item.startDate`.
 * @returns {{year: number, items: T[]}[]}
 */
export const groupByOpeningYear = (items, getStartDate = (item) => item.startDate) => {
  const groups = []

  items.forEach((item) => {
    const year = Number(String(getStartDate(item)).slice(0, 4))
    const last = groups[groups.length - 1]

    if (last && last.year === year) {
      last.items.push(item)
    } else {
      groups.push({ year, items: [item] })
    }
  })

  return groups
}
