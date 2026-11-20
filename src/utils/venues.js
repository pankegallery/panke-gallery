/**
 * The two places where panke.gallery's exhibitions and events happen. They
 * live here so that everything naming a place reads the same address (#130).
 * For now this is the event data for search engines (`<Seo event>`); the
 * /rosa note on event pages and the RSVP email can read from here too.
 *
 * `area` is how each place names its part of Berlin, which says more than
 * the postcode where only a short line fits.
 */
export const GALLERY = {
  name: 'panke.gallery',
  streetAddress: 'Gerichtstr. 23, Hof V',
  postalCode: '13347',
  locality: 'Berlin',
  area: 'Wedding',
  path: '/',
}

export const ROSA = {
  name: '/rosa',
  streetAddress: 'Heidelberger Str. 28',
  postalCode: '12059',
  locality: 'Berlin',
  area: 'Alt-Treptow/Neukölln',
  path: '/rosa/',
}

/**
 * Where an event takes place: events of the series `rosa` (the series /rosa
 * lists) at /rosa, all others at the gallery.
 *
 * @param {Object} event - A Contentful event node with `eventSeries { slug }`.
 * @returns {Object} `GALLERY` or `ROSA`.
 */
export const venueOfEvent = event => (event?.eventSeries?.slug === 'rosa' ? ROSA : GALLERY)
