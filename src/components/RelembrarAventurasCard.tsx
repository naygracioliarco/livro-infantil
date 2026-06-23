

function RelembrarAventurasCard() {
  return (
    <div
      className="my-6 mx-auto"
      style={{
        maxWidth: '560px',
        position: 'relative',
      }}
    >
      <div
        style={{
          position: 'relative',
          overflow: 'hidden',
          borderRadius: '26px',
          border: '2px solid #d7ecf9',
          boxShadow: '0 3px 0 #9ecde7',
          
          padding: '36px 24px 48px',
          textAlign: 'center',
        }}
      >
        <div
          aria-hidden
          style={{
            position: 'absolute',
            bottom: '-12px',
            left: '-8%',
            width: '116%',
            height: '42%',
            background: '#ffffff',
            borderRadius: '50% 50% 0 0',
          }}
        />

        <div style={{ position: 'relative', zIndex: 1 }}>
          <p
            style={{
              margin: 0,
              color: '#1a4a6e',
              fontFamily: '"hwt-artz", "Ubuntu", sans-serif',
              fontWeight: 700,
              fontSize: 'clamp(22px, 4vw, 30px)',
              lineHeight: 1.15,
              textTransform: 'uppercase',
            }}
          >
            VAMOS RELEMBRAR
          </p>
          <p
            style={{
              margin: '4px 0 0',
              color: '#1a4a6e',
              fontFamily: '"hwt-artz", "Ubuntu", sans-serif',
              fontWeight: 700,
              fontSize: 'clamp(22px, 4vw, 30px)',
              lineHeight: 1.15,
              textTransform: 'uppercase',
            }}
          >
            AS NOSSAS
          </p>

          <div
            style={{
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'center',
              gap: '4px',
              marginTop: '8px',
            }}
          >
            <span
              style={{
                color: '#832c87',
                fontFamily: '"hwt-artz", "Ubuntu", sans-serif',
                fontWeight: 700,
                fontSize: 'clamp(44px, 9vw, 64px)',
                lineHeight: 0.95,
                textTransform: 'uppercase',
                letterSpacing: '-0.02em',
              }}
            >
              AVENTURAS?
            </span>
            
          </div>
        </div>
      </div>
    </div>
  );
}

export default RelembrarAventurasCard;
