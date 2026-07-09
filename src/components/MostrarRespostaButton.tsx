interface MostrarRespostaButtonProps {
  showing: boolean;
  onClick: () => void;
  className?: string;
  showLabel?: string;
  hideLabel?: string;
}

function MostrarRespostaButton({
  showing,
  onClick,
  className = '',
  showLabel = 'Mostrar a resposta',
  hideLabel = 'Voltar à imagem original',
}: MostrarRespostaButtonProps) {
  return (
    <button
      type="button"
      className={`professor-button mostrar-resposta-button my-5 rounded-lg border-2 border-[#832c87] bg-white px-5 py-2.5 text-sm font-medium text-[#832c87] transition hover:bg-[#faf8fc] ${className}`}
      onClick={onClick}
    >
      {showing ? hideLabel : showLabel}
    </button>
  );
}

export default MostrarRespostaButton;
