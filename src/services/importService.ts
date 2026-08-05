import { sanitizeHtml } from './sanitizerService';

/**
 * Clean Word HTML Paste & Document Importer
 * Removes Word-specific inline styles (mso-*), XML wrappers, font tags,
 * and converts Word content into clean semantic HTML.
 */

export const cleanWordHtml = (htmlRaw: string): string => {
  if (!htmlRaw) return '';

  let cleaned = htmlRaw;

  // Remove Word comment blocks, XML namespace tags, and MSO styles
  cleaned = cleaned.replace(/<!--[\s\S]*?-->/gi, '');
  cleaned = cleaned.replace(/<xml>[\s\S]*?<\/xml>/gi, '');
  cleaned = cleaned.replace(/style="[^"]*mso-[^"]*"/gi, '');
  cleaned = cleaned.replace(/class="Mso[^"]*"/gi, '');

  // Convert Word headings & paragraphs
  cleaned = cleaned.replace(/<p class="?MsoHeading1"?[^>]*>(.*?)<\/p>/gi, '<h2>$1</h2>');
  cleaned = cleaned.replace(/<p class="?MsoHeading2"?[^>]*>(.*?)<\/p>/gi, '<h3>$1</h3>');

  // Sanitize remaining tags
  return sanitizeHtml(cleaned);
};

export const parseWordDocument = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        // Basic extraction fallback for text/html from docx/html export
        const cleanText = text
          .split('\n')
          .filter((line) => line.trim() !== '')
          .map((line) => `<p>${line.trim()}</p>`)
          .join('');
        resolve(cleanWordHtml(cleanText));
      } catch (err) {
        reject(err);
      }
    };

    reader.onerror = (err) => reject(err);
    reader.readAsText(file);
  });
};
