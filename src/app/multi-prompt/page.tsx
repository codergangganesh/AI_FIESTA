'use client';

import { useState } from 'react';
import Link from 'next/link';

const SAMPLE_PROMPTS = [
  'Summarize the latest AI research trends in 5 bullets.',
  'Explain quantum computing to a 10-year-old.',
  'Write a SQL query to find top 5 customers by revenue.',
  'Generate unit tests for a function that parses dates.',
  'Compare React Server Components vs Client Components.',
  'Draft a professional email to request a meeting.'
];

export default function MultiPromptPage() {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleCopy = async (text: string, index: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 1500);
    } catch (e) {
      console.error('Copy failed', e);
    }
  };

  const handleShare = async (text: string) => {
    const data = { title: 'AI Fiesta Prompt', text, url: window.location.href };
    if (navigator.share) {
      try { await navigator.share(data); } catch (e) { console.error(e); }
    } else {
      await navigator.clipboard.writeText(text);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Multi-Prompt</h1>
          <Link href="/" className="text-sm text-blue-600 dark:text-blue-400 hover:underline">Back to Compare</Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {SAMPLE_PROMPTS.map((p, i) => (
            <div key={i} className="group rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800 p-4 shadow-sm hover:shadow-md transition-shadow">
              <div className="text-gray-900 dark:text-gray-100 text-sm leading-relaxed min-h-[64px]">
                {p}
              </div>
              <div className="mt-3 flex items-center justify-end gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => handleCopy(p, i)}
                  className="p-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  title="Copy"
                >
                  {copiedIndex === i ? (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/></svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/></svg>
                  )}
                </button>
                <button
                  onClick={() => handleShare(p)}
                  className="p-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  title="Share"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 12v7a1 1 0 001 1h14a1 1 0 001-1v-7M16 6l-4-4m0 0L8 6m4-4v12"/></svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}


