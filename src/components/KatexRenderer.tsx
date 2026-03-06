import katex from 'katex';
import 'katex/dist/katex.min.css';
import DOMPurify from 'dompurify';

/** Normaliza artefatos comuns vindos de OCR/IA: \n literal, \$ e espaços não-quebráveis. */
export const normalizeTextArtifacts = (text: string): string => {
  if (!text) return '';

  return text
    .replace(/\\r\\n/g, '\n')
    .replace(/\\n|\\r/g, '\n')
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .replace(/\\t/g, ' ')
    .replace(/\\\$/g, '$')
    .replace(/&nbsp;/gi, ' ')
    .replace(/\u00a0/g, ' ');
};

/** Strips HTML tags, collapses whitespace – for plain-text display of alternatives */
export const stripHtmlToPlain = (text: string): string => {
  if (!text) return '';
  return normalizeTextArtifacts(text)
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&amp;/gi, '&')
    .replace(/<br\s*\/?>/gi, ' ')
    .replace(/<[^>]*>/g, '')
    .replace(/\n/g, ' ')
    .replace(/\s{2,}/g, ' ')
    .trim();
};

/**
 * Processes a string, rendering any $...$ LaTeX expressions with KaTeX.
 * Works with both plain text and HTML content.
 */
export const renderWithKatex = (text: string): string => {
  const normalized = normalizeTextArtifacts(text);
  if (!normalized) return '';

  return normalized.replace(/\$([^$]+)\$/g, (_, formula) => {
    try {
      return katex.renderToString(formula.trim(), { throwOnError: false, displayMode: false });
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
  const plain = stripHtmlToPlain(children);
  const html = renderWithKatex(plain);
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
  const processed = renderWithKatex(DOMPurify.sanitize(normalizeTextArtifacts(html)));
  return <div className={className} dangerouslySetInnerHTML={{ __html: processed }} />;
}

