import { useEffect, useState } from 'react';

export type ImageFillItem = {
  id: string;
  imageSrc: string;
  alt?: string;
  labelPrefix?: string;
  placeholder?: string;
  imageClassName?: string;
};

type ImageFillQuestionProps = {
  items: ImageFillItem[];
  storageKey?: string;
  className?: string;
};

function ImageFillQuestion({ items, storageKey, className = '' }: ImageFillQuestionProps) {
  const [answers, setAnswers] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!storageKey) {
      return;
    }
    try {
      const raw = localStorage.getItem(storageKey);
      if (!raw) {
        return;
      }
      const parsed = JSON.parse(raw) as Record<string, string>;
      setAnswers(parsed ?? {});
    } catch {
      localStorage.removeItem(storageKey);
    }
  }, [storageKey]);

  useEffect(() => {
    if (!storageKey) {
      return;
    }
    localStorage.setItem(storageKey, JSON.stringify(answers));
  }, [answers, storageKey]);

  const handleChange = (itemId: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [itemId]: value }));
  };

  return (
    <div className={`space-y-5 ${className}`}>
      {items.map((item) => (
        <div key={item.id} className="grid grid-cols-[120px_1fr] items-center gap-4 md:grid-cols-[170px_1fr] md:gap-6">
          <div className="flex justify-center">
            <img
              src={item.imageSrc}
              alt={item.alt ?? ''}
              draggable={false}
              className={`w-auto object-contain ${item.imageClassName ?? 'max-h-24 md:max-h-36'}`}
            />
          </div>

          <div>
            <p className="mb-2 text-xl font-semibold uppercase text-[#4B4B4B]">
              {item.labelPrefix ?? 'BOLA DE'}
            </p>
            <input
              type="text"
              value={answers[item.id] ?? ''}
              onChange={(e) => handleChange(item.id, e.target.value)}
              className="w-full rounded-2xl border-2 border-[#0FA7A0] bg-transparent px-4 py-3 text-3xl text-center text-[#ED168F] outline-none focus:ring-2 focus:ring-[#0FA7A0]/30 md:py-4"
              placeholder={item.placeholder ?? ''}
            />
          </div>
        </div>
      ))}

      <div className="pt-2">
        <button
          type="button"
          className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50"
          onClick={() => {
            setAnswers({});
            if (storageKey) {
              localStorage.removeItem(storageKey);
            }
          }}
        >
          Limpar respostas
        </button>
      </div>
    </div>
  );
}

export default ImageFillQuestion;
