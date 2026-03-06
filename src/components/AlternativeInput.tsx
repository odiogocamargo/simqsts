import { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import katex from 'katex';
import 'katex/dist/katex.min.css';

interface AlternativeInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

/**
 * Renders a string replacing $...$ with KaTeX-rendered HTML.
 */
const renderWithKatex = (text: string): string => {
  if (!text) return '';
  return text.replace(/\$([^$]+)\$/g, (_, formula) => {
    try {
      return katex.renderToString(formula, { throwOnError: false, displayMode: false });
    } catch {
      return `$${formula}$`;
    }
  });
};

const hasLatex = (text: string) => /\$[^$]+\$/.test(text);

export const AlternativeInput = ({ value, onChange, placeholder }: AlternativeInputProps) => {
  const previewRef = useRef<HTMLDivElement>(null);
  const [rawValue, setRawValue] = useState(value);

  // Sync external changes
  useEffect(() => {
    setRawValue(value);
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVal = e.target.value;
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
