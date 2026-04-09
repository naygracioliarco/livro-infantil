import { useEffect, useState, type DragEvent } from 'react';

const bolaDeMeiaItems = [
  { id: 'pag_img1', src: '/images/pag6_img1.png' },
  { id: 'pag_img2', src: '/images/pag6_img2.png' },
  { id: 'pag_img3', src: '/images/pag6_img3.png' },
  { id: 'pag_img4', src: '/images/pag6_img4.png' },
  { id: 'pag_img5', src: '/images/pag6_img5.png' },
  { id: 'pag_img6', src: '/images/pag6_img6.png' },
] as const;

type BolaDeMeiaItemId = (typeof bolaDeMeiaItems)[number]['id'];
type BolaDropZoneId = 'material_1' | 'material_2' | 'passo_1' | 'passo_2' | 'passo_3' | 'passo_4';

const bolaDeMeiaCorreta: Record<BolaDropZoneId, BolaDeMeiaItemId> = {
  material_1: 'pag_img1',
  material_2: 'pag_img2',
  passo_1: 'pag_img3',
  passo_2: 'pag_img4',
  passo_3: 'pag_img5',
  passo_4: 'pag_img6',
};

const BOLA_DE_MEIA_STORAGE_KEY = 'livro:bola-de-meia:drop-map';

const validZones: BolaDropZoneId[] = ['material_1', 'material_2', 'passo_1', 'passo_2', 'passo_3', 'passo_4'];
const validItems: BolaDeMeiaItemId[] = ['pag_img1', 'pag_img2', 'pag_img3', 'pag_img4', 'pag_img5', 'pag_img6'];

function BolaDeMeiaQuestion() {
  const [bolaDropMap, setBolaDropMap] = useState<Partial<Record<BolaDropZoneId, BolaDeMeiaItemId>>>({});

  useEffect(() => {
    try {
      const raw = localStorage.getItem(BOLA_DE_MEIA_STORAGE_KEY);
      if (!raw) {
        return;
      }

      const parsed = JSON.parse(raw) as Record<string, string>;
      const restored: Partial<Record<BolaDropZoneId, BolaDeMeiaItemId>> = {};

      validZones.forEach((zoneId) => {
        const value = parsed[zoneId];
        if (value && validItems.includes(value as BolaDeMeiaItemId)) {
          restored[zoneId] = value as BolaDeMeiaItemId;
        }
      });

      setBolaDropMap(restored);
    } catch {
      localStorage.removeItem(BOLA_DE_MEIA_STORAGE_KEY);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(BOLA_DE_MEIA_STORAGE_KEY, JSON.stringify(bolaDropMap));
  }, [bolaDropMap]);

  const usedBolaItems = new Set(Object.values(bolaDropMap));
  const availableBolaItems = bolaDeMeiaItems.filter((item) => !usedBolaItems.has(item.id));

  const handleBolaDragStart = (event: DragEvent<HTMLImageElement>, itemId: BolaDeMeiaItemId) => {
    event.dataTransfer.setData('text/plain', itemId);
  };

  const handleBolaDrop = (event: DragEvent<HTMLDivElement>, zoneId: BolaDropZoneId) => {
    event.preventDefault();
    const itemId = event.dataTransfer.getData('text/plain') as BolaDeMeiaItemId;

    if (!bolaDeMeiaItems.some((item) => item.id === itemId)) {
      return;
    }

    setBolaDropMap((prev) => {
      const updated: Partial<Record<BolaDropZoneId, BolaDeMeiaItemId>> = { ...prev };

      (Object.keys(updated) as BolaDropZoneId[]).forEach((key) => {
        if (updated[key] === itemId) {
          delete updated[key];
        }
      });

      updated[zoneId] = itemId;
      return updated;
    });
  };

  const handleBolaRemoveFromZone = (zoneId: BolaDropZoneId) => {
    setBolaDropMap((prev) => {
      const updated: Partial<Record<BolaDropZoneId, BolaDeMeiaItemId>> = { ...prev };
      delete updated[zoneId];
      return updated;
    });
  };

  const getBolaDropBorderClass = (zoneId: BolaDropZoneId) => {
    const itemId = bolaDropMap[zoneId];
    if (!itemId) {
      return 'border-[#B8B8B8]';
    }
    // return bolaDeMeiaCorreta[zoneId] === itemId ? 'border-[#16A34A]' : 'border-[#DC2626]';
  };

  return (
    <>
      <p className="mb-4 indent-6">
        MATERIAIS:
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {(['material_1', 'material_2'] as BolaDropZoneId[]).map((zoneId) => {
          const droppedId = bolaDropMap[zoneId];
          const droppedItem = bolaDeMeiaItems.find((item) => item.id === droppedId);

          return (
            <div
              key={zoneId}
              onDragOver={(event) => event.preventDefault()}
              onDrop={(event) => handleBolaDrop(event, zoneId)}
              className={`h-36 rounded-3xl border-2 ${getBolaDropBorderClass(zoneId)} bg-[#F3F3F3] flex items-center justify-center p-2`}
            >
              {droppedItem ? (
                <img
                  src={droppedItem.src}
                  alt={droppedItem.id}
                  className="h-full object-contain cursor-pointer"
                  onClick={() => handleBolaRemoveFromZone(zoneId)}
                  title="Clique para remover"
                />
              ) : (
                <span className="text-sm text-[#808080]">Arraste aqui</span>
              )}
            </div>
          );
        })}
      </div>
      <p className="mb-4 indent-6">
        COMO FAZER:
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {(['passo_1', 'passo_2', 'passo_3', 'passo_4'] as BolaDropZoneId[]).map((zoneId, index) => {
          const droppedId = bolaDropMap[zoneId];
          const droppedItem = bolaDeMeiaItems.find((item) => item.id === droppedId);

          return (
            <div key={zoneId} className="relative">
              <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-[#f6b221] text-white font-bold flex items-center justify-center z-10">
                {index + 1}
              </div>
              <div
                onDragOver={(event) => event.preventDefault()}
                onDrop={(event) => handleBolaDrop(event, zoneId)}
                className={`h-44 rounded-2xl border-2 ${getBolaDropBorderClass(zoneId)} bg-[#F3F3F3] flex items-center justify-center p-2`}
              >
                {droppedItem ? (
                  <img
                    src={droppedItem.src}
                    alt={droppedItem.id}
                    className="h-full object-contain cursor-pointer"
                    onClick={() => handleBolaRemoveFromZone(zoneId)}
                    title="Clique para remover"
                  />
                ) : (
                  <span className="text-sm text-[#808080]">Arraste aqui</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
      <div className="mb-2">
        <p className="mb-3 font-semibold text-[#832c87]">Imagens para arrastar</p>
        <div className="flex flex-wrap gap-3">
          {availableBolaItems.map((item) => (
            <img
              key={item.id}
              src={item.src}
              alt={item.id}
              draggable
              onDragStart={(event) => handleBolaDragStart(event, item.id)}
              className="w-24 h-24 object-contain border border-[#D1D5DB] rounded-xl bg-white p-1 cursor-grab active:cursor-grabbing"
            />
          ))}
        </div>
      </div>
      <button
        type="button"
        className="mt-4 px-4 py-2 rounded-lg bg-[#832c87] text-white text-sm font-medium"
        onClick={() => {
          setBolaDropMap({});
          localStorage.removeItem(BOLA_DE_MEIA_STORAGE_KEY);
        }}
      >
        Reiniciar atividade
      </button>
    </>
  );
}

export default BolaDeMeiaQuestion;
