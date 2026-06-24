import { ReactNode } from 'react';

interface CaixaTextoProps {
  title: ReactNode;
  children: ReactNode;
  backgroundColor?: string;
  columns?: number;
  centered?: boolean;
}

function CaixaTexto({ title, children, backgroundColor, columns, centered }: CaixaTextoProps) {
  const contentStyle: React.CSSProperties = {
    ...(columns && columns > 1 ? {
      // columnCount: columns,
      columnGap: '2rem',
      columnFill: 'auto',
    } : {}),
  };

  return (
    <div
      style={{
        border: '3px solid #0E3B5D',
        position: "relative",
        backgroundColor: backgroundColor || 'transparent',
      }}
      className="p-4 my-4"
    >
      <h4
        style={{
          color: '#BF3154',
          fontFamily: 'hwt-artz',
          fontSize: '20px',
          fontStyle: 'normal',
          fontWeight: 700,
          lineHeight: 'normal',
        }}
        className={`mb-4${centered ? ' text-center' : ''}`}
      >
        {title}
      </h4>
      <div
        className={`texto-corrido${centered ? ' texto-corrido--center' : ''}`}
        style={contentStyle}
      >
        {children}
      </div>
    </div>
  );
}

export default CaixaTexto;

