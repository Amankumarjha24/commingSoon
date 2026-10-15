'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { UploadCloud, Sparkles, Lock, Download, CheckCircle2 } from 'lucide-react';
import AdBanner from '@/components/AdBanner';
import styles from './page.module.css';

export default function ProtectPdfPage() {
  const [file, setFile] = useState<File | null>(null);
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [isEncrypting, setIsEncrypting] = useState<boolean>(false);
  const [protectedUrl, setProtectedUrl] = useState<string | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) {
      setFile(f);
      setProtectedUrl(null);
    }
  };

  const handleProtect = async () => {
    if (!file) return;
    if (!password) {
      alert('Please enter a password.');
      return;
    }
    if (password !== confirmPassword) {
      alert('Passwords do not match. Please verify your password.');
      return;
    }

    setIsEncrypting(true);

    try {
      const { PDFDocument } = await import('@cantoo/pdf-lib');
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await PDFDocument.load(arrayBuffer);

      // Real standard AES-256 PDF encryption
      await pdf.encrypt({
        userPassword: password,
        ownerPassword: password,
        permissions: {
          modifying: false,
          copying: false,
          annotating: false,
          fillingForms: false,
          contentAccessibility: true,
          documentAssembly: false,
        },
      });

      const savedBytes = await pdf.save({
        useObjectStreams: true,
      });

      const blob = new Blob([savedBytes.buffer as ArrayBuffer], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      setProtectedUrl(url);
    } catch (err: any) {
      console.error(err);
      alert('Failed to protect PDF: ' + err.message);
    } finally {
      setIsEncrypting(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.breadcrumb}>
        <Link href="/" className={styles.breadcrumbLink}>Home</Link>
        <span>/</span>
        <Link href="/?category=pdf#tools-section" className={styles.breadcrumbLink}>PDF Tools</Link>
        <span>/</span>
        <span className={styles.breadcrumbActive}>Protect PDF</span>
      </div>

      <div className={styles.headerContainer}>
        <h1 className={styles.title}>
          <span className={styles.iconWrapper}>🔒</span>
          Protect PDF (Password Lock)
        </h1>
        <p className={styles.subtitle}>
          Secure confidential documents with password protection. 100% private in-browser encryption — zero cloud uploads.
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
            <div className={styles.dropText}>Choose a PDF to Password Protect</div>
            <div className={styles.dropSub}>Client-Side Encryption (Zero Server Upload)</div>
          </label>
        ) : (
          <div className={styles.scannerContainer}>
            {isEncrypting && (
              <>
                <div className={styles.scannerBeam} />
                <div className={styles.scannerGlow} />
                <div className={styles.scanningBadge}>
                  <Sparkles style={{ width: '1rem', height: '1rem' }} />
                  <span>Encrypting Document & Locking Object Streams...</span>
                </div>
              </>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', maxWidth: '32rem', alignItems: 'center', marginBottom: '1.25rem' }}>
              <span style={{ fontSize: '0.875rem', fontWeight: 700, color: '#1c1917' }}>{file.name}</span>
              <button
                onClick={() => {
                  setFile(null);
                  setProtectedUrl(null);
                }}
                style={{ background: 'none', border: 'none', color: '#ef4444', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }}
              >
                Change PDF
              </button>
            </div>

            <div className={styles.formGrid}>
              <div>
                <label className={styles.label}>Set Document Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter strong password..."
                  className={styles.input}
                />
              </div>

              <div>
                <label className={styles.label}>Confirm Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter password..."
                  className={styles.input}
                />
              </div>

              {!protectedUrl && (
                <button
                  onClick={handleProtect}
                  disabled={isEncrypting}
                  className={styles.lockBtn}
                >
                  <Lock style={{ width: '1.1rem', height: '1.1rem' }} />
                  <span>{isEncrypting ? 'Encrypting PDF...' : 'Protect & Encrypt PDF'}</span>
                </button>
              )}
            </div>

            {protectedUrl && (
              <div className={styles.resultBox} style={{ marginTop: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#065f46', fontWeight: 800 }}>
                  <CheckCircle2 style={{ width: '1.25rem', height: '1.25rem' }} />
                  <span>PDF Encrypted & Locked Successfully!</span>
                </div>
                <a
                  href={protectedUrl}
                  download={`protected-${file.name}`}
                  className={styles.downloadBtn}
                >
                  <Download style={{ width: '1.1rem', height: '1.1rem' }} />
                  <span>Download Protected PDF</span>
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
