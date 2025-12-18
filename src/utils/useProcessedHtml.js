import { useMemo } from 'react';
import { processExternalLinks } from './processExternalLinks';

/**
 * React hook to process HTML and add target="_blank" to external links
 * 
 * @param {string} html - The HTML string to process
 * @returns {string} - Processed HTML string with updated external links
 */
export function useProcessedHtml(html) {
  return useMemo(() => processExternalLinks(html), [html]);
}
