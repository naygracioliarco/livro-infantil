import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';

export type MatchConnectItem = {
  id: string;
  imageSrc: string;
  alt?: string;
};

export type MatchConnection = {
  leftId: string;
  rightId: string;
};

export type MatchConnectQuestionProps = {
  leftItems: MatchConnectItem[];
  rightItems: MatchConnectItem[];
  /** Salva ligações concluídas no localStorage. */
  storageKey?: string;
  className?: string;
  /** Texto curto acima das colunas (opcional). */
  hint?: string;
};

function clientToContainer(clientX: number, clientY: number, container: HTMLElement) {
  const cr = container.getBoundingClientRect();
  return { x: clientX - cr.left, y: clientY - cr.top };
}

function anchorOnContainer(
  itemEl: HTMLElement,
  container: HTMLElement,
  edge: 'left-mid' | 'right-mid',
) {
  const cr = container.getBoundingClientRect();
  const er = itemEl.getBoundingClientRect();
  const y = er.top - cr.top + er.height / 2;
  if (edge === 'right-mid') {
    return { x: er.right - cr.left, y };
  }
  return { x: er.left - cr.left, y };
}

function loadConnections(key: string | undefined): MatchConnection[] {
  if (!key) {
    return [];
  }
  try {
    const raw = localStorage.getItem(key);
    if (!raw) {
      return [];
    }
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) {
      return [];
    }
    return parsed.filter(
      (row): row is MatchConnection =>
        row != null &&
        typeof row === 'object' &&
        'leftId' in row &&
        'rightId' in row &&
        typeof (row as MatchConnection).leftId === 'string' &&
        typeof (row as MatchConnection).rightId === 'string',
    );
  } catch {
    return [];
  }
}

