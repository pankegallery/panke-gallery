// When an artwork has multiple language-variant rows (same exhibitionSlug +
// referenceNumber, different `language`), they share one physical wall
// position, one page, and one QR code — keep only the first for display
// purposes anywhere a position should appear once (print sheets).
export function dedupeStopsByPosition(edges) {
  const seen = new Set()
  return edges.filter(({ node }) => {
    const key = `${node.exhibitionSlug}/${node.referenceNumber}`
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
}
