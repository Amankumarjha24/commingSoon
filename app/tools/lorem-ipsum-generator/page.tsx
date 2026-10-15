'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { FileText, Copy, CheckCircle, RefreshCw, Download } from 'lucide-react';
import AdBanner from '@/components/AdBanner';
import styles from './page.module.css';

const LOREM_WORDS = [
  'lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit', 'sed', 'do',
  'eiusmod', 'tempor', 'incididunt', 'ut', 'labore', 'et', 'dolore', 'magna', 'aliqua', 'enim',
  'ad', 'minim', 'veniam', 'quis', 'nostrud', 'exercitation', 'ullamco', 'laboris', 'nisi', 'aliquip',
  'ex', 'ea', 'commodo', 'consequat', 'duis', 'aute', 'irure', 'in', 'reprehenderit', 'voluptate',
  'velit', 'esse', 'cillum', 'fugiat', 'nulla', 'pariatur', 'excepteur', 'sint', 'occaecat', 'cupidatat',
  'non', 'proident', 'sunt', 'culpa', 'qui', 'officia', 'deserunt', 'mollit', 'anim', 'id', 'est', 'laborum'
];

export default function LoremIpsumGeneratorPage() {
  const [type, setType] = useState<'paragraphs' | 'sentences' | 'words'>('paragraphs');
  const [count, setCount] = useState<number>(3);
  const [startWithLorem, setStartWithLorem] = useState<boolean>(true);
  const [htmlTags, setHtmlTags] = useState<boolean>(false);
  const [generatedText, setGeneratedText] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);

  const generateSentence = () => {
    const len = Math.floor(Math.random() * 10) + 8;
    const words: string[] = [];
    for (let i = 0; i < len; i++) {
      words.push(LOREM_WORDS[Math.floor(Math.random() * LOREM_WORDS.length)]);
    }
    const sentence = words.join(' ');
    return sentence.charAt(0).toUpperCase() + sentence.slice(1) + '.';
  };

  const generateParagraph = (isFirst: boolean) => {
    const numSentences = Math.floor(Math.random() * 4) + 4;
    const sentences: string[] = [];
    if (isFirst && startWithLorem) {
      sentences.push('Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.');
    }
    for (let i = sentences.length; i < numSentences; i++) {
      sentences.push(generateSentence());
    }
    return sentences.join(' ');
  };

  const generate = () => {
    let result = '';
    if (type === 'paragraphs') {
      const paras: string[] = [];
      for (let i = 0; i < count; i++) {
        const p = generateParagraph(i === 0);
        paras.push(htmlTags ? `<p>${p}</p>` : p);
      }
      result = paras.join('\n\n');
    } else if (type === 'sentences') {
      const sentences: string[] = [];
      for (let i = 0; i < count; i++) {
        sentences.push(generateSentence());
      }
      result = sentences.join(' ');
    } else {
      // Words
      const words: string[] = [];
      if (startWithLorem) {
        words.push('Lorem', 'ipsum', 'dolor', 'sit', 'amet');
      }
      for (let i = words.length; i < count; i++) {
        words.push(LOREM_WORDS[Math.floor(Math.random() * LOREM_WORDS.length)]);
      }
      result = words.slice(0, count).join(' ');
    }
    setGeneratedText(result);
  };

  useEffect(() => {
    generate();
  }, [type, count, startWithLorem, htmlTags]);

  const copyText = () => {
    navigator.clipboard.writeText(generatedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadTxt = () => {
    const blob = new Blob([generatedText], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'lorem-ipsum.txt';
    link.click();
  };

  return (
    <div className={styles.container}>
      <div className={styles.breadcrumb}>
        <Link href="/" className={styles.breadcrumbLink}>Home</Link>
        <span>/</span>
        <Link href="/?category=dev#tools-section" className={styles.breadcrumbLink}>Dev & Text</Link>
        <span>/</span>
        <span className={styles.breadcrumbActive}>Lorem Ipsum Generator</span>
      </div>

      <div className={styles.headerContainer}>
        <h1 className={styles.title}>
          <span className={styles.iconWrapper}>📜</span>
          Lorem Ipsum Dummy Text Generator
        </h1>
        <p className={styles.subtitle}>
          Generate placeholder text for websites, design mockups, and typography previews.
        </p>
      </div>

      <div className={styles.card}>
        <div className={styles.controlsGrid}>
          <div className={styles.controlBox}>
            <label className={styles.label}>Generation Unit</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as any)}
              className={styles.select}
            >
              <option value="paragraphs">Paragraphs</option>
              <option value="sentences">Sentences</option>
              <option value="words">Words</option>
            </select>
          </div>

          <div className={styles.controlBox}>
            <label className={styles.label}>Count ({type})</label>
            <input
              type="number"
              min="1"
              max={type === 'words' ? 500 : 20}
              value={count}
              onChange={(e) => setCount(Math.max(1, Number(e.target.value)))}
              className={styles.numberInput}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', justifyContent: 'center' }}>
            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={startWithLorem}
                onChange={(e) => setStartWithLorem(e.target.checked)}
              />
              <span>Start with &quot;Lorem ipsum...&quot;</span>
            </label>
            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={htmlTags}
                onChange={(e) => setHtmlTags(e.target.checked)}
              />
              <span>Wrap in &lt;p&gt; HTML tags</span>
            </label>
          </div>
        </div>

        <textarea
          readOnly
          value={generatedText}
          className={styles.outputArea}
        />

        <div className={styles.actionsRow}>
          <div className={styles.statsText}>
            {generatedText.trim().split(/\s+/).filter(Boolean).length} words • {generatedText.length} characters
          </div>

          <div className={styles.btnGroup}>
            <button onClick={generate} className={`${styles.btn} ${styles.copyBtn}`}>
              <RefreshCw style={{ width: '0.9rem', height: '0.9rem' }} />
              <span>Regenerate</span>
            </button>
            <button onClick={copyText} className={`${styles.btn} ${styles.copyBtn}`}>
              {copied ? <CheckCircle style={{ width: '1rem', height: '1rem', color: '#16a34a' }} /> : <Copy style={{ width: '1rem', height: '1rem' }} />}
              <span>{copied ? 'Copied!' : 'Copy'}</span>
            </button>
            <button onClick={downloadTxt} className={`${styles.btn} ${styles.generateBtn}`}>
              <Download style={{ width: '1rem', height: '1rem' }} />
              <span>Download .txt</span>
            </button>
          </div>
        </div>
      </div>

      <AdBanner format="horizontal" />
    </div>
  );
}
