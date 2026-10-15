'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { UploadCloud, Sparkles, LayoutGrid, Download, Plus, Trash2 } from 'lucide-react';
import AdBanner from '@/components/AdBanner';
import styles from './page.module.css';

export default function CombineImagesPage() {
  const [images, setImages] = useState<{ id: string; img: HTMLImageElement; name: string }[]>([]);
  const [layout, setLayout] = useState<'horizontal' | 'vertical' | 'grid'>('grid');
  const [gap, setGap] = useState<number>(12);
  const [bgColor, setBgColor] = useState<string>('#ffffff');
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const handleImagesUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      Array.from(files).forEach((file) => {
        const img = new Image();
        img.onload = () => {
          setImages((prev) => [...prev, { id: Math.random().toString(), img, name: file.name }]);
        };
        img.src = URL.createObjectURL(file);
      });
    }
  };

  useEffect(() => {
    if (images.length === 0 || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const targetSize = 400; // Normalized cell size

    if (layout === 'horizontal') {
      canvas.width = images.length * targetSize + (images.length + 1) * gap;
      canvas.height = targetSize + gap * 2;
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      images.forEach((item, idx) => {
        const x = gap + idx * (targetSize + gap);
        const y = gap;
        ctx.drawImage(item.img, x, y, targetSize, targetSize);
      });
    } else if (layout === 'vertical') {
      canvas.width = targetSize + gap * 2;
      canvas.height = images.length * targetSize + (images.length + 1) * gap;
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      images.forEach((item, idx) => {
        const x = gap;
        const y = gap + idx * (targetSize + gap);
        ctx.drawImage(item.img, x, y, targetSize, targetSize);
      });
    } else {
      // Grid mode (2 columns or 3 columns)
      const cols = images.length > 4 ? 3 : 2;
      const rows = Math.ceil(images.length / cols);
      canvas.width = cols * targetSize + (cols + 1) * gap;
      canvas.height = rows * targetSize + (rows + 1) * gap;
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      images.forEach((item, idx) => {
        const col = idx % cols;
        const row = Math.floor(idx / cols);
        const x = gap + col * (targetSize + gap);
        const y = gap + row * (targetSize + gap);
        ctx.drawImage(item.img, x, y, targetSize, targetSize);
      });
    }
  }, [images, layout, gap, bgColor]);

  const downloadCombined = () => {
    if (!canvasRef.current) return;
    const link = document.createElement('a');
    link.download = `combined-collage-${Date.now()}.png`;
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
        <span className={styles.breadcrumbActive}>Combine Images & Collage</span>
      </div>

      <div className={styles.headerContainer}>
        <h1 className={styles.title}>
          <span className={styles.iconWrapper}>🖼️</span>
          Combine Images & Collage Maker
        </h1>
        <p className={styles.subtitle}>
          Combine multiple photos side-by-side, vertical stack, or in grid collages with custom borders and spacing.
        </p>
      </div>

      <div className={styles.card}>
        {images.length === 0 ? (
          <label className={styles.dropzone}>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImagesUpload}
              style={{ display: 'none' }}
            />
            <UploadCloud className={styles.dropIcon} />
            <div className={styles.dropText}>Choose Images to Combine</div>
            <div className={styles.dropSub}>Select 2 or more photos (JPG, PNG, WebP)</div>
          </label>
        ) : (
          <div className={styles.studioGrid}>
            <div className={styles.canvasWrapper}>
              <canvas ref={canvasRef} className={styles.canvas} />
              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem', alignItems: 'center' }}>
                <label style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', color: '#65a30d', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }}>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImagesUpload}
                    style={{ display: 'none' }}
                  />
                  <Plus style={{ width: '0.9rem', height: '0.9rem' }} />
                  <span>Add More Photos ({images.length})</span>
                </label>
                <button
                  onClick={() => setImages([])}
                  style={{ background: 'none', border: 'none', color: '#ef4444', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }}
                >
                  Clear All
                </button>
              </div>
            </div>

            <div>
              <div className={styles.controlGroup}>
                <label className={styles.label}>Collage Layout</label>
                <div className={styles.layoutButtons}>
                  <button
                    onClick={() => setLayout('grid')}
                    className={`${styles.layoutBtn} ${layout === 'grid' ? styles.layoutBtnActive : ''}`}
                  >
                    Grid (2x2 / 3x3)
                  </button>
                  <button
                    onClick={() => setLayout('horizontal')}
                    className={`${styles.layoutBtn} ${layout === 'horizontal' ? styles.layoutBtnActive : ''}`}
                  >
                    Side-by-Side (Strip)
                  </button>
                  <button
                    onClick={() => setLayout('vertical')}
                    className={`${styles.layoutBtn} ${layout === 'vertical' ? styles.layoutBtnActive : ''}`}
                  >
                    Vertical Stack
                  </button>
                </div>
              </div>

              <div className={styles.controlGroup}>
                <label className={styles.label}>Spacing / Gap: {gap}px</label>
                <input
                  type="range"
                  min="0"
                  max="40"
                  value={gap}
                  onChange={(e) => setGap(Number(e.target.value))}
                  style={{ accentColor: '#65a30d', cursor: 'pointer' }}
                />
              </div>

              <div className={styles.controlGroup}>
                <label className={styles.label}>Background Border Color</label>
                <input
                  type="color"
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                  style={{ width: '100%', height: '2.5rem', borderRadius: '0.5rem', border: '1px solid #d6d3d1', cursor: 'pointer' }}
                />
              </div>

              <button onClick={downloadCombined} className={styles.downloadBtn}>
                <Download style={{ width: '1.1rem', height: '1.1rem' }} />
                <span>Download Combined Collage</span>
              </button>
            </div>
          </div>
        )}
      </div>

      <AdBanner format="horizontal" />
    </div>
  );
}
