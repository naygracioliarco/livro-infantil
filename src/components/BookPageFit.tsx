import { useLayoutEffect, useRef, useState, type ReactNode } from 'react';

type BookPageFitProps = {
  children: ReactNode;
  /** Escala mínima (ex.: 0,68) para não ficar ilegível. */
  minScale?: number;
  className?: string;
};

/**
 * Encaixa o conteúdo na altura visível da janela (área abaixo do topo do bloco),
 * usando `transform: scale`, para evitar ter de rolar dentro de um “trecho” longo
 * (ex.: texto + atividade na mesma tela em projetores ou notebooks).
 */
function BookPageFit({ children, minScale = 0.68, className = '' }: BookPageFitProps) {
  const outerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [innerHeight, setInnerHeight] = useState(0);

  useLayoutEffect(() => {
    const outer = outerRef.current;
    const inner = innerRef.current;
    if (!outer || !inner) {
      return;
    }

    let raf = 0;

    const measure = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const rect = outer.getBoundingClientRect();
        const top = Math.max(0, rect.top);
        const bottomReserve = 16;
        let available = window.innerHeight - top - bottomReserve;
        if (rect.top > window.innerHeight - 48) {
          available = window.innerHeight - bottomReserve;
        }
        available = Math.max(200, available);
        const needed = inner.scrollHeight;
        if (needed <= 0) {
          return;
        }
        const prefersReduced =
          typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
        const s = prefersReduced ? 1 : Math.min(1, Math.max(minScale, available / needed));
        setScale(s);
        setInnerHeight(needed);
      });
    };

    measure();
    window.addEventListener('resize', measure);
    window.addEventListener('scroll', measure, { passive: true });
    const ro = new ResizeObserver(measure);
    ro.observe(inner);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', measure);
      window.removeEventListener('scroll', measure);
      ro.disconnect();
    };
  }, [minScale]);

  const layoutHeight = innerHeight > 0 ? innerHeight * scale : undefined;

  return (
    <div
      ref={outerRef}
      className={`w-full overflow-hidden ${className}`}
      style={{ height: layoutHeight }}
    >
      <div
        ref={innerRef}
        style={{
          transform: `scale(${scale})`,
          transformOrigin: 'top left',
          width: scale < 1 ? `${100 / scale}%` : '100%',
        }}
      >
        {children}
      </div>
    </div>
  );
}

export default BookPageFit;
