'use client';

import React, { useEffect, useState } from 'react';
import clsx from 'clsx';
import { TOCItem } from '@/lib/markdown';

interface TableOfContentsProps {
  items: TOCItem[];
  onItemClick?: (id: string) => void;
}

function TOCItemComponent({
  item,
  activeId,
  depth = 0,
  onItemClick,
}: {
  item: TOCItem;
  activeId: string;
  depth?: number;
  onItemClick?: (id: string) => void;
}) {
  const isActive = activeId === item.id;
  const paddingLeft = depth * 12;

  return (
    <li>
      <a
        href={`#${item.id}`}
        onClick={(e) => {
          e.preventDefault();
          onItemClick?.(item.id);
          const element = document.getElementById(item.id);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
            window.history.pushState(null, '', `#${item.id}`);
          }
        }}
        className={clsx(
          'block py-1.5 text-sm transition-colors duration-150 border-l-2 hover:text-blue-900 hover:border-blue-500',
          isActive
            ? 'text-blue-900 border-blue-600 font-medium bg-blue-50'
            : 'text-slate-600 border-transparent',
          item.level === 1 && 'font-semibold',
          item.level === 2 && 'font-medium',
          item.level === 3 && 'font-normal text-slate-500'
        )}
        style={{ paddingLeft: `${paddingLeft + 12}px` }}
      >
        <span className="line-clamp-2">{item.title}</span>
      </a>
      {item.children.length > 0 && (
        <ul>
          {item.children.map((child) => (
            <TOCItemComponent
              key={child.id}
              item={child}
              activeId={activeId}
              depth={depth + 1}
              onItemClick={onItemClick}
            />
          ))}
        </ul>
      )}
    </li>
  );
}

export default function TableOfContents({ items, onItemClick }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      {
        rootMargin: '-80px 0% -80% 0%',
        threshold: 0,
      }
    );

    // Observe all headings
    const headings = document.querySelectorAll('h1[id], h2[id], h3[id]');
    headings.forEach((heading) => observer.observe(heading));

    return () => {
      headings.forEach((heading) => observer.unobserve(heading));
    };
  }, []);

  // Set initial active ID from URL hash
  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (hash) {
      setActiveId(hash);
    }
  }, []);

  return (
    <nav className="toc-nav" aria-label="Table of contents">
      <ul className="space-y-0.5">
        {items.map((item) => (
          <TOCItemComponent
            key={item.id}
            item={item}
            activeId={activeId}
            onItemClick={onItemClick}
          />
        ))}
      </ul>
    </nav>
  );
}
