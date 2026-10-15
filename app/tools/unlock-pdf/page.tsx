'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { UploadCloud, Sparkles, Unlock, Download, CheckCircle2 } from 'lucide-react';
import AdBanner from '@/components/AdBanner';
import styles from './page.module.css';

export default function UnlockPdfPage() {
  const [file, setFile] = useState<File | null>(null);
  const [password, setPassword] = useState<string>('');
  const [isUnlocking, setIsUnlocking] = useState<boolean>(false);
  const [unlockedUrl, setUnlockedUrl] = useState<string | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) {
      setFile(f);
      setUnlockedUrl(null);
    }
  };

  const handleUnlock = async () => {
    if (!file) return;
    setIsUnlocking(true);

    try {
      const { PDFDocument } = await import('@cantoo/pdf-lib');
      const arrayBuffer = await file.arrayBuffer();

      let pdf;
      if (password && password.trim()) {
        // Load and decrypt with the provided password
        pdf = await PDFDocument.load(arrayBuffer, { password: password.trim() });
      } else {
        // Strip owner restrictions / permissions
        pdf = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
      }

      // Save as completely clean, unrestricted PDF
      const cleanBytes = await pdf.save({ useObjectStreams: true });

      const blob = new Blob([cleanBytes.buffer as ArrayBuffer], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      setUnlockedUrl(url);
    } catch (err: any) {
      console.error(err);
      alert('Could not unlock this PDF. Please check that the password is correct.');
    } finally {
      setIsUnlocking(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.breadcrumb}>
        <Link href="/" className={styles.breadcrumbLink}>Home</Link>
        <span>/</span>
        <Link href="/?category=pdf#tools-section" className={styles.breadcrumbLink}>PDF Tools</Link>
        <span>/</span>
        <span className={styles.breadcrumbActive}>Unlock PDF</span>
      </div>

      <div className={styles.headerContainer}>
        <h1 className={styles.title}>
          <span className={styles.iconWrapper}>🔓</span>
          Unlock PDF (Remove Password & Restrictions)
        </h1>
        <p className={styles.subtitle}>
          Remove password protection, printing locks, and editing restrictions from PDF files. 100% private in your browser.
        </p>
      </div>

      <div className={styles.card}>
        {!file ? (
          <label className={styles.dropzone}>
            <input
              type="file"
              accept="application/pdf"
              onChange={handleFileUpload}
              style={{ display: 'none' }}
            />
            <UploadCloud className={styles.dropIcon} />
            <div className={styles.dropText}>Choose a PDF to Unlock</div>
            <div className={styles.dropSub}>Removes Printing & Copying Restrictions (Zero Server Upload)</div>
          </label>
        ) : (
          <div className={styles.scannerContainer}>
            {isUnlocking && (
              <>
                <div className={styles.scannerBeam} />
                <div className={styles.scannerGlow} />
                <div className={styles.scanningBadge}>
                  <Sparkles style={{ width: '1rem', height: '1rem' }} />
                  <span>Decoupling Security Handlers & Stripping Encryption...</span>
                </div>
              </>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', maxWidth: '32rem', alignItems: 'center', marginBottom: '1.25rem' }}>
              <span style={{ fontSize: '0.875rem', fontWeight: 700, color: '#1c1917' }}>{file.name}</span>
              <button
                onClick={() => {
                  setFile(null);
                  setUnlockedUrl(null);
                }}
                style={{ background: 'none', border: 'none', color: '#ef4444', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }}
              >
                Change PDF
              </button>
            </div>

            <div className={styles.formGrid}>
              <div>
                <label className={styles.label}>Password (Optional / If Prompted)</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter PDF password if known..."
                  className={styles.input}
                />
              </div>

              {!unlockedUrl && (
                <button
                  onClick={handleUnlock}
                  disabled={isUnlocking}
                  className={styles.unlockBtn}
                >
                  <Unlock style={{ width: '1.1rem', height: '1.1rem' }} />
                  <span>{isUnlocking ? 'Unlocking PDF...' : 'Unlock & Strip Restrictions'}</span>
                </button>
              )}
            </div>

            {unlockedUrl && (
              <div className={styles.resultBox} style={{ marginTop: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#065f46', fontWeight: 800 }}>
                  <CheckCircle2 style={{ width: '1.25rem', height: '1.25rem' }} />
                  <span>PDF Unlocked Successfully! Printing and copying are now enabled.</span>
                </div>
                <a
                  href={unlockedUrl}
                  download={`unlocked-${file.name}`}
                  className={styles.downloadBtn}
                >
                  <Download style={{ width: '1.1rem', height: '1.1rem' }} />
                  <span>Download Unlocked PDF</span>
                </a>
              </div>
            )}
          </div>
        )}
      </div>

      <AdBanner format="horizontal" />
    </div>
  );
}
