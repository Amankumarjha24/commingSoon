'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import AdBanner from '@/components/AdBanner';
import styles from './page.module.css';

export default function MergePdfPage() {
  const [pdfFiles, setPdfFiles] = useState<File[]>([]);
  const [merging, setMerging] = useState(false);
  const [mergedBlobUrl, setMergedBlobUrl] = useState<string | null>(null);

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setPdfFiles((prev) => [...prev, ...Array.from(e.target.files!)]);
      setMergedBlobUrl(null);
    }
  };

  const removeFile = (index: number) => {
    setPdfFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const mergePdfs = async () => {
    if (pdfFiles.length < 2) {
      alert('Please select at least 2 PDF files to merge.');
      return;
    }
    setMerging(true);

    try {
      // Dynamic import of pdf-lib to ensure client-side execution
      const { PDFDocument } = await import('pdf-lib');
      const mergedPdf = await PDFDocument.create();

      for (const file of pdfFiles) {
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await PDFDocument.load(arrayBuffer);
        const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
        copiedPages.forEach((page) => mergedPdf.addPage(page));
      }

      const mergedPdfBytes = await mergedPdf.save();
      // Ensure proper ArrayBuffer blob creation
      const blob = new Blob([mergedPdfBytes.buffer as ArrayBuffer], { type: 'application/pdf' });
      setMergedBlobUrl(URL.createObjectURL(blob));
    } catch (err: any) {
      alert('Failed to merge PDFs. Make sure files are not password-protected.');
      console.error(err);
    } finally {
      setMerging(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.breadcrumb}>
        <Link href="/" className={styles.breadcrumbLink}>
          Home
        </Link>
        <span>/</span>
        <Link href="/#tools-section" className={styles.breadcrumbLink}>
          PDF Tools
        </Link>
        <span>/</span>
        <span className={styles.breadcrumbActive}>Merge PDF</span>
      </div>

      <div className={styles.headerContainer}>
        <h1 className={styles.title}>
          <span className={styles.iconWrapper}>
            📄
          </span>
          Merge PDF Documents Online
        </h1>
        <p className={styles.subtitle}>
          Combine multiple PDF files into a single document. 100% client-side — your confidential documents are never uploaded to any server.
        </p>
      </div>

      <div className={styles.card}>
        <div>
          <label className={styles.label}>
            Select PDF Files
          </label>
          <input
            type="file"
            accept="application/pdf"
            multiple
            onChange={handleFiles}
            className={styles.fileInput}
          />
        </div>

        {pdfFiles.length > 0 && (
          <div className={styles.filesContainer}>
            <div className={styles.filesTitle}>
              Files to merge ({pdfFiles.length}):
            </div>
            <div className={styles.filesList}>
              {pdfFiles.map((f, i) => (
                <div key={i} className={styles.fileItem}>
                  <div className={styles.fileItemLeft}>
                    <span className={styles.fileIndex}>#{i + 1}</span>
                    <span className={styles.fileName}>
                      {f.name}
                    </span>
                    <span className={styles.fileSize}>
                      ({Math.round(f.size / 1024)} KB)
                    </span>
                  </div>
                  <button
                    onClick={() => removeFile(i)}
                    className={styles.removeBtn}
                  >
                    ✕ Remove
                  </button>
                </div>
              ))}
            </div>

            <button
              onClick={mergePdfs}
              disabled={merging}
              className={styles.mergeBtn}
            >
              {merging ? 'Merging Pages Client-Side...' : `Merge ${pdfFiles.length} PDFs into One`}
            </button>
          </div>
        )}

        {mergedBlobUrl && (
          <div className={styles.successContainer}>
            <span className={styles.successTitle}>
              PDFs Merged Successfully!
            </span>
            <a
              href={mergedBlobUrl}
              download="merged-document.pdf"
              className={styles.downloadLink}
            >
              Download Merged PDF ↓
            </a>
          </div>
        )}
      </div>

      <AdBanner format="horizontal" />
    </div>
  );
}
