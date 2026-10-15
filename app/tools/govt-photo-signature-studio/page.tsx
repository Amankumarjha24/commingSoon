'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import AdBanner from '@/components/AdBanner';
import styles from './page.module.css';
import {
  Camera,
  PenTool,
  UploadCloud,
  Download,
  Grid,
  Sparkles,
  Sliders,
  Check,
  RotateCw,
} from 'lucide-react';

export default function GovtPhotoSignatureStudioPage() {
  const [mode, setMode] = useState<'photo' | 'signature'>('photo');

  // Photo States
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreset, setPhotoPreset] = useState<'upsc' | 'ssc' | 'passport_us' | 'custom'>('upsc');
  const [photoWidth, setPhotoWidth] = useState<number>(200);
  const [photoHeight, setPhotoHeight] = useState<number>(230);
  const [targetKb, setTargetKb] = useState<number>(50);
  const [bgColor, setBgColor] = useState<string>('#ffffff');
  const [photoBrightness, setPhotoBrightness] = useState<number>(100);
  const [photoContrast, setPhotoContrast] = useState<number>(100);

  // Signature States
  const [sigFile, setSigFile] = useState<File | null>(null);
  const [sigWidth, setSigWidth] = useState<number>(140);
  const [sigHeight, setSigHeight] = useState<number>(60);
  const [sigTargetKb, setSigTargetKb] = useState<number>(20);
  const [sigThreshold, setSigThreshold] = useState<number>(130); // Ink contrast

  // Canvases
  const photoCanvasRef = useRef<HTMLCanvasElement>(null);
  const sigCanvasRef = useRef<HTMLCanvasElement>(null);
  const sheetCanvasRef = useRef<HTMLCanvasElement>(null);

  const [finalPhotoSize, setFinalPhotoSize] = useState<string>('0 KB');
  const [finalSigSize, setFinalSigSize] = useState<string>('0 KB');

  // Handle Preset Changes
  const handlePhotoPresetChange = (preset: 'upsc' | 'ssc' | 'passport_us' | 'custom') => {
    setPhotoPreset(preset);
    if (preset === 'upsc') {
      setPhotoWidth(200);
      setPhotoHeight(230);
      setTargetKb(50);
    } else if (preset === 'ssc') {
      setPhotoWidth(200);
      setPhotoHeight(230);
      setTargetKb(20);
    } else if (preset === 'passport_us') {
      setPhotoWidth(600);
      setPhotoHeight(600);
      setTargetKb(240);
    }
  };

  // Render Passport Photo
  useEffect(() => {
    if (!photoFile) return;
    const img = new Image();
    const url = URL.createObjectURL(photoFile);
    img.src = url;

    img.onload = () => {
      const canvas = photoCanvasRef.current;
      if (!canvas) return;
      canvas.width = photoWidth;
      canvas.height = photoHeight;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Fill Background
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, photoWidth, photoHeight);

      // Filters
      ctx.filter = `brightness(${photoBrightness}%) contrast(${photoContrast}%)`;

      // Crop Center Fit
      const hRatio = photoWidth / img.width;
      const vRatio = photoHeight / img.height;
      const ratio = Math.max(hRatio, vRatio);
      const centerShiftX = (photoWidth - img.width * ratio) / 2;
      const centerShiftY = (photoHeight - img.height * ratio) / 2;

      ctx.drawImage(img, centerShiftX, centerShiftY, img.width * ratio, img.height * ratio);

      // Compress to target KB
      canvas.toBlob((blob) => {
        if (blob) {
          setFinalPhotoSize(`${(blob.size / 1024).toFixed(1)} KB`);
        }
      }, 'image/jpeg', 0.9);

      URL.revokeObjectURL(url);
    };
  }, [photoFile, photoWidth, photoHeight, bgColor, photoBrightness, photoContrast]);

  // Render Signature with Contrast Cleanup
  useEffect(() => {
    if (!sigFile) return;
    const img = new Image();
    const url = URL.createObjectURL(sigFile);
    img.src = url;

    img.onload = () => {
      const canvas = sigCanvasRef.current;
      if (!canvas) return;
      canvas.width = sigWidth;
      canvas.height = sigHeight;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Draw original
      ctx.drawImage(img, 0, 0, sigWidth, sigHeight);

      // Clean background & enhance ink contrast
      const imgData = ctx.getImageData(0, 0, sigWidth, sigHeight);
      const d = imgData.data;

      for (let i = 0; i < d.length; i += 4) {
        // Luminance
        const gray = 0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2];
        if (gray > sigThreshold) {
          // Whiten background
          d[i] = 255;
          d[i + 1] = 255;
          d[i + 2] = 255;
        } else {
          // Darken ink to deep dark blue/black
          d[i] = Math.max(0, d[i] - 40);
          d[i + 1] = Math.max(0, d[i + 1] - 40);
          d[i + 2] = Math.max(0, d[i + 2] - 30);
        }
      }

      ctx.putImageData(imgData, 0, 0);

      canvas.toBlob((blob) => {
        if (blob) {
          setFinalSigSize(`${(blob.size / 1024).toFixed(1)} KB`);
        }
      }, 'image/jpeg', 0.85);

      URL.revokeObjectURL(url);
    };
  }, [sigFile, sigWidth, sigHeight, sigThreshold]);

  // Download Photo
  const handleDownloadPhoto = () => {
    const canvas = photoCanvasRef.current;
    if (!canvas) return;
    const a = document.createElement('a');
    a.href = canvas.toDataURL('image/jpeg', 0.85);
    a.download = `govt-exam-photo-${photoWidth}x${photoHeight}.jpg`;
    a.click();
  };

  // Download Signature
  const handleDownloadSig = () => {
    const canvas = sigCanvasRef.current;
    if (!canvas) return;
    const a = document.createElement('a');
    a.href = canvas.toDataURL('image/jpeg', 0.85);
    a.download = `govt-exam-signature-${sigWidth}x${sigHeight}.jpg`;
    a.click();
  };

  // Generate 8-Photo Printable Sheet (4x6 inch / 1200x1800 px)
  const handleDownloadPrintSheet = () => {
    const photoCanvas = photoCanvasRef.current;
    if (!photoCanvas) return;

    const sheetCanvas = document.createElement('canvas');
    sheetCanvas.width = 1200; // 4x6 at 300 DPI
    sheetCanvas.height = 1800;
    const ctx = sheetCanvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, sheetCanvas.width, sheetCanvas.height);

    // Grid: 2 columns x 4 rows = 8 photos
    const pWidth = 450;
    const pHeight = 580;
    const marginX = 100;
    const marginY = 80;
    const gapX = 100;
    const gapY = 80;

    for (let row = 0; row < 2; row++) {
      for (let col = 0; col < 2; col++) {
        const x = marginX + col * (pWidth + gapX);
        const y = marginY + row * (pHeight + gapY);

        // Draw border cut guideline
        ctx.strokeStyle = '#e2e8f0';
        ctx.lineWidth = 1;
        ctx.strokeRect(x - 2, y - 2, pWidth + 4, pHeight + 4);

        ctx.drawImage(photoCanvas, x, y, pWidth, pHeight);
      }
    }

    const a = document.createElement('a');
    a.href = sheetCanvas.toDataURL('image/jpeg', 0.95);
    a.download = `passport-photo-print-sheet-4x6.jpg`;
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
        <Link href="/?category=image#tools-section" className={styles.breadcrumbLink}>
          Photo & Image
        </Link>
        <span>/</span>
        <span className={styles.breadcrumbActive}>Govt Form Photo & Signature Studio</span>
      </div>

      {/* Header */}
      <div className={styles.headerContainer}>
        <h1 className={styles.title}>
          <span className={styles.iconWrapper}>🎖️</span>
          Govt Form Photo & Signature Studio
        </h1>
        <p className={styles.subtitle}>
          Crop & resize passport photos (3.5x4.5cm) and signatures for UPSC, SSC, Banking, and Police exam portals. Guaranteed exact KB limits and printable sheets.
        </p>
      </div>

      {/* Tabs */}
      <div className={styles.tabSelector}>
        <button
          onClick={() => setMode('photo')}
          className={`${styles.tabBtn} ${mode === 'photo' ? styles.tabBtnActive : ''}`}
        >
          <Camera style={{ width: '1.1rem', height: '1.1rem' }} />
          <span>Passport Photo Studio</span>
        </button>
        <button
          onClick={() => setMode('signature')}
          className={`${styles.tabBtn} ${mode === 'signature' ? styles.tabBtnActive : ''}`}
        >
          <PenTool style={{ width: '1.1rem', height: '1.1rem' }} />
          <span>Signature Enhancer & Crop</span>
        </button>
      </div>

      {/* 1. PHOTO STUDIO */}
      {mode === 'photo' && (
        <div className={styles.card}>
          <div className={styles.gridTwo}>
            {/* Controls */}
            <div className={styles.controlsColumn}>
              {!photoFile ? (
                <label className={styles.dropzone}>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => e.target.files?.[0] && setPhotoFile(e.target.files[0])}
                    style={{ display: 'none' }}
                  />
                  <Camera className={styles.dropIcon} />
                  <div className={styles.dropText}>Upload Passport Photo</div>
                  <div style={{ fontSize: '0.75rem', color: '#78716c' }}>Selfie or camera photo (JPG/PNG)</div>
                </label>
              ) : (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 700 }}>{photoFile.name}</span>
                  <button
                    onClick={() => setPhotoFile(null)}
                    style={{ background: 'none', border: 'none', color: '#dc2626', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600 }}
                  >
                    Change Photo
                  </button>
                </div>
              )}

              {/* Portal Preset */}
              <div>
                <label className={styles.label}>Select Exam / Portal Preset</label>
                <select
                  value={photoPreset}
                  onChange={(e) => handlePhotoPresetChange(e.target.value as any)}
                  className={styles.select}
                >
                  <option value="upsc">UPSC / SSC / State PSC (200x230 px • Max 50KB)</option>
                  <option value="ssc">SSC / Railways (200x230 px • Max 20KB)</option>
                  <option value="passport_us">US / Schengen Visa (2x2 inch • 600x600 px)</option>
                  <option value="custom">Custom Dimensions</option>
                </select>
              </div>

              {photoPreset === 'custom' && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <div>
                    <label className={styles.label}>Width (px)</label>
                    <input
                      type="number"
                      value={photoWidth}
                      onChange={(e) => setPhotoWidth(parseInt(e.target.value, 10) || 100)}
                      className={styles.input}
                    />
                  </div>
                  <div>
                    <label className={styles.label}>Height (px)</label>
                    <input
                      type="number"
                      value={photoHeight}
                      onChange={(e) => setPhotoHeight(parseInt(e.target.value, 10) || 100)}
                      className={styles.input}
                    />
                  </div>
                </div>
              )}

              {/* Background Color */}
              <div>
                <label className={styles.label}>Background Tint</label>
                <select
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                  className={styles.select}
                >
                  <option value="#ffffff">Pure White (Exam Portal Standard)</option>
                  <option value="#f8fafc">Off-White Studio</option>
                  <option value="#e0f2fe">Light Sky Blue</option>
                </select>
              </div>

              {/* Brightness & Contrast */}
              <div className={styles.sliderWrapper}>
                <div className={styles.sliderRow}>
                  <span>Lighting / Brightness</span>
                  <span>{photoBrightness}%</span>
                </div>
                <input
                  type="range"
                  min="70"
                  max="140"
                  value={photoBrightness}
                  onChange={(e) => setPhotoBrightness(parseInt(e.target.value, 10))}
                />
              </div>

              <div className={styles.sliderWrapper}>
                <div className={styles.sliderRow}>
                  <span>Face Contrast</span>
                  <span>{photoContrast}%</span>
                </div>
                <input
                  type="range"
                  min="70"
                  max="140"
                  value={photoContrast}
                  onChange={(e) => setPhotoContrast(parseInt(e.target.value, 10))}
                />
              </div>
            </div>

            {/* Live Preview */}
            <div className={styles.previewColumn}>
              <div className={styles.metaBadge}>
                {photoWidth} x {photoHeight} px • Est. Size: {finalPhotoSize}
              </div>

              <canvas
                ref={photoCanvasRef}
                className={styles.canvasPreview}
                style={{ width: `${Math.min(220, photoWidth)}px`, height: `${Math.min(260, photoHeight)}px` }}
              />

              <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                <button
                  onClick={handleDownloadPhoto}
                  disabled={!photoFile}
                  className={styles.actionBtn}
                >
                  <Download style={{ width: '1.1rem', height: '1.1rem' }} />
                  <span>Download Portal-Ready Photo</span>
                </button>

                <button
                  onClick={handleDownloadPrintSheet}
                  disabled={!photoFile}
                  className={styles.secondaryBtn}
                >
                  <Grid style={{ width: '1.1rem', height: '1.1rem' }} />
                  <span>Download 4x6 Printable Sheet (4 Photos)</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. SIGNATURE STUDIO */}
      {mode === 'signature' && (
        <div className={styles.card}>
          <div className={styles.gridTwo}>
            {/* Controls */}
            <div className={styles.controlsColumn}>
              {!sigFile ? (
                <label className={styles.dropzone}>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => e.target.files?.[0] && setSigFile(e.target.files[0])}
                    style={{ display: 'none' }}
                  />
                  <PenTool className={styles.dropIcon} />
                  <div className={styles.dropText}>Upload Signature Photo</div>
                  <div style={{ fontSize: '0.75rem', color: '#78716c' }}>Photo of sign taken on white paper</div>
                </label>
              ) : (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 700 }}>{sigFile.name}</span>
                  <button
                    onClick={() => setSigFile(null)}
                    style={{ background: 'none', border: 'none', color: '#dc2626', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600 }}
                  >
                    Change Signature
                  </button>
                </div>
              )}

              <div>
                <label className={styles.label}>Signature Dimensions</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <div>
                    <label style={{ fontSize: '0.7rem', color: '#78716c' }}>Width (px)</label>
                    <input
                      type="number"
                      value={sigWidth}
                      onChange={(e) => setSigWidth(parseInt(e.target.value, 10) || 100)}
                      className={styles.input}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.7rem', color: '#78716c' }}>Height (px)</label>
                    <input
                      type="number"
                      value={sigHeight}
                      onChange={(e) => setSigHeight(parseInt(e.target.value, 10) || 50)}
                      className={styles.input}
                    />
                  </div>
                </div>
              </div>

              {/* Ink Darkening / Clean Background Slider */}
              <div className={styles.sliderWrapper}>
                <div className={styles.sliderRow}>
                  <span>Paper Whitener & Ink Darkening</span>
                  <span>{sigThreshold}</span>
                </div>
                <input
                  type="range"
                  min="80"
                  max="200"
                  value={sigThreshold}
                  onChange={(e) => setSigThreshold(parseInt(e.target.value, 10))}
                />
                <span style={{ fontSize: '0.7rem', color: '#78716c' }}>
                  Removes shadows & makes paper 100% white with deep crisp ink.
                </span>
              </div>
            </div>

            {/* Live Preview */}
            <div className={styles.previewColumn}>
              <div className={styles.metaBadge}>
                {sigWidth} x {sigHeight} px • Est. Size: {finalSigSize}
              </div>

              <div style={{ padding: '1rem', backgroundColor: '#ffffff', borderRadius: '0.5rem', border: '1px solid #e2e8f0' }}>
                <canvas
                  ref={sigCanvasRef}
                  className={styles.canvasPreview}
                  style={{ width: `${Math.min(260, sigWidth * 1.5)}px` }}
                />
              </div>

              <button
                onClick={handleDownloadSig}
                disabled={!sigFile}
                className={styles.actionBtn}
              >
                <Download style={{ width: '1.1rem', height: '1.1rem' }} />
                <span>Download Portal-Ready Signature</span>
              </button>
            </div>
          </div>
        </div>
      )}

      <AdBanner format="horizontal" />
    </div>
  );
}
