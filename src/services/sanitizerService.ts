/**
 * Secure HTML Sanitizer for iCANCAM Publishing Studio.
 * Removes malicious script tags, event handlers (onload, onerror),
 * javascript: URIs, and dangerous elements while preserving clean semantic HTML tags.
 */

const ALLOWED_TAGS = new Set([
  'p', 'h2', 'h3', 'ul', 'ol', 'li', 'strong', 'em', 'u', 's',
  'blockquote', 'a', 'img', 'video', 'source', 'iframe', 'hr', 'div', 'span', 'b', 'i', 'sub', 'sup'
]);

export const sanitizeHtml = (htmlInput: string): string => {
  if (!htmlInput) return '';

  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlInput, 'text/html');

  const cleanNode = (node: Node) => {
    const children = Array.from(node.childNodes);

    for (const child of children) {
      if (child.nodeType === Node.ELEMENT_NODE) {
        const el = child as HTMLElement;
        const tagName = el.tagName.toLowerCase();

        if (!ALLOWED_TAGS.has(tagName)) {
          // Unwrap tag but keep text content, or remove dangerous scripts
          if (tagName === 'script' || tagName === 'style' || tagName === 'iframe' || tagName === 'object') {
            el.remove();
            continue;
          } else {
            // Replace tag with its text content
            const textNode = doc.createTextNode(el.textContent || '');
            el.parentNode?.replaceChild(textNode, el);
            continue;
          }
        }

        // Clean attributes (remove on* event handlers, style tags, and javascript: links)
        const attrNames = Array.from(el.attributes).map((a) => a.name);
        for (const attr of attrNames) {
          const lowerAttr = attr.toLowerCase();
          if (lowerAttr.startsWith('on') || lowerAttr === 'style') {
            el.removeAttribute(attr);
          }
          if (lowerAttr === 'href' || lowerAttr === 'src') {
            const val = el.getAttribute(attr) || '';
            if (val.trim().toLowerCase().startsWith('javascript:')) {
              el.removeAttribute(attr);
            }
          }
        }

        // Recursively clean children
        cleanNode(el);
      }
    }
  };

  cleanNode(doc.body);
  return doc.body.innerHTML;
};
