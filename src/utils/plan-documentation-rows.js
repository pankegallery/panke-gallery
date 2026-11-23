/**
 * Plans the rows of the documentation images on desktop (#6): which images
 * share a row, and in which order the images come.
 *
 * Filling rows one after another, as CSS flex-wrap does, puts as many images
 * into a row as fit at the target height. A portrait that comes between
 * landscapes then pulls a whole row down to about 280px, and a lone
 * portrait at the end can't share a row at all. This looks at all the
 * images at once instead (as Flickr and Google Photos do):
 *
 * 1. Row breaks: of all ways to cut the images into rows, take the one whose
 *    rows come closest to the ideal height (a dynamic programme over the
 *    break points). Rows smaller than the ideal cost four times as much as
 *    taller ones, because small images are the problem we're solving; rows
 *    above the maximum are ruled out. The last row costs nothing when it is
 *    taller than the ideal, since it stops at the ideal height anyway.
 * 2. Order: the upload order isn't always a sensible one, so an image may
 *    move if that clearly gives better rows. Each place an image moves costs
 *    `moveCost`, so only a clear improvement moves anything, and images move
 *    as little as possible. The first image stays first: it is often the
 *    one chosen to open the documentation.
 *
 * The rows are planned for the full content column. In a narrower window
 * every row shrinks by the same factor, so the plan still holds; below
 * `breakpoints.md` the rows aren't used, but the order is.
 *
 * @param {number[]} ratios - Aspect ratio (width / height) of each image,
 *   in upload order.
 * @param {Object} options
 * @param {number} options.width - Width of the content column in px.
 * @param {number} options.gap - Space between the images of a row in px.
 * @param {number} options.ideal - Row height to aim for in px.
 * @param {number} options.min - Lowest row height allowed in px.
 * @param {number} options.max - Highest row height allowed in px.
 * @param {number} options.moveCost - Cost of moving an image by one place,
 *   in the same units as the row cost (squared px).
 * @returns {number[][]} The rows, each a list of indexes into `ratios`.
 */
export const planDocumentationRows = (ratios, { width, gap, ideal, min, max, moveCost }) => {
  // Height of a row: the width left after the gaps, divided among the
  // images by their aspect ratios.
  const rowHeight = row => (width - gap * (row.length - 1)) / row.reduce((sum, r) => sum + r, 0)

  const rowCost = (height, isLast) => {
    if (isLast && height >= ideal) return 0
    if (height < ideal) return 4 * (ideal - height) ** 2
    return height <= max ? (height - ideal) ** 2 : Infinity
  }

  // Cheapest way to cut `order` into rows: its cost and the size of each row.
  const breakRows = order => {
    const best = new Array(order.length + 1)
    best[order.length] = { cost: 0, sizes: [] }
    for (let start = order.length - 1; start >= 0; start--) {
      best[start] = { cost: Infinity, sizes: [order.length - start] }
      for (let end = start + 1; end <= order.length; end++) {
        const height = rowHeight(order.slice(start, end).map(i => ratios[i]))
        // Adding images only lowers the row, so stop below the minimum (but
        // always allow one image, however wide, a row of its own).
        if (height < min && end > start + 1) break
        const cost = rowCost(height, end === order.length) + best[end].cost
        if (cost < best[start].cost) best[start] = { cost, sizes: [end - start, ...best[end].sizes] }
      }
    }
    return best[0]
  }

  const totalCost = order =>
    breakRows(order).cost + moveCost * order.reduce((sum, i, place) => sum + Math.abs(i - place), 0)

  // Hill climbing: take an image out and put it back elsewhere, as long as
  // that lowers the cost. Large sets keep their order, so the search stays
  // quick on a phone.
  let order = ratios.map((_, i) => i)
  if (ratios.length <= 40) {
    let cost = totalCost(order)
    let improved = true
    while (improved) {
      improved = false
      for (let from = 1; from < order.length; from++) {
        for (let to = 1; to < order.length; to++) {
          if (from === to) continue
          const candidate = order.slice()
          candidate.splice(to, 0, ...candidate.splice(from, 1))
          const candidateCost = totalCost(candidate)
          if (candidateCost < cost - 1e-6) {
            order = candidate
            cost = candidateCost
            improved = true
          }
        }
      }
    }
  }

  let next = 0
  return breakRows(order).sizes.map(size => order.slice(next, (next += size)))
}
