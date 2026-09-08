// A visitor's chosen audioguide language is remembered per device (not per
// exhibition), so picking it once on one exhibition carries over to any
// other exhibition that offers the same language value.
const STORAGE_KEY = 'audioguide-language'

export function getStoredLanguage() {
  if (typeof window === 'undefined') return null
  try {
    return window.localStorage.getItem(STORAGE_KEY)
  } catch (err) {
    // Private browsing / storage disabled — picker still works for this visit.
    return null
  }
}

export function setStoredLanguage(language) {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(STORAGE_KEY, language)
  } catch (err) {
    // Ignored — see getStoredLanguage.
  }
}

export function clearStoredLanguage() {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.removeItem(STORAGE_KEY)
  } catch (err) {
    // Ignored — see getStoredLanguage.
  }
}
