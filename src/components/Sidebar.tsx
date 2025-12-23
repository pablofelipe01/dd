'use client';

import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import TableOfContents from './TableOfContents';
import { TOCItem } from '@/lib/markdown';

interface SidebarProps {
  toc: TOCItem[];
}

export default function Sidebar({ toc }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      setScrollProgress(Math.min(100, Math.max(0, progress)));
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close sidebar on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, []);

  // Prevent body scroll when sidebar is open on mobile
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return (
    <>
      {/* Mobile toggle button */}
      <button
        onClick={() => setIsOpen(true)}
        className="lg:hidden fixed bottom-4 right-4 z-40 bg-blue-900 text-white p-3 rounded-full shadow-lg hover:bg-blue-800 transition-colors print:hidden"
        aria-label="Open table of contents"
      >
        <Bars3Icon className="h-6 w-6" />
      </button>

      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40 print:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={clsx(
          'fixed top-0 left-0 h-full bg-white border-r border-slate-200 z-50 transition-transform duration-300 ease-in-out print:hidden',
          'w-72 lg:w-72',
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        {/* Progress bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-slate-100">
          <div
            className="h-full bg-blue-600 transition-all duration-150"
            style={{ width: `${scrollProgress}%` }}
          />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-200">
          <div>
            <h2 className="font-semibold text-slate-900 text-sm">Contenido</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {Math.round(scrollProgress)}% completado
            </p>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="lg:hidden p-1 text-slate-500 hover:text-slate-700"
            aria-label="Close table of contents"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>

        {/* TOC content */}
        <div className="overflow-y-auto h-[calc(100%-80px)] py-4">
          <TableOfContents items={toc} onItemClick={() => setIsOpen(false)} />
        </div>
      </aside>
    </>
  );
}