function MatchConnectQuestion({
  leftItems,
  rightItems,
  storageKey,
  className = '',
  hint,
}: MatchConnectQuestionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const leftRefs = useRef<Map<string, HTMLButtonElement>>(new Map());
  const rightRefs = useRef<Map<string, HTMLButtonElement>>(new Map());

  const [box, setBox] = useState({ w: 0, h: 0 });
  const [connections, setConnections] = useState<MatchConnection[]>(() => loadConnections(storageKey));
  const [activeLeftId, setActiveLeftId] = useState<string | null>(null);
  const [draftEnd, setDraftEnd] = useState<{ x: number; y: number } | null>(null);
  const [staticSegments, setStaticSegments] = useState<
    { x1: number; y1: number; x2: number; y2: number }[]
  >([]);

  useLayoutEffect(() => {
    const el = containerRef.current;
    if (!el) {
      return;
    }
    const measure = () => {
      const r = el.getBoundingClientRect();
      setBox({ w: r.width, h: r.height });
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    if (!storageKey) {
      return;
    }
    localStorage.setItem(storageKey, JSON.stringify(connections));
  }, [connections, storageKey]);

  const setLeftRef = useCallback((id: string, el: HTMLButtonElement | null) => {
    if (el) {
      leftRefs.current.set(id, el);
    } else {
      leftRefs.current.delete(id);
    }
  }, []);

  const setRightRef = useCallback((id: string, el: HTMLButtonElement | null) => {
    if (el) {
      rightRefs.current.set(id, el);
    } else {
      rightRefs.current.delete(id);
    }
  }, []);

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container || box.w === 0) {
      return;
    }
    const measureSegments = () => {
      const segs: { x1: number; y1: number; x2: number; y2: number }[] = [];
      for (const { leftId, rightId } of connections) {
        const le = leftRefs.current.get(leftId);
        const re = rightRefs.current.get(rightId);
        if (!le || !re) {
          continue;
        }
        const p1 = anchorOnContainer(le, container, 'right-mid');
        const p2 = anchorOnContainer(re, container, 'left-mid');
        segs.push({ x1: p1.x, y1: p1.y, x2: p2.x, y2: p2.y });
      }
      setStaticSegments(segs);
    };
    measureSegments();
    requestAnimationFrame(measureSegments);
  }, [connections, box, leftItems, rightItems]);

  useEffect(() => {
    if (!activeLeftId) {
      return;
    }
    const onMove = (e: MouseEvent | TouchEvent) => {
      const container = containerRef.current;
      if (!container) {
        return;
      }
      const clientX = 'touches' in e ? e.touches[0]?.clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0]?.clientY : e.clientY;
      if (clientX == null || clientY == null) {
        return;
      }
      setDraftEnd(clientToContainer(clientX, clientY, container));
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('touchmove', onMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('touchmove', onMove);
    };
  }, [activeLeftId]);

  const addConnection = (leftId: string, rightId: string) => {
    setConnections((prev) => {
      const next = prev.filter((c) => c.leftId !== leftId && c.rightId !== rightId);
      next.push({ leftId, rightId });
      return next;
    });
  };

  const handleLeftClick = (id: string, e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    const container = containerRef.current;
    if (!container) {
      return;
    }
    if (activeLeftId === id) {
      setActiveLeftId(null);
      setDraftEnd(null);
      return;
    }
    setActiveLeftId(id);
    setDraftEnd(clientToContainer(e.clientX, e.clientY, container));
  };

  const handleRightClick = (rightId: string, e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (!activeLeftId) {
      return;
    }
    addConnection(activeLeftId, rightId);
    setActiveLeftId(null);
    setDraftEnd(null);
  };

  let draftSegment: { x1: number; y1: number; x2: number; y2: number } | null = null;
  if (activeLeftId && draftEnd && containerRef.current) {
    const le = leftRefs.current.get(activeLeftId);
    if (le) {
      const p1 = anchorOnContainer(le, containerRef.current, 'right-mid');
      draftSegment = { x1: p1.x, y1: p1.y, x2: draftEnd.x, y2: draftEnd.y };
    }
  }

  return (
    <div className={`relative w-full ${activeLeftId ? 'touch-none' : ''} ${className}`}>
      {hint ? <p className="mb-3 text-sm text-gray-700">{hint}</p> : null}
      <div
        ref={containerRef}
        className="relative flex min-h-[200px] w-full flex-row items-stretch justify-between gap-4 md:gap-12"
      >
        {box.w > 0 && box.h > 0 && (
          <svg
            className="pointer-events-none absolute left-0 top-0 z-10 overflow-visible text-[#832c87]"
            width={box.w}
            height={box.h}
            aria-hidden
          >
            {staticSegments.map((seg, i) => (
              <line
                key={`c-${i}-${seg.x1}-${seg.y1}`}
                x1={seg.x1}
                y1={seg.y1}
                x2={seg.x2}
                y2={seg.y2}
                stroke="currentColor"
                strokeWidth={3}
                strokeLinecap="round"
              />
            ))}
            {draftSegment ? (
              <line
                x1={draftSegment.x1}
                y1={draftSegment.y1}
                x2={draftSegment.x2}
                y2={draftSegment.y2}
                stroke="currentColor"
                strokeWidth={3}
                strokeLinecap="round"
                strokeDasharray="8 6"
                opacity={0.9}
              />
            ) : null}
          </svg>
        )}

        <div className="relative z-20 flex flex-1 flex-col gap-3 md:gap-4">
          {leftItems.map((item) => (
            <button
              key={item.id}
              type="button"
              ref={(el) => setLeftRef(item.id, el)}
              onClick={(e) => handleLeftClick(item.id, e)}
              className={`flex items-center justify-center rounded-xl border-2 bg-white p-2 shadow-sm transition md:p-3 ${
                activeLeftId === item.id
                  ? 'border-[#832c87] ring-2 ring-[#832c87]/30'
                  : 'border-gray-200 hover:border-[#832c87]/50'
              }`}
            >
              <img
                src={item.imageSrc}
                alt={item.alt ?? ''}
                draggable={false}
                className="max-h-20 w-auto max-w-full object-contain md:max-h-24"
              />
            </button>
          ))}
        </div>

        <div className="relative z-20 flex flex-1 flex-col gap-3 md:gap-4">
          {rightItems.map((item) => (
            <button
              key={item.id}
              type="button"
              ref={(el) => setRightRef(item.id, el)}
              onClick={(e) => handleRightClick(item.id, e)}
              className="flex items-center justify-center rounded-xl border-2 border-gray-200 bg-white p-2 shadow-sm transition hover:border-[#832c87]/50 md:p-3"
            >
              <img
                src={item.imageSrc}
                alt={item.alt ?? ''}
                draggable={false}
                className="max-h-20 w-auto max-w-full object-contain md:max-h-24"
              />
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        {activeLeftId ? (
          <p className="text-sm font-medium text-[#832c87]">
            Toque ou clique em uma imagem à direita para completar a ligação.
          </p>
        ) : (
          <p className="text-sm text-gray-600">
            Clique à esquerda para começar; a linha segue o dedo ou o mouse até você clicar à direita.
          </p>
        )}
        <button
          type="button"
          className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50"
          onClick={() => {
            setConnections([]);
            setActiveLeftId(null);
            setDraftEnd(null);
            if (storageKey) {
              localStorage.removeItem(storageKey);
            }
          }}
        >
          Limpar ligações
        </button>
      </div>
    </div>
  );
}

export default MatchConnectQuestion;
