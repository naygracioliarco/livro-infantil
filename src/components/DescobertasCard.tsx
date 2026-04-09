interface DescobertasCardProps {
  text: string;
}

function DescobertasCard({ text }: DescobertasCardProps) {
  return (
    <div
      className="my-6 mx-auto"
      style={{
        maxWidth: '520px',
        position: 'relative',
      }}
    >
      <div
        style={{
          background: '#ffffff',
          borderRadius: '26px',
          padding: '44px 28px 24px',
          border: '2px solid #d7ecf9',
          boxShadow: '0 3px 0 #9ecde7',
          textAlign: 'center',
        }}
      >
        <p
          style={{
            margin: 0,
            color: '#4b5563',
            fontFamily: 'Ubuntu, sans-serif',
            fontWeight: 300,
            fontSize: '32px',
            lineHeight: 1.45,
            textTransform: 'uppercase',
            whiteSpace: 'pre-line',
          }}
        >
          {text}
        </p>
      </div>

      <div
        style={{
          position: 'absolute',
          top: '-22px',
          left: '50%',
          transform: 'translateX(-50%) ',
          background: '#ffffff',
          borderRadius: '999px',
          border: '4px solid #832c87',
          boxShadow: '0 2px 0 #d8ecfa',
          padding: '10px 18px 8px',
          color: '#00a99d',
          fontFamily: '"hwt-artz", "Ubuntu", sans-serif',
          fontWeight: 700,
          fontSize: '30px',
          lineHeight: 1,
          textTransform: 'uppercase',
          whiteSpace: 'nowrap',
        }}
      >
        <span style={{ color: '#7A3E98', display: 'inline-block'}}>Q</span>
        <span style={{ color: '#a5be5e', display: 'inline-block'}}>U</span>
        <span style={{ color: '#5ea9dd', display: 'inline-block'}}>A</span>
        <span style={{ color: '#00b8ac', display: 'inline-block'}}>I</span>
        <span style={{ color: '#efac2a', display: 'inline-block'}}>S</span>
        <span>&nbsp;</span>
        <span style={{ color: '#f172a4', display: 'inline-block'}}>S</span>
        <span style={{ color: '#f7966b', display: 'inline-block'}}>E</span>
        <span style={{ color: '#efac2a', display: 'inline-block'}}>R</span>
        <span style={{ color: '#00b8ac', display: 'inline-block'}}>Ã</span>
        <span style={{ color: '#f172a4', display: 'inline-block'}}>O</span>
        <span>&nbsp;</span>
        <span style={{ color: '#f7966b', display: 'inline-block'}}>A</span>
        <span style={{ color: '#a5be5e', display: 'inline-block'}}>S</span>
        <span>&nbsp;</span>
        <span style={{ color: '#7A3E98', display: 'inline-block'}}>D</span>
        <span style={{ color: '#7A3E98', display: 'inline-block'}}>E</span>
        <span style={{ color: '#7A3E98', display: 'inline-block'}}>S</span>
        <span style={{ color: '#7A3E98', display: 'inline-block'}}>C</span>
        <span style={{ color: '#7A3E98', display: 'inline-block'}}>O</span>
        <span style={{ color: '#7A3E98', display: 'inline-block'}}>B</span>
        <span style={{ color: '#7A3E98', display: 'inline-block'}}>E</span>
        <span style={{ color: '#7A3E98', display: 'inline-block'}}>R</span>
        <span style={{ color: '#7A3E98', display: 'inline-block'}}>T</span>
        <span style={{ color: '#7A3E98', display: 'inline-block'}}>A</span>
        <span style={{ color: '#7A3E98', display: 'inline-block'}}>S</span>
        <span style={{ color: '#7A3E98', display: 'inline-block'}}>?</span>
      </div>
    </div>
  );
}

export default DescobertasCard;
