'use client';

import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { PrinterIcon, DocumentArrowDownIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';

export default function Header() {
  const router = useRouter();

  const handlePrint = () => {
    window.print();
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
    router.refresh();
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-sm border-b border-slate-200 print:hidden">
      <div className="lg:ml-72 px-4 md:px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4 flex-1 min-w-0">
          <Image
            src="/logo.png"
            alt="Logo"
            width={120}
            height={40}
            className="h-8 w-auto hidden sm:block"
            priority
          />
          <div className="min-w-0">
            <h1 className="text-lg font-semibold text-slate-900 truncate">
              Due Diligence
            </h1>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            title="Imprimir informe"
          >
            <PrinterIcon className="h-4 w-4" />
            <span className="hidden sm:inline">Imprimir</span>
          </button>
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
            title="Exportar como PDF"
          >
            <DocumentArrowDownIcon className="h-4 w-4" />
            <span className="hidden sm:inline">PDF</span>
          </button>
          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
            title="Cerrar sesion"
          >
            <ArrowRightOnRectangleIcon className="h-4 w-4" />
            <span className="hidden sm:inline">Salir</span>
          </button>
        </div>
      </div>
    </header>
  );
}
