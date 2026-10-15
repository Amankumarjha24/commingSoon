'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import AdBanner from '@/components/AdBanner';
import styles from './page.module.css';

export default function ImageConverterPage() {
  const [file, setFile] = useState<File | null>(null);
  const [targetFormat, setTargetFormat] = useState<string>('image/webp');
  const [convertedUrl, setConvertedUrl] = useState<string | null>(null);
  const [converting, setConverting] = useState<boolean>(false);

  const handleConvert = async () => {
    if (!file) return;
    setConverting(true);

    const img = new Image();
    img.src = URL.createObjectURL(file);
    await new Promise((res) => (img.onload = res));

    const canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext('2d');
    ctx?.drawImage(img, 0, 0);

    canvas.toBlob(
      (blob) => {
        if (blob) {
          setConvertedUrl(URL.createObjectURL(blob));
        }
        setConverting(false);
      },
      targetFormat,
      0.92
    );
  };

  const extension = targetFormat.split('/')[1];

  return (
    <div className={styles.container}>
      <div className={styles.breadcrumb}>
        <Link href="/" className={styles.breadcrumbLink}>
          Home
        </Link>
        <span>/</span>
        <Link href="/#tools-section" className={styles.breadcrumbLink}>
          Photo Tools
        </Link>
        <span>/</span>
        <span className={styles.breadcrumbCurrent}>Image Converter</span>
      </div>

      <div className={styles.headerContainer}>
        <h1 className={styles.headerTitle}>
          <span className={styles.headerIcon}>
            🔄
          </span>
          Image Format Converter
        </h1>
        <p className={styles.headerDesc}>
          Convert photos between WebP, PNG, and JPG formats directly in your browser. No file uploads.
        </p>
      </div>

      <div className={styles.card}>
        <div>
          <label className={styles.label}>
            Select an Image
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) {
                setFile(f);
                setConvertedUrl(null);
              }
            }}
            className={styles.fileInput}
          />
        </div>

        <div>
          <label className={styles.label}>
            Target Format
          </label>
          <div className={styles.formatContainer}>
            {[
              { label: 'WebP (Recommended)', mime: 'image/webp' },
              { label: 'PNG (Lossless)', mime: 'image/png' },
              { label: 'JPEG / JPG', mime: 'image/jpeg' },
            ].map((fmt) => (
              <button
                key={fmt.mime}
                onClick={() => setTargetFormat(fmt.mime)}
                className={`${styles.formatButton} ${
                  targetFormat === fmt.mime
                    ? styles.formatActive
                    : styles.formatInactive
                }`}
              >
                {fmt.label}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handleConvert}
          disabled={!file || converting}
          className={styles.convertBtn}
        >
          {converting ? 'Converting in Canvas...' : 'Convert Image Now'}
        </button>

        {convertedUrl && (
          <div className={styles.resultCard}>
            <span className={styles.resultSuccess}>
              Ready in {extension.toUpperCase()}!
            </span>
            <a
              href={convertedUrl}
              download={`converted.${extension}`}
              className={styles.downloadBtn}
            >
              Download File ↓
            </a>
          </div>
        )}
      </div>

      <AdBanner format="horizontal" />
    </div>
  );
}
