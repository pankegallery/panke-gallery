// Device-remembered "already unlocked" state for the /codes print sheets.
// The password itself is never checked here — see PasswordGate, which posts
// it to the codes-auth-check Netlify Function so the real value only ever
// lives server-side (CODES_PASSWORD), never in the repo or the client bundle.
const STORAGE_KEY = 'codes-auth'
const REMEMBER_MS = 30 * 24 * 60 * 60 * 1000 // 30 days

export function isAuthenticated() {
  if (typeof window === 'undefined') return false
  try {
    const stored = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || 'null')
    return Boolean(stored && Date.now() - stored.authenticatedAt < REMEMBER_MS)
  } catch (err) {
    return false
  }
}

export function rememberAuthenticated() {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ authenticatedAt: Date.now() }))
  } catch (err) {
    // Ignored — private browsing / storage disabled just means re-prompting
    // next visit, not a broken gate.
  }
}
