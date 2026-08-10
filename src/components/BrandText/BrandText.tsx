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

interface BrandTextProps {
  children: string;
}

export const BrandText: React.FC<BrandTextProps> = ({ children }) => <>{highlightBrandName(children)}</>;

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
  let currentNode = walker.nextNode();

  while (currentNode) {
    const parentTag = currentNode.parentElement?.tagName;
    if (parentTag !== 'SCRIPT' && parentTag !== 'STYLE') {
      textNodes.push(currentNode as Text);
    }
    currentNode = walker.nextNode();
  }

  textNodes.forEach((textNode) => {
    if (!textNode.nodeValue || !brandNamePattern.test(textNode.nodeValue)) {
      brandNamePattern.lastIndex = 0;
      return;
    }

    brandNamePattern.lastIndex = 0;
    const replacement = documentFragment.createDocumentFragment();
    textNode.nodeValue.split(brandNamePattern).forEach((part) => {
      if (part.toLowerCase() === 'icancam') {
        const brandName = documentFragment.createElement('span');
        brandName.className = 'brand-name';
        brandName.textContent = 'iCANCAM';
        replacement.appendChild(brandName);
      } else if (part) {
        replacement.appendChild(documentFragment.createTextNode(part));
      }
    });
    textNode.replaceWith(replacement);
  });

  return documentFragment.body.innerHTML;
};
