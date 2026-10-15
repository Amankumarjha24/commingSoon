'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import AdBanner from '@/components/AdBanner';
import styles from './page.module.css';

export default function ImageResizerPage() {
  const [file, setFile] = useState<File | null>(null);
  const [originalWidth, setOriginalWidth] = useState<number>(0);
  const [originalHeight, setOriginalHeight] = useState<number>(0);
  const [width, setWidth] = useState<number>(0);
  const [height, setHeight] = useState<number>(0);
  const [lockRatio, setLockRatio] = useState<boolean>(true);
  const [resizedUrl, setResizedUrl] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setResizedUrl(null);
    const img = new Image();
    img.src = URL.createObjectURL(f);
    img.onload = () => {
      setOriginalWidth(img.width);
      setOriginalHeight(img.height);
      setWidth(img.width);
      setHeight(img.height);
    };
  };

  const handleWidthChange = (val: number) => {
    setWidth(val);
    if (lockRatio && originalWidth > 0) {
      setHeight(Math.round((val / originalWidth) * originalHeight));
    }
  };

  const handleHeightChange = (val: number) => {
    setHeight(val);
    if (lockRatio && originalHeight > 0) {
      setWidth(Math.round((val / originalHeight) * originalWidth));
    }
  };

  const handleResize = () => {
    if (!file) return;
    const img = new Image();
    img.src = URL.createObjectURL(file);
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(img, 0, 0, width, height);
      setResizedUrl(canvas.toDataURL(file.type || 'image/jpeg', 0.95));
    };
  };

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
        <span className={styles.breadcrumbCurrent}>Image Resizer</span>
      </div>

      <div className={styles.headerContainer}>
        <h1 className={styles.headerTitle}>
          <span className={styles.headerIcon}>
            ↔️
          </span>
          Image Dimensions Resizer
        </h1>
        <p className={styles.headerDesc}>
          Resize photos to exact width and height pixels with aspect ratio preservation.
        </p>
      </div>

      <div className={styles.card}>
        <div>
          <label className={styles.label}>
            Upload Image to Resize
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className={styles.fileInput}
          />
        </div>

        {file && (
          <div className={styles.formGroup}>
            <div className={styles.grid}>
              <div>
                <label className={styles.label}>
                  Width (px)
                </label>
                <input
                  type="number"
                  value={width}
                  onChange={(e) => handleWidthChange(Number(e.target.value))}
                  className={styles.inputField}
                />
              </div>
              <div>
                <label className={styles.label}>
                  Height (px)
                </label>
                <input
                  type="number"
                  value={height}
                  onChange={(e) => handleHeightChange(Number(e.target.value))}
                  className={styles.inputField}
                />
              </div>
            </div>

            <div className={styles.checkboxContainer}>
              <input
                type="checkbox"
                id="aspectLock"
                checked={lockRatio}
                onChange={(e) => setLockRatio(e.target.checked)}
                className={styles.checkbox}
              />
              <label htmlFor="aspectLock" className={styles.checkboxLabel}>
                Lock aspect ratio ({originalWidth}x{originalHeight})
              </label>
            </div>

            <button
              onClick={handleResize}
              className={styles.resizeBtn}
            >
              Resize to {width} x {height} px
            </button>
          </div>
        )}

        {resizedUrl && (
          <div className={styles.resultCard}>
            <span className={styles.resultSuccess}>
              Resized to {width}x{height} px!
            </span>
            <a
              href={resizedUrl}
              download={`resized-${width}x${height}.jpg`}
              className={styles.downloadBtn}
            >
              Download Resized Image ↓
            </a>
          </div>
        )}
      </div>

      <AdBanner format="horizontal" />
    </div>
  );
}
