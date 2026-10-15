'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import AdBanner from '@/components/AdBanner';
import styles from './page.module.css';

export default function ImageCompressorPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [targetKb, setTargetKb] = useState<number>(50);
  const [compressedBlob, setCompressedBlob] = useState<Blob | null>(null);
  const [compressedUrl, setCompressedUrl] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [originalSizeKb, setOriginalSizeKb] = useState<number>(0);
  const [finalSizeKb, setFinalSizeKb] = useState<number>(0);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setOriginalSizeKb(Math.round(file.size / 1024));
      setPreviewUrl(URL.createObjectURL(file));
      setCompressedBlob(null);
      setCompressedUrl(null);
    }
  };

  const compressToTargetKb = async () => {
    if (!selectedFile) return;
    setProcessing(true);

    const img = new Image();
    img.src = URL.createObjectURL(selectedFile);
    await new Promise((resolve) => {
      img.onload = resolve;
    });

    const canvas = document.createElement('canvas');
    let width = img.width;
    let height = img.height;
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.drawImage(img, 0, 0, width, height);

    const targetBytes = targetKb * 1024;
    let minQuality = 0.05;
    let maxQuality = 0.98;
    let bestBlob: Blob | null = null;

    // Binary search for JPEG quality
    for (let i = 0; i < 7; i++) {
      const midQuality = (minQuality + maxQuality) / 2;
      const blob: Blob = await new Promise((resolve) =>
        canvas.toBlob((b) => resolve(b!), 'image/jpeg', midQuality)
      );

      if (blob.size <= targetBytes) {
        bestBlob = blob;
        minQuality = midQuality; // try higher quality
      } else {
        maxQuality = midQuality; // reduce quality
      }
    }

    // If still too big, downscale dimensions slightly
    if (!bestBlob || bestBlob.size > targetBytes) {
      let scale = 0.9;
      while (scale > 0.2) {
        canvas.width = Math.round(width * scale);
        canvas.height = Math.round(height * scale);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        const blob: Blob = await new Promise((resolve) =>
          canvas.toBlob((b) => resolve(b!), 'image/jpeg', 0.8)
        );
        if (blob.size <= targetBytes) {
          bestBlob = blob;
          break;
        }
        scale -= 0.15;
      }
    }

    if (bestBlob) {
      setCompressedBlob(bestBlob);
      setCompressedUrl(URL.createObjectURL(bestBlob));
      setFinalSizeKb(Math.round(bestBlob.size / 1024));
    }
    setProcessing(false);
  };

  const handleDownload = () => {
    if (!compressedUrl) return;
    const a = document.createElement('a');
    a.href = compressedUrl;
    a.download = `compressed-${targetKb}kb-${selectedFile?.name || 'image.jpg'}`;
    a.click();
  };

  return (
    <div className={styles.container}>
      {/* Breadcrumb */}
      <div className={styles.breadcrumb}>
        <Link href="/" className={styles.breadcrumbLink}>
          Home
        </Link>
        <span>/</span>
        <Link href="/#tools-section" className={styles.breadcrumbLink}>
          Photo Tools
        </Link>
        <span>/</span>
        <span className={styles.breadcrumbCurrent}>Target KB Compressor</span>
      </div>

      {/* Header */}
      <div className={styles.headerContainer}>
        <h1 className={styles.headerTitle}>
          <span className={styles.headerIcon}>
            📦
          </span>
          Target KB Image Compressor
        </h1>
        <p className={styles.headerDesc}>
          Compress photos to exact 20KB, 50KB, 100KB limits required for government job applications, SSC, UPSC, and passport portals.
        </p>
      </div>

      {/* Upload Zone & Config Card */}
      <div className={styles.card}>
        {/* Dropzone */}
        {!selectedFile ? (
          <div
            onClick={() => fileInputRef.current?.click()}
            className={styles.dropzone}
          >
            <div className={styles.dropzoneIcon}>
              📁
            </div>
            <h3 className={styles.dropzoneTitle}>
              Click to upload photo or drag & drop here
            </h3>
            <p className={styles.dropzoneDesc}>
              Supports JPG, PNG, WebP up to 25MB
            </p>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className={styles.hiddenInput}
            />
          </div>
        ) : (
          <div className={styles.cardContent}>
            {/* File info pill */}
            <div className={styles.fileInfoPill}>
              <div className={styles.fileInfoLeft}>
                <span className={styles.fileIcon}>🖼️</span>
                <div>
                  <div className={styles.fileName}>
                    {selectedFile.name}
                  </div>
                  <div className={styles.fileSize}>
                    Original Size: <strong className={styles.fileSizeStrong}>{originalSizeKb} KB</strong>
                  </div>
                </div>
              </div>
              <button
                onClick={() => {
                  setSelectedFile(null);
                  setPreviewUrl(null);
                  setCompressedBlob(null);
                }}
                className={styles.removeButton}
              >
                Remove
              </button>
            </div>

            {/* Target KB Presets */}
            <div>
              <label className={styles.presetLabel}>
                Choose Target File Size:
              </label>
              <div className={styles.presetContainer}>
                {[20, 50, 100, 200].map((kb) => (
                  <button
                    key={kb}
                    onClick={() => setTargetKb(kb)}
                    className={`${styles.presetButton} ${
                      targetKb === kb
                        ? styles.presetActive
                        : styles.presetInactive
                    }`}
                  >
                    {kb} KB
                  </button>
                ))}
                <div className={styles.customPresetWrapper}>
                  <span className={styles.customPresetLabel}>Custom:</span>
                  <input
                    type="number"
                    value={targetKb}
                    onChange={(e) => setTargetKb(Number(e.target.value))}
                    min={5}
                    max={5000}
                    className={styles.customPresetInput}
                  />
                  <span className={styles.customPresetLabel}>KB</span>
                </div>
              </div>
            </div>

            {/* Compress Button */}
            <button
              onClick={compressToTargetKb}
              disabled={processing}
              className={styles.compressBtn}
            >
              {processing ? (
                <>
                  <div className={styles.spinner} />
                  <span>Optimizing DCT Quantization...</span>
                </>
              ) : (
                <span>Compress to Under {targetKb} KB</span>
              )}
            </button>

            {/* Compressed Result */}
            {compressedBlob && (
              <div className={styles.resultCard}>
                <div className={styles.resultInfo}>
                  <div className={styles.resultSuccess}>
                    <span>✅</span> Successfully Compressed!
                  </div>
                  <div className={styles.resultText}>
                    Result: <strong className={styles.resultTextStrong}>{finalSizeKb} KB</strong> (Saved{' '}
                    {Math.round(((originalSizeKb - finalSizeKb) / originalSizeKb) * 100)}%)
                  </div>
                </div>
                <button
                  onClick={handleDownload}
                  className={styles.downloadBtn}
                >
                  Download {finalSizeKb} KB File ↓
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      <AdBanner format="horizontal" />
    </div>
  );
}
