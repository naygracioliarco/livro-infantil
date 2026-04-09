
interface PaginationProps {
  currentPage: number;
}

function Pagination({ currentPage }: PaginationProps) {
  return (
    <div
      data-page={currentPage}
      className="flex items-center justify-center -mx-8 md:-mx-12"
      style={{
        display: 'flex',
        width: '100vw',
        maxWidth: '100vw',
        padding: '4px 360px',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '10px',
        backgroundColor: '#b797c6',
        marginBottom: '40px',
        marginTop: '40px',
        position: 'relative',
        left: '50%',
        right: '50%',
        marginLeft: '-50vw',
        marginRight: '-50vw',
        fontFamily: 'Ubuntu',
      }}
    >
      <span>Página - {currentPage}</span>
      <img
                  src="/images/seta.svg"
                  alt="Union"
                  className="w-3 h-3 object-contain"
                />
    </div>
  );
}

export default Pagination;

