'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import AdBanner from '@/components/AdBanner';
import styles from './page.module.css';
import { createWorker } from 'tesseract.js';
import {
  Search,
  UploadCloud,
  Copy,
  Download,
  Check,
  RotateCcw,
  Sparkles,
  FileText,
} from 'lucide-react';

export default function OcrTextExtractorPage() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [language, setLanguage] = useState<'eng' | 'hin' | 'eng+hin'>('eng');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [progressStatus, setProgressStatus] = useState<string>('');
  const [progressPct, setProgressPct] = useState<number>(0);
  const [extractedText, setExtractedText] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    setFile(selected);
    setExtractedText('');
    setProgressPct(0);
    setProgressStatus('');

    if (selected.type.startsWith('image/')) {
      setPreviewUrl(URL.createObjectURL(selected));
    } else {
      setPreviewUrl(null);
    }
  };

  const handleRunOcr = async () => {
    if (!file) return;
    setIsProcessing(true);
    setProgressPct(5);
    setProgressStatus('Initializing OCR AI Engine...');

    try {
      const worker = await createWorker(language, 1, {
        logger: (m) => {
          if (m.status === 'recognizing text') {
            setProgressStatus(`Extracting text... ${(m.progress * 100).toFixed(0)}%`);
            setProgressPct(Math.round(m.progress * 100));
          } else {
            setProgressStatus(`${m.status}...`);
          }
        },
      });

      const ret = await worker.recognize(file);
      setExtractedText(ret.data.text);
      setProgressStatus('OCR Extraction Complete!');
      setProgressPct(100);
      await worker.terminate();
    } catch (err: any) {
      console.error(err);
      setProgressStatus('Failed to extract text: ' + err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCopy = async () => {
    if (!extractedText) return;
    await navigator.clipboard.writeText(extractedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadTxt = () => {
    if (!extractedText) return;
    const blob = new Blob([extractedText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `extracted-ocr-text-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const wordCount = extractedText.trim() ? extractedText.trim().split(/\s+/).length : 0;
  const charCount = extractedText.length;

  return (
    <div className={styles.container}>
      {/* Breadcrumb */}
      <div className={styles.breadcrumb}>
        <Link href="/" className={styles.breadcrumbLink}>
          Home
        </Link>
        <span>/</span>
        <Link href="/?category=dev#tools-section" className={styles.breadcrumbLink}>
          Dev & OCR
        </Link>
        <span>/</span>
        <span className={styles.breadcrumbActive}>Image & PDF to Text (OCR)</span>
      </div>

      {/* Header */}
      <div className={styles.headerContainer}>
        <h1 className={styles.title}>
          <span className={styles.iconWrapper}>🔍</span>
          Image & PDF to Text (OCR)
        </h1>
        <p className={styles.subtitle}>
          Extract selectable, editable text from scanned documents, photos, and book pages with AI. Supports English & Hindi with 100% client-side privacy.
        </p>
      </div>

      <div className={styles.card}>
        {!file ? (
          <label className={styles.dropzone}>
            <input
              type="file"
              accept="image/*,.pdf"
              onChange={handleFileUpload}
              style={{ display: 'none' }}
            />
            <Search className={styles.dropIcon} />
            <div className={styles.dropText}>Upload Image or Scanned Document</div>
            <div className={styles.dropSub}>PNG, JPG, WebP, or Scanned Document (Zero Server Upload)</div>
          </label>
        ) : (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <strong>{file.name}</strong> ({(file.size / 1024).toFixed(1)} KB)
              </div>
              <button
                onClick={() => {
                  setFile(null);
                  setPreviewUrl(null);
                  setExtractedText('');
                }}
                style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontWeight: 600 }}
              >
                Change File
              </button>
            </div>

            {previewUrl && (
              <div style={{ marginTop: '1rem', textAlign: 'center' }}>
                <img
                  src={previewUrl}
                  alt="OCR preview"
                  style={{ maxHeight: '200px', maxWidth: '100%', borderRadius: '0.5rem', border: '1px solid #e2e8f0' }}
                />
              </div>
            )}

            {/* Language Selector */}
            <div className={styles.langSelector}>
              <span className={styles.langLabel}>Document Language:</span>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as any)}
                className={styles.langSelect}
              >
                <option value="eng">English (Standard)</option>
                <option value="hin">Hindi (हिन्दी)</option>
                <option value="eng+hin">Bilingual (English + Hindi)</option>
              </select>
            </div>

            <button
              onClick={handleRunOcr}
              disabled={isProcessing}
              style={{
                width: '100%',
                padding: '0.85rem',
                borderRadius: '0.75rem',
                backgroundColor: '#4f46e5',
                color: '#ffffff',
                fontWeight: 700,
                fontSize: '0.9375rem',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                boxShadow: '0 4px 10px rgba(79, 70, 229, 0.25)',
              }}
            >
              <Sparkles style={{ width: '1.1rem', height: '1.1rem' }} />
              <span>{isProcessing ? 'Processing AI OCR...' : 'Extract Text Now'}</span>
            </button>

            {/* Progress */}
            {isProcessing && (
              <div className={styles.progressContainer}>
                <div className={styles.progressStatus}>
                  <span>{progressStatus}</span>
                  <span>{progressPct}%</span>
                </div>
                <div className={styles.progressBar}>
                  <div className={styles.progressFill} style={{ width: `${progressPct}%` }} />
                </div>
              </div>
            )}

            {/* Extracted Text Result */}
            {extractedText && (
              <div className={styles.resultsSection}>
                <div className={styles.resultsHeader}>
                  <span className={styles.metaText}>
                    {wordCount} Words • {charCount} Characters
                  </span>
                  <div className={styles.actionsGroup}>
                    <button onClick={handleCopy} className={styles.toolBtn}>
                      {copied ? <Check style={{ width: '0.85rem' }} /> : <Copy style={{ width: '0.85rem' }} />}
                      <span>{copied ? 'Copied!' : 'Copy Text'}</span>
                    </button>
                    <button onClick={handleDownloadTxt} className={styles.toolBtn}>
                      <Download style={{ width: '0.85rem' }} />
                      <span>Download .TXT</span>
                    </button>
                  </div>
                </div>

                <textarea
                  value={extractedText}
                  onChange={(e) => setExtractedText(e.target.value)}
                  className={styles.textArea}
                  placeholder="Extracted text will appear here..."
                />
              </div>
            )}
          </div>
        )}
      </div>

      <AdBanner format="horizontal" />
    </div>
  );
}
