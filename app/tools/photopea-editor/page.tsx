'use client';

import React, { useRef, useState } from 'react';
import Link from 'next/link';
import AdBanner from '@/components/AdBanner';
import styles from './page.module.css';

export default function PhotopeaEditorPage() {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Load a file into Photopea via postMessage
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !iframeRef.current) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const buffer = event.target?.result as ArrayBuffer;
      if (iframeRef.current?.contentWindow) {
        iframeRef.current.contentWindow.postMessage(buffer, '*');
      }
    };
    reader.readAsArrayBuffer(file);
  };

  // Export from Photopea
  const requestExport = (format: string) => {
    if (!iframeRef.current?.contentWindow) return;
    const script = `app.activeDocument.saveToOE("${format}");`;
    iframeRef.current.contentWindow.postMessage(script, '*');
  };

  return (
    <div className={styles.container}>
      {/* Breadcrumb & Navigation */}
      <div className={styles.breadcrumb}>
        <Link href="/" className={styles.breadcrumbLink}>
          Home
        </Link>
        <span>/</span>
        <Link href="/#tools-section" className={styles.breadcrumbLink}>
          Photo Tools
        </Link>
        <span>/</span>
        <span className={styles.breadcrumbActive}>Photopea Studio</span>
      </div>

      {/* Tool Header */}
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>
            <span className={styles.iconWrap}>
              🎨
            </span>
            Photopea Studio Pro
          </h1>
          <p className={styles.subtitle}>
            Complete PSD, XCF, RAW photo editor. Free Adobe Photoshop alternative running locally inside your browser.
          </p>
        </div>

        {/* Action Controls */}
        <div className={styles.actions}>
          <label className={styles.primaryButton}>
            <svg className={styles.buttonIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
            Open File (PSD/IMG)
            <input type="file" accept="image/*,.psd,.xcf,.sketch,.pdf" onChange={handleFileUpload} className={styles.hiddenInput} />
          </label>

          <button
            onClick={() => requestExport('png')}
            className={styles.secondaryButton}
          >
            Export PNG
          </button>

          <button
            onClick={() => requestExport('jpg')}
            className={styles.secondaryButton}
          >
            Export JPG
          </button>

          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className={styles.secondaryButton}
          >
            {isFullscreen ? 'Exit Fullscreen' : 'Fullscreen ⛶'}
          </button>
        </div>
      </div>

      {/* Editor Container */}
      <div
        className={isFullscreen ? styles.editorContainerFullscreen : styles.editorContainer}
      >
        {loading && (
          <div className={styles.loadingOverlay}>
            <div className={styles.spinner} />
            <p className={styles.loadingText}>Loading Photopea Engine...</p>
          </div>
        )}

        {isFullscreen && (
          <button
            onClick={() => setIsFullscreen(false)}
            className={styles.exitFullscreenBtn}
          >
            ✕ Exit Fullscreen
          </button>
        )}

        <iframe
          ref={iframeRef}
          src="https://www.photopea.com#%7B%22environment%22%3A%7B%22theme%22%3A2%7D%7D"
          onLoad={() => setLoading(false)}
          className={styles.iframe}
          title="Photopea Pro Editor"
          allow="clipboard-read; clipboard-write"
        />
      </div>

      {/* Monetization Ad Space */}
      <AdBanner format="horizontal" />

      {/* Instructions & Features */}
      <div className={styles.featuresGrid}>
        <div className={styles.featureCard}>
          <h3 className={styles.featureCardTitle}>
            <span>✨</span> Full Layer Support
          </h3>
          <p className={styles.featureCardDesc}>
            Create layer masks, blend modes, adjustment layers, text styling, and smart filters without limitations.
          </p>
        </div>
        <div className={styles.featureCard}>
          <h3 className={styles.featureCardTitle}>
            <span>💾</span> Multi-Format Import
          </h3>
          <p className={styles.featureCardDesc}>
            Open Photoshop .PSD, GIMP .XCF, Sketch, RAW camera files, SVG, and high-resolution JPEG/PNG files.
          </p>
        </div>
        <div className={styles.featureCard}>
          <h3 className={styles.featureCardTitle}>
            <span>🔒</span> Zero Uploads
          </h3>
          <p className={styles.featureCardDesc}>
            Runs via client-side WebAssembly. All images stay on your computer's local memory.
          </p>
        </div>
      </div>
    </div>
  );
}