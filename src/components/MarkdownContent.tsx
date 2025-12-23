'use client';

import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';
import { slugify } from '@/lib/markdown';
import type { Components } from 'react-markdown';

interface MarkdownContentProps {
  content: string;
}

export default function MarkdownContent({ content }: MarkdownContentProps) {
  const components: Components = {
    h1: ({ children }) => {
      const text = extractText(children);
      const id = slugify(text);
      return (
        <h1
          id={id}
          className="text-3xl md:text-4xl font-bold text-slate-900 mb-6 mt-12 first:mt-0 pb-4 border-b border-slate-200 scroll-mt-20"
        >
          {children}
        </h1>
      );
    },
    h2: ({ children }) => {
      const text = extractText(children);
      const id = slugify(text);
      return (
        <h2
          id={id}
          className="text-2xl md:text-3xl font-semibold text-slate-800 mb-4 mt-10 scroll-mt-20"
        >
          {children}
        </h2>
      );
    },
    h3: ({ children }) => {
      const text = extractText(children);
      const id = slugify(text);
      return (
        <h3
          id={id}
          className="text-xl md:text-2xl font-semibold text-slate-700 mb-3 mt-8 scroll-mt-20"
        >
          {children}
        </h3>
      );
    },
    h4: ({ children }) => {
      const text = extractText(children);
      const id = slugify(text);
      return (
        <h4
          id={id}
          className="text-lg md:text-xl font-semibold text-slate-700 mb-2 mt-6 scroll-mt-20"
        >
          {children}
        </h4>
      );
    },
    p: ({ children }) => {
      // Check for special patterns that should be rendered as alerts
      const text = extractText(children);

      if (text.startsWith('**Hallazgo Crítico:**') || text.startsWith('**Hallazgo de Investigación Exhaustiva:**')) {
        return (
          <div className="my-6 rounded-lg border-l-4 p-4 bg-red-50 border-red-500">
            <div className="text-sm text-red-800">{children}</div>
          </div>
        );
      }

      if (text.startsWith('**Status de Verificación:**')) {
        return (
          <div className="my-4 rounded-lg border-l-4 p-3 bg-blue-50 border-blue-500">
            <div className="text-sm text-blue-800">{children}</div>
          </div>
        );
      }

      if (text.startsWith('**Conclusión:**') || text.startsWith('**Evaluación Final:**')) {
        return (
          <div className="my-4 rounded-lg border-l-4 p-4 bg-amber-50 border-amber-500">
            <div className="text-sm text-amber-800">{children}</div>
          </div>
        );
      }

      return (
        <p className="text-slate-700 leading-relaxed mb-4">
          {children}
        </p>
      );
    },
    table: ({ children }) => (
      <div className="my-6 overflow-x-auto rounded-lg border border-slate-200">
        <table className="min-w-full divide-y divide-slate-200">
          {children}
        </table>
      </div>
    ),
    thead: ({ children }) => (
      <thead className="bg-slate-100">{children}</thead>
    ),
    tbody: ({ children }) => (
      <tbody className="divide-y divide-slate-200 bg-white">{children}</tbody>
    ),
    tr: ({ children }) => (
      <tr className="hover:bg-slate-50 transition-colors">{children}</tr>
    ),
    th: ({ children }) => (
      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
        {children}
      </th>
    ),
    td: ({ children }) => (
      <td className="px-4 py-3 text-sm text-slate-700 whitespace-normal">
        {children}
      </td>
    ),
    blockquote: ({ children }) => (
      <blockquote className="my-6 border-l-4 border-slate-300 bg-slate-50 pl-4 py-3 pr-4 italic text-slate-600">
        {children}
      </blockquote>
    ),
    ul: ({ children }) => (
      <ul className="my-4 ml-6 list-disc space-y-2 text-slate-700">
        {children}
      </ul>
    ),
    ol: ({ children }) => (
      <ol className="my-4 ml-6 list-decimal space-y-2 text-slate-700">
        {children}
      </ol>
    ),
    li: ({ children }) => (
      <li className="leading-relaxed">{children}</li>
    ),
    a: ({ href, children }) => (
      <a
        href={href}
        className="text-blue-600 hover:text-blue-800 underline underline-offset-2"
        target={href?.startsWith('#') ? undefined : '_blank'}
        rel={href?.startsWith('#') ? undefined : 'noopener noreferrer'}
      >
        {children}
      </a>
    ),
    strong: ({ children }) => (
      <strong className="font-semibold text-slate-900">{children}</strong>
    ),
    em: ({ children }) => (
      <em className="italic">{children}</em>
    ),
    hr: () => (
      <hr className="my-8 border-t-2 border-slate-200" />
    ),
    code: ({ className, children }) => {
      const isInline = !className;
      if (isInline) {
        return (
          <code className="px-1.5 py-0.5 bg-slate-100 text-slate-800 text-sm rounded font-mono">
            {children}
          </code>
        );
      }
      return (
        <code className={className}>
          {children}
        </code>
      );
    },
    pre: ({ children }) => (
      <pre className="my-6 overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm text-slate-100">
        {children}
      </pre>
    ),
  };

  return (
    <article className="prose prose-slate max-w-none">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw, rehypeSanitize]}
        components={components}
      >
        {content}
      </ReactMarkdown>
    </article>
  );
}

// Helper function to extract text from React children
function extractText(children: React.ReactNode): string {
  if (typeof children === 'string') return children;
  if (typeof children === 'number') return String(children);
  if (Array.isArray(children)) {
    return children.map(extractText).join('');
  }
  if (React.isValidElement(children)) {
    const props = children.props as { children?: React.ReactNode };
    if (props.children) {
      return extractText(props.children);
    }
  }
  return '';
}
