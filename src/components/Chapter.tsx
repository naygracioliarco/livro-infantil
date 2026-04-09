import { ReactNode } from 'react';

interface ChapterProps {
  id: string;
  number: number;
  title: string;
  content: ReactNode;
}

function Chapter({
  id,
  number,
  title,
  content,
}: ChapterProps) {
  return (
    <section id={id} className="mb-12 scroll-mt-4">
      <div className="border-l-[6px] border-[#00A99D] pl-6 mb-6">
        <p className="text-sm font-semibold text-slate-500 text-[#0E3B5D] tracking-wide mb-1">
          Capítulo {number}
        </p>
        <h2 className="text-4xl font-hwtArtz font-bold uppercase text-slate-800">{title}</h2>
      </div>
      <div className="text-slate-700 leading-relaxed text-justify chapter-content uppercase">
        {content}
      </div>
    </section>
  );
}

export default Chapter;
