import { useCallback, useEffect, useRef, useState } from 'react';

const COLORS = [
  '#000000',
  '#e74c3c',
  '#3498db',
  '#2ecc71',
  '#f39c12',
  '#9b59b6',
  '#e67e22',
  '#1abc9c',
  '#34495e',
  '#f1c40f',
] as const;

const BRUSH_SIZES = [3, 6, 10, 15] as const;

const BRUSH_SIZE_CLASS: Record<(typeof BRUSH_SIZES)[number], string> = {
  3: 'h-5 w-5',
  6: 'h-[25px] w-[25px]',
  10: 'h-[30px] w-[30px]',
  15: 'h-[35px] w-[35px]',
};

type AreaDesenhoProps = {
  width?: number;
  height?: number;
  className?: string;
  storageKey?: string;
  hint?: string;
};

function getCanvasPosition(
  canvas: HTMLCanvasElement,
  clientX: number,
  clientY: number,
) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: (clientX - rect.left) * (canvas.width / rect.width),
    y: (clientY - rect.top) * (canvas.height / rect.height),
  };
}

function AreaDesenho({
  width = 600,
  height = 400,
  className = '',
  storageKey,
  hint = '✏️ Clique e arraste para desenhar',
}: AreaDesenhoProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDrawingRef = useRef(false);
  const [currentColor, setCurrentColor] = useState<string>(COLORS[0]);
  const [currentSize, setCurrentSize] = useState<(typeof BRUSH_SIZES)[number]>(3);
  const [isEraser, setIsEraser] = useState(false);

  const startStroke = useCallback(
    (ctx: CanvasRenderingContext2D) => {
      ctx.globalCompositeOperation = isEraser ? 'destination-out' : 'source-over';
      ctx.strokeStyle = isEraser ? 'rgba(0,0,0,1)' : currentColor;
      ctx.lineWidth = currentSize;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
    },
    [currentColor, currentSize, isEraser],
  );

  const handleClear = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (storageKey) {
      localStorage.removeItem(storageKey);
    }
  }, [storageKey]);

  const handleColorSelect = (color: string) => {
    setCurrentColor(color);
    setIsEraser(false);
  };

  const handlePointerDown = (
    clientX: number,
    clientY: number,
  ) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    isDrawingRef.current = true;
    const pos = getCanvasPosition(canvas, clientX, clientY);
    startStroke(ctx);
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
  };

  const handlePointerMove = (
    clientX: number,
    clientY: number,
  ) => {
    if (!isDrawingRef.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const pos = getCanvasPosition(canvas, clientX, clientY);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
  };

  const handlePointerUp = () => {
    if (!isDrawingRef.current) return;
    isDrawingRef.current = false;

    if (storageKey) {
      const canvas = canvasRef.current;
      if (canvas) {
        localStorage.setItem(storageKey, canvas.toDataURL());
      }
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !storageKey) return;

    const saved = localStorage.getItem(storageKey);
    if (!saved) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
    };
    img.src = saved;
  }, [storageKey]);

  return (
    <div className={`mx-auto my-5 max-w-[800px] select-none text-center ${className}`}>
      <div className="mb-4 rounded-[10px] border-2 border-[#e9ecef] bg-[#f8f9fa] p-4 md:p-[15px]">
        <div className="flex flex-col gap-4 md:flex-row md:flex-wrap md:items-start md:gap-5">
          <div className="text-left">
            <label className="mb-2 block text-sm font-bold text-[#333]">🎨 ESCOLHA A COR:</label>
            <div className="flex flex-wrap items-center gap-2">
              {COLORS.map((color) => (
                <button
                  key={color}
                  type="button"
                  title={color}
                  onClick={() => handleColorSelect(color)}
                  className={`h-[35px] w-[35px] rounded-full border-[3px] transition hover:scale-110 ${
                    !isEraser && currentColor === color
                      ? 'border-[#832c87] shadow-[0_0_10px_rgba(131,44,135,0.5)]'
                      : 'border-transparent'
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          <div className="text-left">
            <label className="mb-2 block text-sm font-bold text-[#333]">🖌️ TAMANHO:</label>
            <div className="flex flex-wrap items-center gap-2">
              {BRUSH_SIZES.map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => setCurrentSize(size)}
                  className={`cursor-pointer rounded-full bg-[#333] transition hover:scale-110 ${
                    BRUSH_SIZE_CLASS[size]
                  } ${
                    currentSize === size
                      ? 'border-2 border-[#832c87] shadow-[0_0_8px_rgba(131,44,135,0.5)]'
                      : 'border-2 border-transparent'
                  }`}
                  aria-label={`Tamanho ${size}`}
                />
              ))}
            </div>
          </div>

          <div className="text-left">
            <label className="mb-2 block text-sm font-bold text-[#333]">🔧 AÇÕES:</label>
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setIsEraser((v) => !v)}
                className={`rounded-[5px] px-3 py-2 text-sm text-white transition hover:-translate-y-0.5 ${
                  isEraser
                    ? 'bg-[#e67e22] shadow-[0_0_10px_rgba(230,126,34,0.5)]'
                    : 'bg-[#6c757d]'
                }`}
              >
                {isEraser ? '🧹 ATIVO' : '🧹 BORRACHA'}
              </button>
              <button
                type="button"
                onClick={handleClear}
                className="rounded-[5px] bg-[#dc3545] px-3 py-2 text-sm text-white transition hover:-translate-y-0.5"
              >
                🗑️ LIMPAR
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="relative inline-block rounded-[10px] border-[3px] border-dashed border-[#832c87] bg-white">
        <canvas
          ref={canvasRef}
          width={width}
          height={height}
          className={`block max-w-full rounded-[7px] touch-none ${
            isEraser ? 'cursor-grab' : 'cursor-crosshair'
          }`}
          style={{ maxWidth: '500px', width: '100%', height: 'auto' }}
          onMouseDown={(e) => handlePointerDown(e.clientX, e.clientY)}
          onMouseMove={(e) => handlePointerMove(e.clientX, e.clientY)}
          onMouseUp={handlePointerUp}
          onMouseLeave={handlePointerUp}
          onTouchStart={(e) => {
            e.preventDefault();
            const touch = e.touches[0];
            handlePointerDown(touch.clientX, touch.clientY);
          }}
          onTouchMove={(e) => {
            e.preventDefault();
            const touch = e.touches[0];
            handlePointerMove(touch.clientX, touch.clientY);
          }}
          onTouchEnd={(e) => {
            e.preventDefault();
            handlePointerUp();
          }}
        />
        <div className="pointer-events-none absolute left-2.5 top-2.5 rounded-[15px] bg-[#832c87]/10 px-2.5 py-1 text-xs font-bold text-[#832c87]">
          {hint}
        </div>
      </div>
    </div>
  );
}

export default AreaDesenho;
