import { useEffect, useState } from 'react';

const SQUARE_COUNT = 5;

const ROWS = [
  { id: 'gato', label: 'GATO', color: '#832c87' },
  { id: 'rato', label: 'RATO', color: '#0E3B5D' },
  { id: 'galo', label: 'GALO', color: '#0FA7A0' },
] as const;

type RowId = (typeof ROWS)[number]['id'];
type SquareState = Record<RowId, boolean[]>;

function emptyState(): SquareState {
  return {
    gato: Array(SQUARE_COUNT).fill(false),
    rato: Array(SQUARE_COUNT).fill(false),
    galo: Array(SQUARE_COUNT).fill(false),
  };
}

function loadState(storageKey: string): SquareState {
  try {
    const raw = localStorage.getItem(storageKey);
    if (!raw) return emptyState();
    const parsed = JSON.parse(raw) as Partial<SquareState>;
    return {
      gato: normalizeRow(parsed.gato),
      rato: normalizeRow(parsed.rato),
      galo: normalizeRow(parsed.galo),
    };
  } catch {
    return emptyState();
  }
}

function normalizeRow(value: boolean[] | undefined): boolean[] {
  if (!Array.isArray(value)) return Array(SQUARE_COUNT).fill(false);
  return Array.from({ length: SQUARE_COUNT }, (_, i) => Boolean(value[i]));
}

type ContagemQuadradosProps = {
  storageKey?: string;
  className?: string;
};

function ContagemQuadrados({ storageKey, className = '' }: ContagemQuadradosProps) {
  const [squares, setSquares] = useState<SquareState>(() =>
    storageKey ? loadState(storageKey) : emptyState(),
  );

  useEffect(() => {
    if (storageKey) {
      localStorage.setItem(storageKey, JSON.stringify(squares));
    }
  }, [squares, storageKey]);

  const toggleSquare = (rowId: RowId, index: number) => {
    setSquares((prev) => {
      const next = [...prev[rowId]];
      next[index] = !next[index];
      return { ...prev, [rowId]: next };
    });
  };

  return (
    <div className={`my-6 space-y-4 ${className}`}>
      <p className="text-sm text-gray-700">Clique nos quadradinhos para pintar.</p>
      {ROWS.map((row) => (
        <div key={row.id} className="flex items-center gap-4 md:gap-6">
          <span
            className="w-16 shrink-0 text-xl font-bold uppercase md:w-20 md:text-2xl"
            style={{ color: row.color }}
          >
            {row.label}
          </span>
          <div className="flex flex-wrap gap-2 md:gap-3">
            {squares[row.id].map((marked, index) => (
              <button
                key={index}
                type="button"
                onClick={() => toggleSquare(row.id, index)}
                className={`h-10 w-10 rounded-lg border-2 border-[#f6b221] transition focus:outline-none focus:ring-2 focus:ring-[#f6b221]/50 md:h-12 md:w-12 ${
                  marked ? 'bg-[#80298f]' : 'bg-white hover:bg-[#fff8eb]'
                }`}
                aria-label={`${row.label}, quadradinho ${index + 1}${marked ? ', marcado' : ''}`}
                aria-pressed={marked}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default ContagemQuadrados;
