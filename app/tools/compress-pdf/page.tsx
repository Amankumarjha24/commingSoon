'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import AdBanner from '@/components/AdBanner';
import styles from './page.module.css';

export default function CompressPdfPage() {
  const [file, setFile] = useState<File | null>(null);
  const [compressing, setCompressing] = useState<boolean>(false);
  const [compressedUrl, setCompressedUrl] = useState<string | null>(null);
  const [origSize, setOrigSize] = useState<number>(0);
  const [newSize, setNewSize] = useState<number>(0);

  const handleCompress = async () => {
    if (!file) return;
    setCompressing(true);

    try {
      const { PDFDocument } = await import('pdf-lib');
      const arrayBuffer = await file.arrayBuffer();
      // Load and re-save with objects stream optimization
      const pdf = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
      const savedBytes = await pdf.save({ useObjectStreams: true });

      const blob = new Blob([savedBytes.buffer as ArrayBuffer], { type: 'application/pdf' });
      setCompressedUrl(URL.createObjectURL(blob));
      setNewSize(Math.round(blob.size / 1024));
    } catch (err) {
      alert('Could not compress this PDF. File may be encrypted or already optimized.');
    } finally {
      setCompressing(false);
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
        <span className={styles.breadcrumbActive}>Compress PDF</span>
      </div>

      <div className={styles.headerContainer}>
        <h1 className={styles.title}>
          <span className={styles.iconWrapper}>
            🗜️
          </span>
          Compress PDF File Size
        </h1>
        <p className={styles.subtitle}>
          Optimize and reduce PDF document size with object streams compression. Private, client-side, zero cloud uploads.
        </p>
      </div>

      <div className={styles.card}>
        <div>
          <label className={styles.label}>
            Select PDF Document
          </label>
          <input
            type="file"
            accept="application/pdf"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) {
                setFile(f);
                setOrigSize(Math.round(f.size / 1024));
                setCompressedUrl(null);
              }
            }}
            className={styles.fileInput}
          />
        </div>

        {file && (
          <div className={styles.fileInfoContainer}>
            <div className={styles.fileInfo}>
              <span className={styles.fileName}>
                {file.name}
              </span>
              <span className={styles.fileSize}>Original Size: {origSize} KB</span>
            </div>

            <button
              onClick={handleCompress}
              disabled={compressing}
              className={styles.compressBtn}
            >
              {compressing ? 'Optimizing PDF Object Streams...' : 'Compress PDF'}
            </button>
          </div>
        )}

        {compressedUrl && (
          <div className={styles.successContainer}>
            <div>
              <div className={styles.successTitle}>
                PDF Optimized!
              </div>
              <div className={styles.successSize}>
                Reduced to {newSize} KB
              </div>
            </div>
            <a
              href={compressedUrl}
              download={`compressed-${file?.name || 'document.pdf'}`}
              className={styles.downloadLink}
            >
              Download PDF ↓
            </a>
          </div>
        )}
      </div>

      <AdBanner format="horizontal" />
    </div>
  );
}
