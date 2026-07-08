import { useEffect, useRef, useState } from 'react';

interface IconeSecaoProps {
  emocoes?: boolean;
  conversas?: boolean;
  registros?: boolean;
  matematica?: boolean;
  experiencias?: boolean;
  leitura?: boolean;
  natureza?: boolean;
  arte?: boolean;
}

const ICONES = [
  { key: 'emocoes', src: '/images/icones-emocoes.png', alt: 'Emoções', texto: 'Dado das emoções' },
  { key: 'conversas', src: '/images/icones-conversas.png', alt: 'Conversas', texto: 'Nossas conversas' },
  { key: 'registros', src: '/images/icones-registros.png', alt: 'Registros', texto: 'Meus registros' },
  { key: 'matematica', src: '/images/icones-matematica.png', alt: 'Matemática', texto: 'Brinco com a matemática' },
  { key: 'experiencias', src: '/images/icones_experiencias.png', alt: 'Campos de experiências', texto: 'Minhas experiências' },
  { key: 'leitura', src: '/images/icones-leitura.png', alt: 'Leitura', texto: 'Minhas leituras' },
  { key: 'natureza', src: '/images/icones-natureza.png', alt: 'Natureza', texto: 'Brinco com a natureza' },
  { key: 'arte', src: '/images/icones-arte.png', alt: 'Arte', texto: 'Faço arte' },
] as const;

function IconeComTexto({ src, alt, texto }: { src: string; alt: string; texto: string }) {
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
      className="relative"
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
          src={src}
          alt={alt}
          className="noborder block h-auto w-12 md:w-16"
          style={{ cursor: 'pointer' }}
          draggable={false}
        />
      </button>
      {open && (
        <span
          role="tooltip"
          className="absolute right-0 top-full z-10 mt-2 w-max max-w-[200px] rounded-lg bg-[#80298F] px-3 py-2 text-center text-white shadow-lg"
          style={{ fontSize: '14px', lineHeight: 1.3, textTransform: 'none' }}
        >
          {texto}
        </span>
      )}
    </div>
  );
}

function IconeSecao({ emocoes, conversas, registros, matematica, experiencias, leitura, natureza, arte }: IconeSecaoProps) {
  const ativos: Record<string, boolean | undefined> = {
    emocoes,
    conversas,
    registros,
    matematica,
    experiencias,
    leitura,
    natureza,
    arte,
  };

  const visiveis = ICONES.filter((icone) => ativos[icone.key]);

  if (visiveis.length === 0) {
    return null;
  }

  return (
    <div className="order-last ml-auto flex shrink-0 items-start justify-end gap-2">
      {visiveis.map((icone) => (
        <IconeComTexto key={icone.key} src={icone.src} alt={icone.alt} texto={icone.texto} />
      ))}
    </div>
  );
}

export default IconeSecao;
