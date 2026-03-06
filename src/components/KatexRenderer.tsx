import katex from 'katex';
import 'katex/dist/katex.min.css';
import DOMPurify from 'dompurify';

/**
 * Processes a string, rendering any $...$ LaTeX expressions with KaTeX.
 * Works with both plain text and HTML content.
 */
export const renderWithKatex = (text: string): string => {
  if (!text) return '';
  return text.replace(/\$([^$]+)\$/g, (_, formula) => {
    try {
      return katex.renderToString(formula, { throwOnError: false, displayMode: false });
    } catch {
      return `$${formula}$`;
    }
  });
};

interface KatexTextProps {
  children: string;
  className?: string;
  as?: 'span' | 'div' | 'p';
}

/**
 * Renders text with inline KaTeX math formulas.
 * Sanitizes HTML and processes $...$ expressions.
 */
export function KatexText({ children, className, as: Tag = 'span' }: KatexTextProps) {
  const html = renderWithKatex(DOMPurify.sanitize(children));
  return <Tag className={className} dangerouslySetInnerHTML={{ __html: html }} />;
}

interface KatexHtmlProps {
  html: string;
  className?: string;
}

/**
 * Renders sanitized HTML content with KaTeX math formula support.
 * Use for rich-text fields like question statements and explanations.
 */
export function KatexHtml({ html, className }: KatexHtmlProps) {
  const processed = renderWithKatex(DOMPurify.sanitize(html));
  return <div className={className} dangerouslySetInnerHTML={{ __html: processed }} />;
}
