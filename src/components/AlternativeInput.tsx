import { useState, useEffect, useRef } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { ImageIcon } from 'lucide-react';
import { normalizeTextArtifacts, renderWithKatex } from '@/components/KatexRenderer';

interface AlternativeInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const hasLatex = (text: string) => /\$[^$]+\$/.test(normalizeTextArtifacts(text));

const imageToHtml = (file: File): Promise<string> => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.onload = (event) => {
    const src = event.target?.result;
    if (typeof src === 'string') {
      resolve(`<img src="${src}" alt="Imagem da alternativa" />`);
      return;
    }
    reject(new Error('Não foi possível ler a imagem.'));
  };
  reader.onerror = () => reject(new Error('Não foi possível ler a imagem.'));
  reader.readAsDataURL(file);
});

/** Strip unsafe HTML/escaped chars that may come from AI extraction while preserving images in alternatives */
const sanitizePlainText = (text: string): string => {
  if (!text) return '';

  return normalizeTextArtifacts(text)
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&amp;/gi, '&')
    .replace(/<img\s+[^>]*src=["']([^"']+)["'][^>]*>/gi, (_, src) => {
      const safeSrc = String(src).trim();
      if (!/^(data:image\/(png|jpe?g|gif|webp);base64,|https?:\/\/)/i.test(safeSrc)) return '';
      return `<img src="${safeSrc}" alt="Imagem da alternativa" />`;
    })
    .replace(/<br\s*\/?>/gi, ' ')
    .replace(/<[^>]*>/g, '')
    .replace(/\n/g, ' ')
    .replace(/\s{2,}/g, ' ')
    .trim();
};

export const AlternativeInput = ({ value, onChange, placeholder }: AlternativeInputProps) => {
  const previewRef = useRef<HTMLDivElement>(null);
  const [rawValue, setRawValue] = useState(sanitizePlainText(value));

  useEffect(() => {
    setRawValue(sanitizePlainText(value));
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newVal = sanitizePlainText(e.target.value);
    setRawValue(newVal);
    onChange(newVal);
  };

  const appendImages = async (files: File[]) => {
    const imageFiles = files.filter((file) => file.type.startsWith('image/'));
    if (imageFiles.length === 0) return false;

    const imageHtml = await Promise.all(imageFiles.map(imageToHtml));
    const nextValue = sanitizePlainText([rawValue, ...imageHtml].filter(Boolean).join(' '));
    setRawValue(nextValue);
    onChange(nextValue);
    return true;
  };

  const handlePaste = async (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    const files = Array.from(e.clipboardData.files || []);
    if (files.length === 0) return;

    e.preventDefault();
    await appendImages(files);
  };

  const handleDrop = async (e: React.DragEvent<HTMLTextAreaElement>) => {
    const files = Array.from(e.dataTransfer.files || []);
    if (files.length === 0) return;

    e.preventDefault();
    await appendImages(files);
  };

  const showPreview = hasLatex(rawValue) || /<img\s/i.test(rawValue);

  return (
    <div className="space-y-1.5">
      <Textarea
        value={rawValue}
        onChange={handleChange}
        onPaste={handlePaste}
        onDrop={handleDrop}
        placeholder={placeholder}
        rows={2}
        className="min-h-[76px] text-sm"
      />
      <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <ImageIcon className="h-3.5 w-3.5" />
        Cole uma imagem aqui quando a alternativa tiver figura.
      </p>
      {showPreview && (
        <div
          ref={previewRef}
          className="rounded-md border border-border/50 bg-muted/30 px-3 py-2 text-sm [&_img]:mt-2 [&_img]:max-h-40 [&_img]:max-w-full [&_img]:rounded-md [&_img]:border [&_img]:border-border [&_img]:object-contain"
          dangerouslySetInnerHTML={{ __html: renderWithKatex(rawValue) }}
        />
      )}
    </div>
  );
};

