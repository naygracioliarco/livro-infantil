import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type RefObject,
} from 'react';

interface BookPageModeProps {
  containerRef: RefObject<HTMLElement>;
  /** Página inicial (numérica) ao entrar no modo. */
  initialPage?: number;
}

interface Slice {
  page: number;
  startIdx: number;
  endIdx: number;
}

function getDirectPageMarkers(container: HTMLElement) {
  const out: { el: HTMLElement; page: number; idx: number }[] = [];
  Array.from(container.children).forEach((c, idx) => {
    const el = c as HTMLElement;
    const dp = el.getAttribute('data-page');
    if (dp) {
      const p = parseInt(dp, 10);
      if (!Number.isNaN(p)) out.push({ el, page: p, idx });
    }
  });
  return out;
}

function buildSlices(container: HTMLElement): Slice[] {
  const markers = getDirectPageMarkers(container);
  if (markers.length === 0) return [];
  // O 1º marcador costuma ser o cabeçalho dinâmico (Pagination com currentPage).
  // Tratamos como cabeçalho se ele for o primeiro filho do container.
  const headerIdx = markers[0].idx === 0 ? 0 : -1;
  const real = headerIdx === 0 ? markers.slice(1) : markers;
  return real.map((m, i) => ({
    page: m.page,
    startIdx: i === 0 ? headerIdx + 1 : real[i - 1].idx + 1,
    endIdx: m.idx,
  }));
}

function fitContainer(container: HTMLElement, reserveBottom = 96, reserveTop = 16) {
  // Reseta o zoom antes de medir para pegar tamanho real.
  (container.style as unknown as { zoom: string }).zoom = '';
  const needed = container.offsetHeight;
  const available = window.innerHeight - reserveTop - reserveBottom;
  if (needed > 0 && needed > available) {
    const z = Math.max(0.45, available / needed);
    (container.style as unknown as { zoom: string }).zoom = String(z);
  }
}

function BookPageMode({ containerRef, initialPage }: BookPageModeProps) {
  const [active, setActive] = useState(false);
  const [pageIdx, setPageIdx] = useState(0);
  const slicesRef = useRef<Slice[]>([]);
  const initialDisplayRef = useRef<Map<HTMLElement, string> | null>(null);
  const initialZoomRef = useRef<string>('');

  // Construir slices ao entrar e restaurar ao sair.
  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    if (!active) {
      // Restaurar
      if (initialDisplayRef.current) {
        initialDisplayRef.current.forEach((display, el) => {
          el.style.display = display;
        });
        initialDisplayRef.current = null;
      }
      (container.style as unknown as { zoom: string }).zoom = initialZoomRef.current;
      return;
    }

    // Captura estado inicial dos filhos
    if (!initialDisplayRef.current) {
      const map = new Map<HTMLElement, string>();
      Array.from(container.children).forEach((c) => {
        const el = c as HTMLElement;
        map.set(el, el.style.display);
      });
      initialDisplayRef.current = map;
      initialZoomRef.current =
        (container.style as unknown as { zoom: string }).zoom ?? '';
    }

    const slices = buildSlices(container);
    slicesRef.current = slices;

    // Tenta pular para a página inicial (somente na 1ª vez de cada ativação).
    if (initialPage != null) {
      const idx = slices.findIndex((s) => s.page === initialPage);
      if (idx >= 0) {
        setPageIdx(idx);
      }
    }
  }, [active, containerRef, initialPage]);

  // Aplicar slice atual + zoom
  useLayoutEffect(() => {
    if (!active) return;
    const container = containerRef.current;
    if (!container) return;
    const slices = slicesRef.current;
    if (slices.length === 0) return;
    const safeIdx = Math.min(Math.max(0, pageIdx), slices.length - 1);
    const current = slices[safeIdx];
    if (!current) return;

    const children = Array.from(container.children) as HTMLElement[];
    children.forEach((c, idx) => {
      const inSlice = idx >= current.startIdx && idx <= current.endIdx;
      c.style.display = inSlice ? '' : 'none';
    });

    requestAnimationFrame(() => {
      fitContainer(container);
      window.scrollTo({ top: 0, behavior: 'auto' });
    });
  }, [active, pageIdx, containerRef]);

  // Re-encaixa no resize
  useEffect(() => {
    if (!active) return;
    const container = containerRef.current;
    if (!container) return;
    const onResize = () => fitContainer(container);
    window.addEventListener('resize', onResize);
    const ro = new ResizeObserver(() => fitContainer(container));
    ro.observe(container);
    return () => {
      window.removeEventListener('resize', onResize);
      ro.disconnect();
    };
  }, [active]);

  // Atalhos de teclado
  useEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'PageDown') {
        e.preventDefault();
        setPageIdx((i) => Math.min(slicesRef.current.length - 1, i + 1));
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        e.preventDefault();
        setPageIdx((i) => Math.max(0, i - 1));
      } else if (e.key === 'Escape') {
        e.preventDefault();
        setActive(false);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [active]);

  if (!active) {
    return (
      <button
        type="button"
        onClick={() => setActive(true)}
        className="fixed left-4 bottom-4 z-40 inline-flex items-center gap-2 rounded-full bg-[#80298F] px-4 py-2 text-sm font-semibold text-white shadow-lg transition hover:bg-[#6b2178]"
        title="Encaixar uma página por tela"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden>
          <path
            fill="currentColor"
            d="M5 5h6v2H7v4H5V5zm14 0v6h-2V7h-4V5h6zM5 19v-6h2v4h4v2H5zm14 0h-6v-2h4v-4h2v6z"
          />
        </svg>
        Modo página
      </button>
    );
  }

  const slices = slicesRef.current;
  const safeIdx = Math.min(Math.max(0, pageIdx), Math.max(0, slices.length - 1));
  const current = slices[safeIdx];

  return (
    <div className="fixed inset-x-0 bottom-3 z-50 flex justify-center px-3">
      <div className="flex items-center gap-1 rounded-full bg-white px-3 py-2 shadow-xl ring-1 ring-black/10">
        <button
          type="button"
          disabled={safeIdx === 0}
          onClick={() => setPageIdx((i) => Math.max(0, i - 1))}
          className="rounded-full px-3 py-1 text-sm font-semibold text-[#80298F] transition hover:bg-[#80298F]/10 disabled:cursor-not-allowed disabled:opacity-30"
          aria-label="Página anterior"
        >
          ‹ Anterior
        </button>
        <span className="px-3 text-sm font-medium text-gray-700 whitespace-nowrap">
          Página {current?.page ?? '—'}{' '}
          <span className="text-gray-400">
            ({slices.length === 0 ? 0 : safeIdx + 1}/{slices.length})
          </span>
        </span>
        <button
          type="button"
          disabled={safeIdx >= slices.length - 1}
          onClick={() => setPageIdx((i) => Math.min(slicesRef.current.length - 1, i + 1))}
          className="rounded-full px-3 py-1 text-sm font-semibold text-[#80298F] transition hover:bg-[#80298F]/10 disabled:cursor-not-allowed disabled:opacity-30"
          aria-label="Próxima página"
        >
          Próxima ›
        </button>
        <button
          type="button"
          onClick={() => setActive(false)}
          className="ml-2 rounded-full bg-[#80298F] px-3 py-1 text-sm font-semibold text-white transition hover:bg-[#6b2178]"
        >
          Sair
        </button>
      </div>
    </div>
  );
}

export default BookPageMode;
