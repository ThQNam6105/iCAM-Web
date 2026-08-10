import React from 'react';

const brandNamePattern = /(\biCANCAM\b)/gi;

/**
 * Renders the official iCANCAM name in the brand accent colour while preserving
 * the surrounding copy, whitespace, and inline flow.
 */
export const highlightBrandName = (text: string): React.ReactNode => {
  const parts = text.split(brandNamePattern);

  return parts.map((part, index) =>
    part.toLowerCase() === 'icancam' ? (
      <span className="brand-name" key={`brand-name-${index}`}>
        iCANCAM
      </span>
    ) : (
      part
    ),
  );
};

/**
 * Adds the same visual treatment to already-sanitized rich article HTML without
 * touching attributes, URLs, or markup.
 */
export const highlightBrandNameInHtml = (html: string): string => {
  if (typeof window === 'undefined' || !html.toLowerCase().includes('icancam')) {
    return html;
  }

  const documentFragment = new DOMParser().parseFromString(html, 'text/html');
  const walker = documentFragment.createTreeWalker(documentFragment.body, NodeFilter.SHOW_TEXT);
  const textNodes: Text[] = [];

  let node: Node | null = walker.nextNode();
  while (node) {
    textNodes.push(node as Text);
    node = walker.nextNode();
  }

  for (const textNode of textNodes) {
    const parentName = textNode.parentElement?.tagName.toLowerCase();
    if (parentName === 'script' || parentName === 'style' || textNode.parentElement?.classList.contains('brand-name')) {
      continue;
    }

    if (brandNamePattern.test(textNode.nodeValue || '')) {
      const replacementNode = documentFragment.createElement('span');
      replacementNode.innerHTML = (textNode.nodeValue || '').replace(
        brandNamePattern,
        '<span class="brand-name">iCANCAM</span>',
      );
      textNode.parentNode?.replaceChild(replacementNode, textNode);
    }
  }

  return documentFragment.body.innerHTML;
};
