/**
 * Process HTML string to add target="_blank" and rel="noopener noreferrer" 
 * to external links (links that don't point to panke.gallery domain)
 * 
 * @param {string} html - The HTML string to process
 * @returns {string} - Processed HTML string with updated external links
 */
export function processExternalLinks(html) {
  if (!html) return html;
  
  // Use regex to find and process anchor tags
  // This approach works during SSR and CSR
  return html.replace(/<a\s+([^>]*href=["']([^"']+)["'][^>]*)>/gi, (match, attributes, href) => {
    // Skip if already has target="_blank"
    if (/target=["']_blank["']/i.test(attributes)) {
      return match;
    }
    
    // Check if link is internal (relative path, hash, or same domain)
    const isRelative = href.startsWith('/') || href.startsWith('#') || href.startsWith('?');
    const isMailto = href.startsWith('mailto:');
    const isTel = href.startsWith('tel:');
    
    if (isRelative || isMailto || isTel) {
      return match; // Skip internal/special links
    }
    
    // Check if it's a panke.gallery domain link
    const isPankeDomain = /^https?:\/\/(www\.)?panke\.gallery/i.test(href);
    
    if (isPankeDomain) {
      return match; // Skip same domain links
    }
    
    // It's an external link - add target and rel attributes
    let newAttributes = attributes;
    
    // Add target="_blank"
    newAttributes += ' target="_blank"';
    
    // Add or update rel attribute
    if (/rel=["'][^"']*["']/i.test(newAttributes)) {
      // Update existing rel attribute
      newAttributes = newAttributes.replace(/rel=["']([^"']*)["']/gi, (relMatch, relValue) => {
        const relParts = relValue.split(/\s+/).filter(Boolean);
        if (!relParts.includes('noopener')) relParts.push('noopener');
        if (!relParts.includes('noreferrer')) relParts.push('noreferrer');
        return `rel="${relParts.join(' ')}"`;
      });
    } else {
      // Add new rel attribute
      newAttributes += ' rel="noopener noreferrer"';
    }
    
    return `<a ${newAttributes}>`;
  });
}
