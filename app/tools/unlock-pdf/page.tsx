'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import {
  UploadCloud,
  Sparkles,
  Unlock,
  Download,
  CheckCircle2,
  Lock,
  AlertCircle,
  FileText,
  RotateCcw,
  ShieldCheck,
  KeyRound,
} from 'lucide-react';
import AdBanner from '@/components/AdBanner';
import styles from './page.module.css';

export default function UnlockPdfPage() {
  const [file, setFile] = useState<File | null>(null);
  const [password, setPassword] = useState<string>('');
  const [isDetecting, setIsDetecting] = useState<boolean>(false);
  const [needsPassword, setNeedsPassword] = useState<boolean>(false);
  const [detectStatus, setDetectStatus] = useState<string>('');
  const [pageCount, setPageCount] = useState<number | null>(null);

  const [isUnlocking, setIsUnlocking] = useState<boolean>(false);
  const [unlockedUrl, setUnlockedUrl] = useState<string | null>(null);
  const [unlockedSize, setUnlockedSize] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const passwordInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;

    if (f.type !== 'application/pdf' && !f.name.toLowerCase().endsWith('.pdf')) {
      alert('Please select a valid PDF file.');
      return;
    }

    setFile(f);
    setPassword('');
    setUnlockedUrl(null);
    setUnlockedSize(null);
    setErrorMessage(null);
    setIsDetecting(true);

    try {
      const { PDFDocument } = await import('@cantoo/pdf-lib');
      const arrayBuffer = await f.arrayBuffer();

      // Test whether this PDF has a document open password
      try {
        const testDoc = await PDFDocument.load(arrayBuffer, { password: '' });
        setNeedsPassword(false);
        setPageCount(testDoc.getPageCount());
        setDetectStatus('Owner/Permissions lock detected or unrestricted. No open password needed!');
      } catch (err: any) {
        // Document has a user/open password
        setNeedsPassword(true);
        setPageCount(null);
        setDetectStatus('Document Open Password Detected. Please enter the password below to decrypt and permanently unlock.');
        setTimeout(() => {
          passwordInputRef.current?.focus();
        }, 150);
      }
    } catch (err: any) {
      console.error('Inspection error:', err);
      setDetectStatus('File ready for unlocking.');
    } finally {
      setIsDetecting(false);
    }
  };

  const handleUnlock = async () => {
    if (!file) return;
    setErrorMessage(null);

    if (needsPassword && !password.trim()) {
      setErrorMessage('This PDF is protected with an Open Password. Please enter the password above to unlock it.');
      passwordInputRef.current?.focus();
      return;
    }

    setIsUnlocking(true);

    try {
      const { PDFDocument } = await import('@cantoo/pdf-lib');
      const arrayBuffer = await file.arrayBuffer();

      // 1. Load with provided password (or blank if owner-restricted)
      let loadedDoc;
      try {
        loadedDoc = await PDFDocument.load(
          arrayBuffer,
          needsPassword ? { password: password.trim() } : { password: '' }
        );
      } catch (loadErr: any) {
        const msg = (loadErr?.message || '').toLowerCase();
        if (msg.includes('password') || msg.includes('needs password')) {
          throw new Error('Incorrect password. Please verify the document password and try again.');
        }
        throw loadErr;
      }

      const totalPages = loadedDoc.getPageCount();
      if (totalPages === 0) {
        throw new Error('This PDF has 0 pages or could not be decrypted.');
      }

      // 2. Reconstruct into a fresh, completely unencrypted PDF document
      // Note: Copying pages to a new PDFDocument permanently strips all security handlers,
      // encryption dictionaries, and permission restriction flags from the file.
      const cleanDoc = await PDFDocument.create();
      const copiedPages = await cleanDoc.copyPages(loadedDoc, loadedDoc.getPageIndices());
      for (const page of copiedPages) {
        cleanDoc.addPage(page);
      }

      // Copy metadata if accessible
      try {
        if (loadedDoc.getTitle()) cleanDoc.setTitle(loadedDoc.getTitle()!);
        if (loadedDoc.getAuthor()) cleanDoc.setAuthor(loadedDoc.getAuthor()!);
        if (loadedDoc.getSubject()) cleanDoc.setSubject(loadedDoc.getSubject()!);
        if (loadedDoc.getKeywords()) cleanDoc.setKeywords(loadedDoc.getKeywords()!);
        if (loadedDoc.getProducer()) cleanDoc.setProducer(loadedDoc.getProducer()!);
        if (loadedDoc.getCreator()) cleanDoc.setCreator(loadedDoc.getCreator()!);
      } catch {
        // Optional metadata
      }

      // 3. Save as clean bytes
      const cleanBytes = await cleanDoc.save({ useObjectStreams: true });

      // 4. Automated Independent Verification: Re-parse cleanBytes to verify it requires 0 passwords
      const verifyDoc = await PDFDocument.load(cleanBytes);
      if (verifyDoc.getPageCount() !== totalPages) {
        throw new Error('Verification failed: Page count mismatch in unlocked document.');
      }

      // 5. Generate download URL
      const blob = new Blob([cleanBytes.buffer as ArrayBuffer], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      setUnlockedUrl(url);
      setPageCount(totalPages);

      const sizeKb = (cleanBytes.length / 1024).toFixed(1);
      const sizeStr = cleanBytes.length > 1024 * 1024 ? (cleanBytes.length / (1024 * 1024)).toFixed(2) + ' MB' : `${sizeKb} KB`;
      setUnlockedSize(sizeStr);
    } catch (err: any) {
      console.error('Unlock error:', err);
      setErrorMessage(err.message || 'Could not unlock this PDF. Please verify that the password is correct.');
    } finally {
      setIsUnlocking(false);
    }
  };

  const handleReset = () => {
    if (unlockedUrl) {
      URL.revokeObjectURL(unlockedUrl);
    }
    setFile(null);
    setPassword('');
    setUnlockedUrl(null);
    setUnlockedSize(null);
    setErrorMessage(null);
    setNeedsPassword(false);
    setDetectStatus('');
    setPageCount(null);
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
            <div className={styles.dropSub}>Removes Open Passwords, Printing Locks & Copy Restrictions (Zero Cloud Uploads)</div>
          </label>
        ) : (
          <div className={styles.scannerContainer}>
            {isUnlocking && (
              <>
                <div className={styles.scannerBeam} />
                <div className={styles.scannerGlow} />
                <div className={styles.scanningBadge}>
                  <Sparkles style={{ width: '1rem', height: '1rem' }} />
                  <span>Decrypting Security Streams & Permanently Stripping Locks...</span>
                </div>
              </>
            )}

            {/* File Info Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', maxWidth: '34rem', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <FileText style={{ width: '1.25rem', height: '1.25rem', color: '#0f766e' }} />
                <span style={{ fontSize: '0.875rem', fontWeight: 700, color: '#1c1917' }}>{file.name}</span>
                <span className={styles.metaBadge}>
                  {(file.size / 1024).toFixed(1)} KB
                </span>
                {pageCount !== null && (
                  <span className={styles.metaBadge}>
                    {pageCount} {pageCount === 1 ? 'page' : 'pages'}
                  </span>
                )}
              </div>
              <button
                onClick={handleReset}
                style={{ background: 'none', border: 'none', color: '#ef4444', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
              >
                <RotateCcw style={{ width: '0.85rem', height: '0.85rem' }} />
                <span>Change PDF</span>
              </button>
            </div>

            {/* Smart Detection Banner */}
            <div style={{ width: '100%', maxWidth: '34rem', marginBottom: '1.25rem' }}>
              {isDetecting ? (
                <div className={styles.statusBannerInfo}>
                  <Sparkles style={{ width: '1rem', height: '1rem', flexShrink: 0 }} />
                  <span>Analyzing PDF encryption algorithms and permission headers...</span>
                </div>
              ) : needsPassword ? (
                <div className={styles.statusBannerWarn}>
                  <Lock style={{ width: '1.1rem', height: '1.1rem', flexShrink: 0, color: '#d97706' }} />
                  <div>
                    <strong>Document Open Password Detected:</strong> This file is encrypted. Enter the document password below to decrypt and permanently unlock it.
                  </div>
                </div>
              ) : (
                <div className={styles.statusBannerInfo}>
                  <ShieldCheck style={{ width: '1.1rem', height: '1.1rem', flexShrink: 0, color: '#059669' }} />
                  <div>
                    <strong>Permission Restrictions Only:</strong> No open password required! Click below to remove printing, editing, and copying restrictions.
                  </div>
                </div>
              )}
            </div>

            {/* Error Message Alert */}
            {errorMessage && (
              <div style={{ width: '100%', maxWidth: '34rem', marginBottom: '1.25rem' }}>
                <div className={styles.errorBox}>
                  <AlertCircle style={{ width: '1.1rem', height: '1.1rem', flexShrink: 0 }} />
                  <span>{errorMessage}</span>
                </div>
              </div>
            )}

            {/* Form Controls */}
            <div className={styles.formGrid} style={{ maxWidth: '34rem' }}>
              {needsPassword && (
                <div>
                  <label className={styles.label} style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <KeyRound style={{ width: '0.9rem', height: '0.9rem', color: '#0f766e' }} />
                    <span>Enter PDF Password (Required)</span>
                  </label>
                  <input
                    ref={passwordInputRef}
                    type="password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (errorMessage) setErrorMessage(null);
                    }}
                    placeholder="Type the password to decrypt..."
                    className={styles.input}
                    disabled={isUnlocking}
                  />
                  <div style={{ fontSize: '0.75rem', color: '#78716c', marginTop: '0.35rem' }}>
                    Entering the password once permanently removes it. Your file is never uploaded to any server.
                  </div>
                </div>
              )}

              {!unlockedUrl && (
                <button
                  onClick={handleUnlock}
                  disabled={isUnlocking}
                  className={styles.unlockBtn}
                >
                  <Unlock style={{ width: '1.1rem', height: '1.1rem' }} />
                  <span>
                    {isUnlocking
                      ? 'Decrypting & Stripping Restrictions...'
                      : needsPassword
                      ? 'Unlock & Remove Password Permanently'
                      : 'Strip Permissions & Unlock PDF'}
                  </span>
                </button>
              )}
            </div>

            {/* Unlocked Result State */}
            {unlockedUrl && (
              <div className={styles.resultBox} style={{ marginTop: '1.5rem', maxWidth: '34rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: '#065f46', fontWeight: 800, fontSize: '0.95rem' }}>
                  <CheckCircle2 style={{ width: '1.4rem', height: '1.4rem', color: '#059669', flexShrink: 0 }} />
                  <span>PDF Unlocked Successfully!</span>
                </div>
                <p style={{ margin: 0, fontSize: '0.8125rem', color: '#047857', textAlign: 'center', lineHeight: '1.4' }}>
                  All passwords, encryption algorithms, printing locks, and copying restrictions have been permanently removed. This PDF will now open directly in Chrome, Edge, and Adobe Acrobat without asking for any password.
                </p>
                <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                  <a
                    href={unlockedUrl}
                    download={`unlocked-${file.name}`}
                    className={styles.downloadBtn}
                  >
                    <Download style={{ width: '1.1rem', height: '1.1rem' }} />
                    <span>Download Unlocked PDF {unlockedSize ? `(${unlockedSize})` : ''}</span>
                  </a>
                  <button
                    onClick={handleReset}
                    className={styles.resetBtn}
                  >
                    <RotateCcw style={{ width: '0.9rem', height: '0.9rem' }} />
                    <span>Unlock Another File</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <div style={{ marginTop: '2rem' }}>
        <AdBanner format="horizontal" />
      </div>
    </div>
  );
}
