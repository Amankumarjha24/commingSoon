'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { UploadCloud, Sparkles, Sliders, Download, RefreshCw, Eye } from 'lucide-react';
import AdBanner from '@/components/AdBanner';
import styles from './page.module.css';

const PRESETS = [
  { id: 'normal', name: 'Original', b: 100, c: 100, s: 100, g: 0, sep: 0, bl: 0, inv: 0 },
  { id: 'bw', name: 'B&W Film', b: 105, c: 130, s: 0, g: 100, sep: 0, bl: 0, inv: 0 },
  { id: 'sepia', name: 'Vintage Sepia', b: 95, c: 110, s: 90, g: 0, sep: 80, bl: 0, inv: 0 },
  { id: 'dramatic', name: 'Dramatic Noir', b: 90, c: 160, s: 0, g: 100, sep: 0, bl: 0, inv: 0 },
  { id: 'warm', name: 'Warm Sunset', b: 105, c: 110, s: 140, g: 0, sep: 30, bl: 0, inv: 0 },
  { id: 'cool', name: 'Cool Aqua', b: 100, c: 110, s: 130, g: 0, sep: 0, bl: 0, inv: 0 },
  { id: 'cyber', name: 'Cyber Invert', b: 100, c: 120, s: 120, g: 0, sep: 0, bl: 0, inv: 100 },
];

export default function ImageFiltersStudioPage() {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imgElement, setImgElement] = useState<HTMLImageElement | null>(null);
  const [selectedPreset, setSelectedPreset] = useState<string>('normal');
  const [brightness, setBrightness] = useState<number>(100);
  const [contrast, setContrast] = useState<number>(100);
  const [saturation, setSaturation] = useState<number>(100);
  const [grayscale, setGrayscale] = useState<number>(0);
  const [sepia, setSepia] = useState<number>(0);
  const [blur, setBlur] = useState<number>(0);
  const [invert, setInvert] = useState<number>(0);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const img = new Image();
      img.onload = () => setImgElement(img);
      img.src = URL.createObjectURL(file);
    }
  };

  const applyPreset = (preset: typeof PRESETS[0]) => {
    setSelectedPreset(preset.id);
    setBrightness(preset.b);
    setContrast(preset.c);
    setSaturation(preset.s);
    setGrayscale(preset.g);
    setSepia(preset.sep);
    setBlur(preset.bl);
    setInvert(preset.inv);
  };

  useEffect(() => {
    if (!imgElement || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = imgElement.width;
    canvas.height = imgElement.height;

    // Apply CSS Filters to canvas
    const filterString = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%) grayscale(${grayscale}%) sepia(${sepia}%) blur(${blur}px) invert(${invert}%)`;
    ctx.filter = filterString;
    ctx.drawImage(imgElement, 0, 0);
  }, [imgElement, brightness, contrast, saturation, grayscale, sepia, blur, invert]);

  const downloadFilteredImage = () => {
    if (!canvasRef.current || !imageFile) return;
    const link = document.createElement('a');
    link.download = `filtered-${imageFile.name}`;
    link.href = canvasRef.current.toDataURL('image/png');
    link.click();
  };

  return (
    <div className={styles.container}>
      <div className={styles.breadcrumb}>
        <Link href="/" className={styles.breadcrumbLink}>Home</Link>
        <span>/</span>
        <Link href="/?category=image#tools-section" className={styles.breadcrumbLink}>Photo & Image</Link>
        <span>/</span>
        <span className={styles.breadcrumbActive}>Photo Filters & B&W Studio</span>
      </div>

      <div className={styles.headerContainer}>
        <h1 className={styles.title}>
          <span className={styles.iconWrapper}>✨</span>
          Photo Filters & B&W (Black & White) Studio
        </h1>
        <p className={styles.subtitle}>
          Turn photos into dramatic black & white, vintage sepia, or vibrant film tones with real-time in-browser Canvas filters.
        </p>
      </div>

      <div className={styles.card}>
        {!imageFile ? (
          <label className={styles.dropzone}>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              style={{ display: 'none' }}
            />
            <UploadCloud className={styles.dropIcon} />
            <div className={styles.dropText}>Choose a Photo to Enhance</div>
            <div className={styles.dropSub}>JPG, PNG, WebP supported (100% Client-Side Privacy)</div>
          </label>
        ) : (
          <div className={styles.layoutGrid}>
            <div className={styles.previewContainer}>
              <canvas ref={canvasRef} className={styles.canvas} />
              <button
                onClick={() => {
                  setImageFile(null);
                  setImgElement(null);
                }}
                style={{ marginTop: '1rem', background: 'none', border: 'none', color: '#ef4444', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }}
              >
                Change Photo
              </button>
            </div>

            <div>
              <div style={{ marginBottom: '0.75rem', fontSize: '0.8125rem', fontWeight: 700, color: '#44403c' }}>
                Preset Looks
              </div>
              <div className={styles.presetsGrid}>
                {PRESETS.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => applyPreset(p)}
                    className={`${styles.presetBtn} ${selectedPreset === p.id ? styles.presetBtnActive : ''}`}
                  >
                    {p.name}
                  </button>
                ))}
              </div>

              <div style={{ marginBottom: '0.75rem', fontSize: '0.8125rem', fontWeight: 700, color: '#44403c' }}>
                Fine-Tune Sliders
              </div>

              <div className={styles.sliderRow}>
                <div className={styles.sliderLabel}><span>Grayscale (B&W)</span><span>{grayscale}%</span></div>
                <input type="range" min="0" max="100" value={grayscale} onChange={(e) => setGrayscale(Number(e.target.value))} className={styles.slider} />
              </div>

              <div className={styles.sliderRow}>
                <div className={styles.sliderLabel}><span>Contrast</span><span>{contrast}%</span></div>
                <input type="range" min="50" max="200" value={contrast} onChange={(e) => setContrast(Number(e.target.value))} className={styles.slider} />
              </div>

              <div className={styles.sliderRow}>
                <div className={styles.sliderLabel}><span>Brightness</span><span>{brightness}%</span></div>
                <input type="range" min="50" max="180" value={brightness} onChange={(e) => setBrightness(Number(e.target.value))} className={styles.slider} />
              </div>

              <div className={styles.sliderRow}>
                <div className={styles.sliderLabel}><span>Vintage Sepia</span><span>{sepia}%</span></div>
                <input type="range" min="0" max="100" value={sepia} onChange={(e) => setSepia(Number(e.target.value))} className={styles.slider} />
              </div>

              <div className={styles.sliderRow}>
                <div className={styles.sliderLabel}><span>Saturation</span><span>{saturation}%</span></div>
                <input type="range" min="0" max="250" value={saturation} onChange={(e) => setSaturation(Number(e.target.value))} className={styles.slider} />
              </div>

              <div className={styles.sliderRow}>
                <div className={styles.sliderLabel}><span>Blur Effect</span><span>{blur}px</span></div>
                <input type="range" min="0" max="10" value={blur} onChange={(e) => setBlur(Number(e.target.value))} className={styles.slider} />
              </div>

              <button onClick={downloadFilteredImage} className={styles.downloadBtn}>
                <Download style={{ width: '1.1rem', height: '1.1rem' }} />
                <span>Download Enhanced Photo</span>
              </button>
            </div>
          </div>
        )}
      </div>

      <AdBanner format="horizontal" />
    </div>
  );
}
