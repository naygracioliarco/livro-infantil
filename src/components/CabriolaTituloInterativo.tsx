import { useEffect, useState } from 'react';

const STORAGE_KEY = 'livro:cabriola-titulo-interativo';

const PALETTE = [
  '#1e293b',
  '#dc2626',
  '#ea580c',
  '#ca8a04',
  '#16a34a',
  '#2563eb',
  '#7c3aed',
  '#db2777',
  '#0891b2',
] as const;


type SegmentKey = 'cabriola' | 'virgula' | 'cade' | 'a' | 'bola' | 'interrogacao';

const SEGMENT_META: Record<SegmentKey, { text: string }> = {
  cabriola: { text: 'CABRIOLA' },
  virgula: { text: ',' },
  cade: { text: 'CADÊ' },
  a: { text: 'A' },
  bola: { text: 'BOLA' },
  interrogacao: { text: '?' },
};

/** Grupos com espaço entre si; dentro do grupo, vírgula e “?” ficam colados na palavra. */
const TITLE_GROUPS: SegmentKey[][] = [
  ['cabriola', 'virgula'],
  ['cade'],
  ['a'],
  ['bola', 'interrogacao'],
];

type SavedState = {
  colors: Partial<Record<SegmentKey, string>>;
  /** Palavras em que o aluno marcou contorno (descoberta da rima). */
  contornos: Partial<Record<SegmentKey, boolean>>;
};

function loadState(): SavedState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return { colors: {}, contornos: {} };
    }
    const parsed = JSON.parse(raw) as SavedState & { showRhymeOutline?: boolean };
    return {
      colors: parsed.colors ?? {},
      contornos: parsed.contornos ?? {},
    };
  } catch {
    return { colors: {}, contornos: {} };
  }
}

function CabriolaTituloInterativo() {
  const [selectedColor, setSelectedColor] = useState<string>(PALETTE[0]);
  const [segmentColors, setSegmentColors] = useState<Partial<Record<SegmentKey, string>>>({});
  const [contourMarks, setContourMarks] = useState<Partial<Record<SegmentKey, boolean>>>({});
  const [contourMode, setContourMode] = useState(false);

  useEffect(() => {
    const s = loadState();
    setSegmentColors(s.colors);
    setContourMarks(s.contornos);
  }, []);

  useEffect(() => {
    const payload: SavedState = { colors: segmentColors, contornos: contourMarks };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  }, [segmentColors, contourMarks]);

  const paintSegment = (key: SegmentKey) => {
    setSegmentColors((prev) => ({ ...prev, [key]: selectedColor }));
  };

  const toggleContourOnSegment = (key: SegmentKey) => {
    setContourMarks((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSegmentClick = (key: SegmentKey) => {
    if (contourMode) {
      toggleContourOnSegment(key);
    } else {
      paintSegment(key);
    }
  };

  return (
    <div className="mb-6 rounded-2xl border border-[#832c87]/30 bg-[#faf8fc] p-4 md:p-6">
      

      <div
        className={`mb-4 flex flex-wrap items-center gap-2 transition ${contourMode ? 'opacity-40 pointer-events-none' : ''}`}
        aria-hidden={contourMode}
      >
        <span className="text-xs font-medium text-gray-600 uppercase">
          Escolha uma cor e clique nas palavras do título para pintar:
        </span>
        <div className="flex flex-wrap gap-2">
          {PALETTE.map((c) => (
            <button
              key={c}
              type="button"
              title={c}
              onClick={() => setSelectedColor(c)}
              className={`h-8 w-8 rounded-full border-2 transition ${
                selectedColor === c ? 'border-gray-900 ring-2 ring-offset-1' : 'border-gray-300'
              }`}
              style={{ backgroundColor: c }}
            />
          ))}
        </div>
      </div>

      <div
        className="mb-4 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-center text-2xl font-bold leading-tight tracking-wide md:gap-x-8 md:text-3xl"
        role="group"
        aria-label={
          contourMode
            ? 'Modo contorno: clique nas partes do título para marcar ou desmarcar o contorno.'
            : 'Título: Cabriola, cadê a bola? Clique em cada parte para pintar.'
        }
      >
        {TITLE_GROUPS.map((group, groupIndex) => (
          <div key={groupIndex} className="flex items-baseline gap-0">
            {group.map((key) => {
              const { text } = SEGMENT_META[key];
              const fillColor = segmentColors[key];
              const hasContour = Boolean(contourMarks[key]);
              const outlineClass = hasContour
                ? 'rounded px-0.5 ring-4 ring-dashed ring-[#832c87] ring-offset-2'
                : '';
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => handleSegmentClick(key)}
                  className={`shrink-0 cursor-pointer bg-transparent font-bold transition hover:opacity-90 ${outlineClass}`}
                  style={{
                    color: 'transparent',
                    fontSize: '44px',
                    WebkitTextStroke: '1px black',
                    WebkitTextFillColor: fillColor ?? 'transparent',
                  }}
                  title={
                    contourMode
                      ? 'Clique para marcar ou tirar o contorno desta parte'
                      : 'Clique para pintar com a cor selecionada'
                  }
                >
                  {text}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {contourMode && (
        <p className="mb-3 rounded-lg bg-[#832c87]/10 px-3 py-2 text-sm text-[#5b2060]">
          <strong>Modo contorno:</strong> clique nas palavras para marcar onde você acha que está a rima.
          Clique de novo no mesmo lugar para desmarcar.
        </p>
      )}

      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
        <button
          type="button"
          className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
            contourMode
              ? 'bg-[#832c87] text-white hover:bg-[#6d2470]'
              : 'border-2 border-[#832c87] bg-white text-[#832c87] hover:bg-[#faf8fc]'
          }`}
          onClick={() => setContourMode((v) => !v)}
        >
          {contourMode ? 'Voltar a pintar' : 'Marcar contorno na rima'}
        </button>
        <button
          type="button"
          className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50"
          onClick={() => {
            setSegmentColors({});
            setContourMarks({});
            setContourMode(false);
            localStorage.removeItem(STORAGE_KEY);
          }}
        >
          Limpar título
        </button>
      </div>
    </div>
  );
}

export default CabriolaTituloInterativo;
