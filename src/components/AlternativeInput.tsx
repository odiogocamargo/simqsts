import { useEffect, useRef } from 'react';
import DOMPurify from 'dompurify';
import { normalizeTextArtifacts, renderWithKatex } from '@/components/KatexRenderer';

interface AlternativeInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const imageToHtml = (file: File): Promise<string> => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.onload = (event) => {
    const src = event.target?.result;
    if (typeof src === 'string') {
      resolve(`<img src="${src}" alt="Imagem da alternativa">`);
      return;
    }
    reject(new Error('Não foi possível ler a imagem.'));
  };
  reader.onerror = () => reject(new Error('Não foi possível ler a imagem.'));
  reader.readAsDataURL(file);
});

const sanitizeAlternativeHtml = (html: string): string => {
  const normalized = normalizeTextArtifacts(html || '')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&amp;/gi, '&');

  return DOMPurify.sanitize(normalized, {
    ALLOWED_TAGS: ['br', 'div', 'p', 'span', 'strong', 'b', 'em', 'i', 'sub', 'sup', 'img'],
    ALLOWED_ATTR: ['src', 'alt'],
    ADD_DATA_URI_TAGS: ['img'],
  }).trim();
};

const htmlToEditableText = (html: string): string => sanitizeAlternativeHtml(html)
  .replace(/<p><br><\/p>/gi, '<br>')
  .replace(/<\/?p[^>]*>/gi, '<div>')
  .replace(/<\/p>/gi, '</div>');

export const AlternativeInput = ({ value, onChange, placeholder }: AlternativeInputProps) => {
  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const editor = editorRef.current;
    if (!editor) return;

    const safeValue = htmlToEditableText(value);
    if (editor.innerHTML !== safeValue) {
      editor.innerHTML = safeValue;
    }
  }, [value]);

  const emitChange = () => {
    const editor = editorRef.current;
    if (!editor) return;
    const safeValue = sanitizeAlternativeHtml(editor.innerHTML);
    onChange(safeValue);
  };

  const insertHtmlAtCursor = (html: string) => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0 || !editorRef.current?.contains(selection.anchorNode)) {
      editorRef.current?.focus();
      editorRef.current?.insertAdjacentHTML('beforeend', html);
      emitChange();
      return;
    }

    const range = selection.getRangeAt(0);
    range.deleteContents();
    const fragment = range.createContextualFragment(html);
    const lastNode = fragment.lastChild;
    range.insertNode(fragment);
    if (lastNode) {
      range.setStartAfter(lastNode);
      range.collapse(true);
      selection.removeAllRanges();
      selection.addRange(range);
    }
    emitChange();
  };

  const appendImages = async (files: File[]) => {
    const imageFiles = files.filter((file) => file.type.startsWith('image/'));
    if (imageFiles.length === 0) return false;

    const imagesHtml = await Promise.all(imageFiles.map(imageToHtml));
    insertHtmlAtCursor(imagesHtml.join(''));
    return true;
  };

  const handlePaste = async (e: React.ClipboardEvent<HTMLDivElement>) => {
    const files = Array.from(e.clipboardData.files || []);
    if (files.some((file) => file.type.startsWith('image/'))) {
      e.preventDefault();
      await appendImages(files);
      return;
    }

    e.preventDefault();
    const text = e.clipboardData.getData('text/plain');
    if (text) insertHtmlAtCursor(DOMPurify.sanitize(text).replace(/\n/g, '<br>'));
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    const files = Array.from(e.dataTransfer.files || []);
    if (files.length === 0) return;

    e.preventDefault();
    await appendImages(files);
  };

  return (
    <div className="relative">
      {!value && (
        <span className="pointer-events-none absolute left-3 top-2 text-sm text-muted-foreground">
          {placeholder}
        </span>
      )}
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onInput={emitChange}
        onPaste={handlePaste}
        onDrop={handleDrop}
        className="min-h-[76px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 [&_img]:my-2 [&_img]:max-h-40 [&_img]:max-w-full [&_img]:rounded-md [&_img]:border [&_img]:border-border [&_img]:object-contain"
      />
    </div>
  );
};
