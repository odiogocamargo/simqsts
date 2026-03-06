import { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { normalizeTextArtifacts, renderWithKatex } from '@/components/KatexRenderer';

interface AlternativeInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const hasLatex = (text: string) => /\$[^$]+\$/.test(normalizeTextArtifacts(text));

/** Strip any HTML tags/escaped chars that may come from AI extraction */
const sanitizePlainText = (text: string): string => {
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

export const AlternativeInput = ({ value, onChange, placeholder }: AlternativeInputProps) => {
  const previewRef = useRef<HTMLDivElement>(null);
  const [rawValue, setRawValue] = useState(sanitizePlainText(value));

  useEffect(() => {
    setRawValue(sanitizePlainText(value));
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVal = sanitizePlainText(e.target.value);
    setRawValue(newVal);
    onChange(newVal);
  };

  const showPreview = hasLatex(rawValue);

  return (
    <div className="space-y-1.5">
      <Input
        value={rawValue}
        onChange={handleChange}
        placeholder={placeholder}
        className="text-sm"
      />
      {showPreview && (
        <div
          ref={previewRef}
          className="rounded-md border border-border/50 bg-muted/30 px-3 py-2 text-sm"
          dangerouslySetInnerHTML={{ __html: renderWithKatex(rawValue) }}
        />
      )}
    </div>
  );
};

