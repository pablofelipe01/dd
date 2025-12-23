import { readFileSync } from 'fs';
import path from 'path';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import MarkdownContent from '@/components/MarkdownContent';
import { generateTOC } from '@/lib/markdown';

export default function Home() {
  // Read the markdown file at build time
  const filePath = path.join(process.cwd(), 'src/data/informe.md');
  const markdownContent = readFileSync(filePath, 'utf-8');

  // Generate TOC from markdown
  const toc = generateTOC(markdownContent);

  return (
    <div className="min-h-screen bg-white">
      <Sidebar toc={toc} />
      <Header />

      <main className="lg:ml-72 pt-16">
        <div className="max-w-4xl mx-auto px-4 md:px-8 py-8 md:py-12">
          {/* Print-only header - visible only when printing */}
          <div className="hidden mb-8 pb-8 border-b-2 border-slate-300 print-header">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">
              Due Diligence
            </h1>
            <h2 className="text-xl text-slate-700 mb-4">
              Antier Solutions Private Limited
            </h2>
            <p className="text-sm text-slate-600">
              Investigacion tecnica exhaustiva
            </p>
            <div className="mt-4 text-sm text-slate-500">
              <p>Preparado para: Sylicon GP SAS</p>
              <p>Investigado por: Pablo Acebedo</p>
              <p>Fecha: 23 de diciembre de 2025</p>
            </div>
          </div>

          <MarkdownContent content={markdownContent} />

          {/* Footer */}
          <footer className="mt-16 pt-8 border-t border-slate-200 text-center text-sm text-slate-500 print:mt-8">
            <p>
              Este documento contiene hallazgos factuales verificables basados en fuentes publicas independientes.
            </p>
            <p className="mt-2">
              Investigacion realizada: Diciembre 2025
            </p>
          </footer>
        </div>
      </main>
    </div>
  );
}
