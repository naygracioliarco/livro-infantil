import { useEffect, useRef, useState } from 'react';

interface TagConteudoDigitalProps {
  className?: string;
  texto?: string;
}

function TagConteudoDigital({
  className = '',
  texto = 'Atividade modificada para o digital',
}: TagConteudoDigitalProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handlePointerDown = (event: PointerEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('pointerdown', handlePointerDown);
    return () => document.removeEventListener('pointerdown', handlePointerDown);
  }, [open]);

  return (
    <div
      ref={containerRef}
      className={`absolute left-2 top-2 z-10 ${className}`}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="block focus:outline-none"
        aria-label={texto}
      >
        <img
          src="/images/tagConteudoDigital.png"
          alt=""
          className="h-auto w-12 md:w-14"
          draggable={false}
        />
      </button>
      {open && (
        <span
          role="tooltip"
          className="absolute left-0 top-full mt-2 w-max max-w-[220px] rounded-lg bg-[#80298F] px-3 py-2 text-left text-white shadow-lg"
          style={{ fontSize: '14px', lineHeight: 1.3, textTransform: 'none' }}
        >
          {texto}
        </span>
      )}
    </div>
  );
}

export default TagConteudoDigital;
