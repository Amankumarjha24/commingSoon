'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import AdBanner from '@/components/AdBanner';
import styles from './page.module.css';

export default function WordCounterPage() {
  const [text, setText] = useState<string>('');

  const trimmed = text.trim();
  const words = trimmed ? trimmed.split(/\s+/).length : 0;
  const charsWithSpaces = text.length;
  const charsNoSpaces = text.replace(/\s+/g, '').length;
  const sentences = trimmed ? trimmed.split(/[.!?]+/).filter(Boolean).length : 0;
  const paragraphs = trimmed ? trimmed.split(/\n+/).filter(Boolean).length : 0;
  const readingTimeMin = Math.ceil(words / 200);
  const speakingTimeMin = Math.ceil(words / 130);

  return (
    <div className={styles.container}>
      {/* Breadcrumb */}
      <div className={styles.breadcrumb}>
        <Link href="/" className={styles.breadcrumbLink}>
          Home
        </Link>
        <span>/</span>
        <Link href="/#tools-section" className={styles.breadcrumbLink}>
          Dev & Text Tools
        </Link>
        <span>/</span>
        <span className={styles.breadcrumbActive}>Word Counter</span>
      </div>

      <div className={styles.headerContainer}>
        <h1 className={styles.title}>
          <span className={styles.iconWrapper}>
            📝
          </span>
          Live Word & Character Counter
        </h1>
        <p className={styles.subtitle}>
          Instant real-time word counting, character inspection, sentence analytics, and estimated reading time for writers and SEOs.
        </p>
      </div>

      {/* Stats Counter Bar */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={`${styles.statValue} ${styles.statValueOrange}`}>{words}</div>
          <div className={styles.statLabel}>Words</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statValue}>
            {charsWithSpaces}
          </div>
          <div className={styles.statLabel}>Characters</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statValue}>
            {sentences}
          </div>
          <div className={styles.statLabel}>Sentences</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statValue}>
            {paragraphs}
          </div>
          <div className={styles.statLabel}>Paragraphs</div>
        </div>
      </div>

      {/* Text Area Card */}
      <div className={styles.textAreaCard}>
        <div className={styles.textAreaHeader}>
          <span>Type or paste your text below:</span>
          <div className={styles.actionsContainer}>
            <button
              onClick={() => setText('')}
              className={`${styles.actionBtn} ${styles.actionBtnClear}`}
            >
              Clear
            </button>
            <button
              onClick={() => navigator.clipboard.writeText(text)}
              className={`${styles.actionBtn} ${styles.actionBtnCopy}`}
            >
              Copy
            </button>
          </div>
        </div>

        <textarea
          rows={12}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Start typing your essay, blog post, or article..."
          className={styles.textArea}
        />

        {/* Extra metrics */}
        <div className={styles.extraMetrics}>
          <div className={styles.metricsList}>
            <span>
              Characters (no spaces): <strong className={styles.metricValue}>{charsNoSpaces}</strong>
            </span>
            <span>•</span>
            <span>
              Reading Time: <strong className={styles.metricValue}>~{readingTimeMin} min</strong>
            </span>
            <span>•</span>
            <span>
              Speaking Time: <strong className={styles.metricValue}>~{speakingTimeMin} min</strong>
            </span>
          </div>
        </div>
      </div>

      <AdBanner format="horizontal" />
    </div>
  );
}
