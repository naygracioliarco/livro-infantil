import { useState } from 'react';
import MostrarRespostaButton from './MostrarRespostaButton';

const WORDS = [
  { id: 'cabeca', label: 'CABEÇA', color: '#832c87' },
  { id: 'barriga', label: 'BARRIGA', color: '#0FA7A0' },
  { id: 'pe', label: 'PÉ', color: '#E88B2F' },
] as const;

function PalavrasBambolhe() {
  const [showResposta, setShowResposta] = useState(false);

  return (
    <div className="my-6">
      <div className="flex flex-wrap justify-center gap-4 md:gap-6">
        {WORDS.map((word) => (
          <div
            key={word.id}
            className="flex min-w-[120px] flex-1 items-center justify-center rounded-xl border-2 border-[#f6b221] bg-white px-6 py-5 md:min-w-[150px] md:px-8 md:py-6"
          >
            <span
              className={`text-xl font-bold uppercase md:text-2xl ${
                word.id === 'barriga' && showResposta
                  ? 'rounded-[50%] border-2 border-[#ED168F] px-4 py-2'
                  : ''
              }`}
              style={{ color: word.color }}
            >
              {word.label}
            </span>
          </div>
        ))}
      </div>

      <MostrarRespostaButton
        showing={showResposta}
        onClick={() => setShowResposta((v) => !v)}
        showLabel="Mostrar a resposta"
        hideLabel="Ocultar resposta"
      />
    </div>
  );
}

export default PalavrasBambolhe;
