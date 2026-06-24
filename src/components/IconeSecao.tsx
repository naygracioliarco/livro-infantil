interface IconeSecaoProps {
  emocoes?: boolean;
  conversas?: boolean;
  registros?: boolean;
  matematica?: boolean;
  experiencias?: boolean;
  leitura?: boolean;
}

const ICONES = [
  { key: 'emocoes', src: '/images/icones-emocoes.png', alt: 'Emoções' },
  { key: 'conversas', src: '/images/icones-conversas.png', alt: 'Conversas' },
  { key: 'registros', src: '/images/icones-registros.png', alt: 'Registros' },
  { key: 'matematica', src: '/images/icones-matematica.png', alt: 'Matemática' },
  { key: 'experiencias', src: '/images/icones_experiencias.png', alt: 'Campos de experiências' },
  { key: 'leitura', src: '/images/icones-leitura.png', alt: 'Leitura' },
] as const;

function IconeSecao({ emocoes, conversas, registros, matematica, experiencias, leitura }: IconeSecaoProps) {
  const ativos: Record<string, boolean | undefined> = {
    emocoes,
    conversas,
    registros,
    matematica,
    experiencias,
    leitura,
  };

  const visiveis = ICONES.filter((icone) => ativos[icone.key]);

  if (visiveis.length === 0) {
    return null;
  }

  return (
    <div className="order-last ml-auto flex shrink-0 items-start justify-end gap-2">
      {visiveis.map((icone) => (
        <img
          key={icone.key}
          src={icone.src}
          alt={icone.alt}
          className="noborder block h-auto w-12 md:w-16"
          style={{ cursor: 'default' }}
        />
      ))}
    </div>
  );
}

export default IconeSecao;
