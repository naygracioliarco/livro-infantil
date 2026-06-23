import { useEffect, useState } from 'react';

const HEART_COUNT = 10;
const EMPTY_SRC = '/images/pag27_img1.png';
const FILLED_SRC = '/images/pag27_img2.png';

type CoracoesPintarProps = {
  storageKey?: string;
  className?: string;
};

function loadState(storageKey: string): boolean[] {
  try {
    const raw = localStorage.getItem(storageKey);
    if (!raw) return Array(HEART_COUNT).fill(false);
    const parsed = JSON.parse(raw) as boolean[];
    return Array.from({ length: HEART_COUNT }, (_, i) => Boolean(parsed?.[i]));
  } catch {
    return Array(HEART_COUNT).fill(false);
  }
}

function CoracoesPintar({ storageKey, className = '' }: CoracoesPintarProps) {
  const [hearts, setHearts] = useState<boolean[]>(() =>
    storageKey ? loadState(storageKey) : Array(HEART_COUNT).fill(false),
  );

  useEffect(() => {
    if (storageKey) {
      localStorage.setItem(storageKey, JSON.stringify(hearts));
    }
  }, [hearts, storageKey]);

  const toggleHeart = (index: number) => {
    setHearts((prev) => {
      const next = [...prev];
      next[index] = !next[index];
      return next;
    });
  };

  return (
    <div className={`my-6 flex flex-wrap justify-center gap-2 md:gap-3 ${className}`}>
      {hearts.map((filled, index) => (
        <button
          key={index}
          type="button"
          onClick={() => toggleHeart(index)}
          className="rounded-lg p-1 transition hover:scale-110 focus:outline-none focus:ring-2 focus:ring-[#832c87]/40"
          aria-label={`Coração ${index + 1}${filled ? ', pintado' : ''}`}
          aria-pressed={filled}
        >
          <img
            src={filled ? FILLED_SRC : EMPTY_SRC}
            alt=""
            draggable={false}
            className="h-12 w-12 object-contain md:h-14 md:w-14"
          />
        </button>
      ))}
    </div>
  );
}

export default CoracoesPintar;
