interface PaginationDuplaProps {
  firstPage: number;
  secondPage: number;
}

function PaginationDupla({ firstPage, secondPage }: PaginationDuplaProps) {
  return (
    <div
      className="flex items-center justify-center -mx-8 md:-mx-12 gap-4 px-4 py-1 md:gap-[10px] md:px-[360px]"
      style={{
        display: 'flex',
        width: '100vw',
        maxWidth: '100vw',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '10px',
        backgroundColor: '#b797c6',
        marginBottom: '20px',
        marginTop: '20px',
        position: 'relative',
        left: '50%',
        right: '50%',
        marginLeft: '-50vw',
        marginRight: '-50vw',
        fontFamily: 'Ubuntu',
      }}
    >
      <span data-page={firstPage} className="flex items-center gap-[10px] whitespace-nowrap">
        Página - {firstPage}
        <img src="/images/seta.svg" alt="Union" className="w-3 h-3 object-contain" />
      </span>
      <span data-page={secondPage} className="flex items-center gap-[10px] whitespace-nowrap">
        Página - {secondPage}
        <img src="/images/seta.svg" alt="Union" className="w-3 h-3 object-contain" />
      </span>
    </div>
  );
}

export default PaginationDupla;
