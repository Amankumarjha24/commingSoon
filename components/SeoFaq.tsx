"use client";

import React, { useState } from "react";

export interface FaqItem {
  question: string;
  answer: string;
}

interface SeoFaqProps {
  items: FaqItem[];
  title?: string;
}

export default function SeoFaq({ items, title = "Frequently Asked Questions" }: SeoFaqProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  // Generate Google Schema.org FAQPage structured data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <section className="w-full my-12" aria-labelledby="faq-heading">
      {/* Schema.org FAQPage JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h2 id="faq-heading" className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            {title}
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1.5">
            Everything you need to know about this tool, privacy, and limits.
          </p>
        </div>

        <div className="space-y-3">
          {items.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900/60 transition-all overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full text-left px-5 py-4 flex items-center justify-between gap-4 font-semibold text-slate-800 dark:text-slate-100 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  <span className="text-sm sm:text-base leading-snug">{faq.question}</span>
                  <span className={`p-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 transition-transform duration-200 shrink-0 ${isOpen ? "rotate-180" : ""}`}>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </span>
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-sm text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800/60 pt-3">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
