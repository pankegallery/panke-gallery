import { useSyncExternalStore } from 'react'

// Whether the page has hydrated never changes once it's true, so there is
// nothing to subscribe to.
const subscribeToNothing = () => () => {}

/**
 * The part of the URL below a page that answers to its sub-URLs (`MATCH_PATHS`
 * in gatsby-node.js): `'screening'` on /events/screening/, `'2023'` on
 * /exhibitions/2023/, and `''` on the page itself or for anything deeper
 * than one level.
 *
 * Always `''` while hydrating: the static HTML of such a URL is the page's
 * own HTML, built without a parameter, so React's first render must match
 * it, or hydration fails (React errors #418/#423). React uses the third
 * argument of `useSyncExternalStore` while hydrating and the second
 * otherwise, so the parameter applies right after hydration, and at once on
 * in-app navigation.
 *
 * @param {Object} [params] - The page's `params` prop.
 * @returns {string}
 */
export const useRouteParam = (params) => {
  const isHydrated = useSyncExternalStore(subscribeToNothing, () => true, () => false)
  const value = (params?.['*'] || '').replace(/\/+$/, '')
  return isHydrated && !value.includes('/') ? value : ''
}
