export interface TocItem {
  id: string;
  text: string;
  level: 2 | 3;
}

export const generateTableOfContents = (htmlContent: string): { cleanHtml: string; toc: TocItem[] } => {
  if (!htmlContent) return { cleanHtml: '', toc: [] };

  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlContent, 'text/html');
  const headings = doc.querySelectorAll('h2, h3');
  const toc: TocItem[] = [];

  headings.forEach((heading, index) => {
    const text = heading.textContent || '';
    if (!text.trim()) return;

    const level = heading.tagName.toLowerCase() === 'h2' ? 2 : 3;
    const id = `toc-heading-${index}-${text.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;

    heading.setAttribute('id', id);
    toc.push({ id, text, level });
  });

  return {
    cleanHtml: doc.body.innerHTML,
    toc,
  };
};
