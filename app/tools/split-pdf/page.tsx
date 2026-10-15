'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import AdBanner from '@/components/AdBanner';
import styles from './page.module.css';
import { PDFDocument } from 'pdf-lib';
import JSZip from 'jszip';
import {
  Scissors,
  UploadCloud,
  FileCheck,
  Download,
  AlertCircle,
  FileText,
  Layers,
} from 'lucide-react';

export default function SplitPdfPage() {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState<number>(0);
  const [splitMode, setSplitMode] = useState<'range' | 'all' | 'interval'>('range');
  const [pageRange, setPageRange] = useState<string>('1-2');
  const [interval, setIntervalVal] = useState<number>(2);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    if (selected.type !== 'application/pdf' && !selected.name.endsWith('.pdf')) {
      setStatus({ type: 'error', message: 'Please select a valid PDF file.' });
      return;
    }

    try {
      setStatus(null);
      const buffer = await selected.arrayBuffer();
      const pdf = await PDFDocument.load(buffer);
      const count = pdf.getPageCount();

      setFile(selected);
      setPageCount(count);
      setPageRange(count > 1 ? `1-${Math.min(2, count)}` : '1');
    } catch (err) {
      console.error(err);
      setStatus({ type: 'error', message: 'Failed to read PDF. It might be corrupted or password protected.' });
    }
  };

  const parseRanges = (rangeStr: string, maxPages: number): number[] => {
    const pagesToExtract = new Set<number>();
    const parts = rangeStr.split(',');

    for (const part of parts) {
      const clean = part.trim();
      if (!clean) continue;

      if (clean.includes('-')) {
        const [startStr, endStr] = clean.split('-');
        const start = parseInt(startStr, 10);
        const end = parseInt(endStr, 10);
        if (!isNaN(start) && !isNaN(end)) {
          const from = Math.max(1, Math.min(start, end));
          const to = Math.min(maxPages, Math.max(start, end));
          for (let p = from; p <= to; p++) {
            pagesToExtract.add(p - 1); // 0-indexed
          }
        }
      } else {
        const page = parseInt(clean, 10);
        if (!isNaN(page) && page >= 1 && page <= maxPages) {
          pagesToExtract.add(page - 1); // 0-indexed
        }
      }
    }

    return Array.from(pagesToExtract).sort((a, b) => a - b);
  };

  const handleSplitPdf = async () => {
    if (!file || pageCount === 0) return;
    setIsProcessing(true);
    setStatus(null);

    try {
      const buffer = await file.arrayBuffer();
      const srcPdf = await PDFDocument.load(buffer);

      if (splitMode === 'range') {
        const pageIndices = parseRanges(pageRange, pageCount);
        if (pageIndices.length === 0) {
          setStatus({ type: 'error', message: `Please enter valid page numbers between 1 and ${pageCount}.` });
          setIsProcessing(false);
          return;
        }

        const newPdf = await PDFDocument.create();
        const copiedPages = await newPdf.copyPages(srcPdf, pageIndices);
        copiedPages.forEach((p) => newPdf.addPage(p));

        const pdfBytes = await newPdf.save();
        const blob = new Blob([pdfBytes as any], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${file.name.replace('.pdf', '')}-split.pdf`;
        a.click();
        URL.revokeObjectURL(url);

        setStatus({ type: 'success', message: `Successfully extracted ${pageIndices.length} page(s) into your new PDF!` });
      } else if (splitMode === 'all') {
        // Split every page into its own PDF and zip them
        const zip = new JSZip();

        for (let i = 0; i < pageCount; i++) {
          const singleDoc = await PDFDocument.create();
          const [copiedPage] = await singleDoc.copyPages(srcPdf, [i]);
          singleDoc.addPage(copiedPage);
          const singleBytes = await singleDoc.save();
          zip.file(`page-${i + 1}.pdf`, singleBytes);
        }

        const zipBlob = await zip.generateAsync({ type: 'blob' });
        const url = URL.createObjectURL(zipBlob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${file.name.replace('.pdf', '')}-all-pages.zip`;
        a.click();
        URL.revokeObjectURL(url);

        setStatus({ type: 'success', message: `All ${pageCount} pages split and downloaded in a single ZIP file!` });
      } else if (splitMode === 'interval') {
        const zip = new JSZip();
        const step = Math.max(1, interval);
        let partIndex = 1;

        for (let i = 0; i < pageCount; i += step) {
          const partDoc = await PDFDocument.create();
          const indices: number[] = [];
          for (let j = i; j < Math.min(i + step, pageCount); j++) {
            indices.push(j);
          }
          const copiedPages = await partDoc.copyPages(srcPdf, indices);
          copiedPages.forEach((p) => partDoc.addPage(p));
          const partBytes = await partDoc.save();
          zip.file(`part-${partIndex}-pages-${i + 1}-to-${Math.min(i + step, pageCount)}.pdf`, partBytes);
          partIndex++;
        }

        const zipBlob = await zip.generateAsync({ type: 'blob' });
        const url = URL.createObjectURL(zipBlob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${file.name.replace('.pdf', '')}-interval-split.zip`;
        a.click();
        URL.revokeObjectURL(url);

        setStatus({ type: 'success', message: `Split into ${partIndex - 1} parts and downloaded in ZIP!` });
      }
    } catch (err: any) {
      console.error(err);
      setStatus({ type: 'error', message: err.message || 'Error occurred while splitting the PDF.' });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className={styles.container}>
      {/* Breadcrumb */}
      <div className={styles.breadcrumb}>
        <Link href="/" className={styles.breadcrumbLink}>
          Home
        </Link>
        <span>/</span>
        <Link href="/?category=pdf#tools-section" className={styles.breadcrumbLink}>
          PDF Tools
        </Link>
        <span>/</span>
        <span className={styles.breadcrumbActive}>PDF Splitter Pro</span>
      </div>

      {/* Header */}
      <div className={styles.headerContainer}>
        <h1 className={styles.title}>
          <span className={styles.iconWrapper}>✂️</span>
          PDF Splitter Pro
        </h1>
        <p className={styles.subtitle}>
          Extract custom page ranges, split every page individually, or divide documents by chapter intervals with zero cloud upload.
        </p>
      </div>

      <div className={styles.card}>
        {!file ? (
          <label className={styles.dropzone}>
            <input
              type="file"
              accept=".pdf,application/pdf"
              onChange={handleFileChange}
              style={{ display: 'none' }}
            />
            <Scissors className={styles.dropIcon} />
            <div className={styles.dropText}>Choose a PDF File to Split</div>
            <div className={styles.dropSub}>or drag and drop your document here (100% Client-Side)</div>
          </label>
        ) : (
          <div>
            <div className={styles.fileInfoCard}>
              <div className={styles.fileLeft}>
                <span className={styles.pdfBadge}>PDF</span>
                <div>
                  <div className={styles.fileName}>{file.name}</div>
                  <div className={styles.fileMeta}>
                    {(file.size / (1024 * 1024)).toFixed(2)} MB • {pageCount} Total Pages
                  </div>
                </div>
              </div>
              <button onClick={() => setFile(null)} className={styles.removeBtn}>
                Change File
              </button>
            </div>

            {/* Split Mode Selector */}
            <div className={styles.modeSelector}>
              <button
                type="button"
                onClick={() => setSplitMode('range')}
                className={`${styles.modeBtn} ${splitMode === 'range' ? styles.modeBtnActive : ''}`}
              >
                Custom Range (e.g. 1-3, 5)
              </button>
              <button
                type="button"
                onClick={() => setSplitMode('all')}
                className={`${styles.modeBtn} ${splitMode === 'all' ? styles.modeBtnActive : ''}`}
              >
                Split Every Single Page (ZIP)
              </button>
              <button
                type="button"
                onClick={() => setSplitMode('interval')}
                className={`${styles.modeBtn} ${splitMode === 'interval' ? styles.modeBtnActive : ''}`}
              >
                Split by Interval (Every N Pages)
              </button>
            </div>

            {/* Mode Details */}
            {splitMode === 'range' && (
              <div className={styles.optionsBox}>
                <label className={styles.label}>Enter Pages or Ranges to Extract</label>
                <input
                  type="text"
                  value={pageRange}
                  onChange={(e) => setPageRange(e.target.value)}
                  placeholder={`e.g. 1-3, 5, 8-${Math.min(10, pageCount)}`}
                  className={styles.input}
                />
                <div className={styles.hint}>
                  Total pages available: <strong>1 to {pageCount}</strong>. Example: "1, 3-5, {pageCount}" extracts only those specific pages.
                </div>
              </div>
            )}

            {splitMode === 'all' && (
              <div className={styles.optionsBox}>
                <div className={styles.hint}>
                  Every single page of <strong>{file.name}</strong> ({pageCount} pages) will be extracted into a separate 1-page PDF document and packaged into a ZIP archive.
                </div>
              </div>
            )}

            {splitMode === 'interval' && (
              <div className={styles.optionsBox}>
                <label className={styles.label}>Pages per Document</label>
                <input
                  type="number"
                  min={1}
                  max={pageCount}
                  value={interval}
                  onChange={(e) => setIntervalVal(parseInt(e.target.value, 10) || 1)}
                  className={styles.input}
                />
                <div className={styles.hint}>
                  Will generate approximately {Math.ceil(pageCount / Math.max(1, interval))} separate PDF files.
                </div>
              </div>
            )}

            <button
              onClick={handleSplitPdf}
              disabled={isProcessing}
              className={styles.actionBtn}
            >
              <Download style={{ width: '1.2rem', height: '1.2rem' }} />
              <span>{isProcessing ? 'Processing PDF Client-Side...' : 'Split & Download PDF'}</span>
            </button>

            {status && (
              <div
                className={`${styles.statusMessage} ${
                  status.type === 'success' ? styles.statusSuccess : styles.statusError
                }`}
              >
                {status.message}
              </div>
            )}
          </div>
        )}
      </div>

      <AdBanner format="horizontal" />
    </div>
  );
}
