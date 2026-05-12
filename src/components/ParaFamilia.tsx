import { useState } from 'react';

type ParaFamiliaProps = {
  text: string;
};

function ParaFamilia({ text }: ParaFamiliaProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="my-6">
      <button
        type="button"
        onClick={() => setIsOpen((v) => !v)}
        aria-expanded={isOpen}
        className="flex items-center gap-3 mb-3 cursor-pointer bg-transparent p-0 border-0"
      >
        <h2
          style={{
            color: '#0E3B5D',
            fontFamily: 'hwt-artz',
            fontSize: '26px',
            fontStyle: 'normal',
            fontWeight: 700,
            lineHeight: 'normal',
          }}
        >
          <span style={{ color: '#7961aa' }}>P</span><span style={{ color: '#f7966b' }}>a</span><span style={{ color: '#5ea9dd' }}>r</span><span style={{ color: '#f7966b' }}>a</span>{' '}
          <span style={{ color: '#7961aa' }}>a</span>{' '}
          <span style={{ color: '#f172a4' }}>f</span><span style={{ color: '#f7966b' }}>a</span><span style={{ color: '#7961aa' }}>m</span><span style={{ color: '#5ea9dd' }}>í</span><span style={{ color: '#a5be5e' }}>l</span><span style={{ color: '#7961aa' }}>i</span><span style={{ color: '#5ea9dd' }}>a</span>
        </h2>
        <span
          aria-hidden
          className={`inline-flex h-7 w-7 items-center justify-center rounded-full text-sm font-bold transition-transform duration-300 ${
            isOpen ? 'rotate-180' : ''
          }`}
          style={{ backgroundColor: '#74cac3', color: '#fff' }}
        >
          ▾
        </span>
      </button>

      <div
        className="grid transition-all duration-300 ease-out"
        style={{
          gridTemplateRows: isOpen ? '1fr' : '0fr',
          opacity: isOpen ? 1 : 0,
        }}
      >
        <div className="overflow-hidden">
          <div
            className="rounded-2xl p-4 md:p-5"
            style={{ border: '2px solid #74cac3' }}
          >
            <p className="mb-0 indent-6">
              {text}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ParaFamilia;
