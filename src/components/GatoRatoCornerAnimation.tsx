/**
 * Decoração no canto da caixa “Gato e rato” — vídeo curto em loop (som desligado).
 */
function GatoRatoCornerAnimation() {
  return (
    <div
      className="gato-rato-corner pointer-events-none absolute bottom-2 right-2 z-10 md:bottom-3 md:right-3"
      aria-hidden
    >
      <video
        className="gato-rato-corner__video h-16 w-auto max-w-[min(180px,40vw)] select-none rounded-lg object-contain shadow-sm md:h-24 md:max-w-[min(220px,35vw)]"
        src="/images/video.mp4"
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
      />
    </div>
  );
}

export default GatoRatoCornerAnimation;
