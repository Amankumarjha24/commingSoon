'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { UploadCloud, Sparkles, UserCheck, Download, Palette, RefreshCw } from 'lucide-react';
import AdBanner from '@/components/AdBanner';
import styles from './page.module.css';

const RING_PRESETS = [
  { id: 'insta', name: 'Instagram Sunset', colors: ['#f09433', '#e6683c', '#dc2743', '#cc2366', '#bc1888'] },
  { id: 'cyber', name: 'Neon Cyberpunk', colors: ['#06b6d4', '#3b82f6', '#8b5cf6'] },
  { id: 'gold', name: 'Royal Gold', colors: ['#f59e0b', '#fbbf24', '#d97706'] },
  { id: 'emerald', name: 'Emerald Glow', colors: ['#10b981', '#059669', '#34d399'] },
  { id: 'fire', name: 'Flame Red', colors: ['#ef4444', '#f97316', '#e11d48'] },
  { id: 'dark', name: 'Minimal Dark', colors: ['#3f3f46', '#27272a', '#18181b'] },
  { id: 'white', name: 'Clean White', colors: ['#ffffff', '#f4f4f5'] },
  { id: 'none', name: 'No Border', colors: ['transparent', 'transparent'] },
];

export default function ProfilePhotoMakerPage() {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imgElement, setImgElement] = useState<HTMLImageElement | null>(null);
  const [selectedRing, setSelectedRing] = useState<string>('insta');
  const [borderWidth, setBorderWidth] = useState<number>(10);
  const [zoom, setZoom] = useState<number>(1);
  const [badge, setBadge] = useState<'none' | 'verified' | 'star' | 'online'>('verified');
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

  useEffect(() => {
    if (!imgElement || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const size = 600;
    canvas.width = size;
    canvas.height = size;
    ctx.clearRect(0, 0, size, size);

    const center = size / 2;
    const radius = center - borderWidth - 4;

    // 1. Draw Ring Border if not 'none'
    const preset = RING_PRESETS.find((r) => r.id === selectedRing);
    if (preset && preset.id !== 'none' && borderWidth > 0) {
      const grad = ctx.createLinearGradient(0, 0, size, size);
      preset.colors.forEach((c, idx) => {
        grad.addColorStop(idx / (preset.colors.length - 1), c);
      });
      ctx.beginPath();
      ctx.arc(center, center, center - borderWidth / 2, 0, Math.PI * 2);
      ctx.strokeStyle = grad;
      ctx.lineWidth = borderWidth * 2;
      ctx.stroke();
    }

    // 2. Circular Clip for Photo
    ctx.save();
    ctx.beginPath();
    ctx.arc(center, center, radius, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip();

    // 3. Draw Image with Zoom and Centering
    const aspect = imgElement.width / imgElement.height;
    let drawWidth = radius * 2 * zoom;
    let drawHeight = (radius * 2 * zoom) / aspect;

    if (aspect < 1) {
      drawHeight = radius * 2 * zoom;
      drawWidth = radius * 2 * zoom * aspect;
    }

    const x = center - drawWidth / 2;
    const y = center - drawHeight / 2;
    ctx.drawImage(imgElement, x, y, drawWidth, drawHeight);
    ctx.restore();

    // 4. Draw Badges
    const badgeRadius = 32;
    const badgeX = center + radius * 0.7;
    const badgeY = center + radius * 0.7;

    if (badge === 'verified') {
      ctx.beginPath();
      ctx.arc(badgeX, badgeY, badgeRadius, 0, Math.PI * 2);
      ctx.fillStyle = '#0284c7';
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 5;
      ctx.stroke();

      // Checkmark
      ctx.beginPath();
      ctx.moveTo(badgeX - 12, badgeY);
      ctx.lineTo(badgeX - 3, badgeY + 10);
      ctx.lineTo(badgeX + 13, badgeY - 8);
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 6;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.stroke();
    } else if (badge === 'star') {
      ctx.beginPath();
      ctx.arc(badgeX, badgeY, badgeRadius, 0, Math.PI * 2);
      ctx.fillStyle = '#f59e0b';
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 5;
      ctx.stroke();

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 30px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('★', badgeX, badgeY + 2);
    } else if (badge === 'online') {
      ctx.beginPath();
      ctx.arc(badgeX, badgeY, badgeRadius * 0.75, 0, Math.PI * 2);
      ctx.fillStyle = '#10b981';
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 5;
      ctx.stroke();
    }
  }, [imgElement, selectedRing, borderWidth, zoom, badge]);

  const downloadAvatar = () => {
    if (!canvasRef.current) return;
    const link = document.createElement('a');
    link.download = `avatar-${Date.now()}.png`;
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
        <span className={styles.breadcrumbActive}>Profile Photo Maker</span>
      </div>

      <div className={styles.headerContainer}>
        <h1 className={styles.title}>
          <span className={styles.iconWrapper}>👤</span>
          Profile Photo Maker & Circle Crop
        </h1>
        <p className={styles.subtitle}>
          Create eye-catching circular avatars with gradient border rings, verified badges, and high-res transparent PNG download.
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
            <div className={styles.dropText}>Choose a Photo to Create Avatar</div>
            <div className={styles.dropSub}>JPG, PNG, WebP supported (100% Client-Side Privacy)</div>
          </label>
        ) : (
          <div className={styles.studioLayout}>
            {/* Left: Canvas Preview */}
            <div className={styles.previewSide}>
              <div className={styles.canvasWrapper}>
                <canvas ref={canvasRef} className={styles.canvas} />
              </div>
              <button
                onClick={() => {
                  setImageFile(null);
                  setImgElement(null);
                }}
                style={{ marginTop: '1.25rem', background: 'none', border: 'none', color: '#ef4444', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }}
              >
                Change Photo
              </button>
            </div>

            {/* Right: Controls */}
            <div className={styles.controlsSide}>
              <div className={styles.controlGroup}>
                <label className={styles.label}>Border Ring Gradient Style</label>
                <div className={styles.ringPresetGrid}>
                  {RING_PRESETS.map((p) => {
                    const bg = p.id === 'none' ? '#e5e7eb' : `linear-gradient(135deg, ${p.colors.join(', ')})`;
                    return (
                      <button
                        key={p.id}
                        onClick={() => setSelectedRing(p.id)}
                        className={`${styles.ringBtn} ${selectedRing === p.id ? styles.ringBtnActive : ''}`}
                        style={{ background: bg }}
                        title={p.name}
                      />
                    );
                  })}
                </div>
              </div>

              <div className={styles.controlGroup}>
                <label className={styles.label}>Border Thickness: {borderWidth}px</label>
                <input
                  type="range"
                  min="0"
                  max="20"
                  value={borderWidth}
                  onChange={(e) => setBorderWidth(Number(e.target.value))}
                  className={styles.sliderInput}
                />
              </div>

              <div className={styles.controlGroup}>
                <label className={styles.label}>Photo Zoom: {(zoom * 100).toFixed(0)}%</label>
                <input
                  type="range"
                  min="0.8"
                  max="2.5"
                  step="0.05"
                  value={zoom}
                  onChange={(e) => setZoom(Number(e.target.value))}
                  className={styles.sliderInput}
                />
              </div>

              <div className={styles.controlGroup}>
                <label className={styles.label}>Profile Badge Overlay</label>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  {[
                    { id: 'verified', label: 'Verified ✓' },
                    { id: 'star', label: 'Star ★' },
                    { id: 'online', label: 'Online •' },
                    { id: 'none', label: 'None' },
                  ].map((b) => (
                    <button
                      key={b.id}
                      onClick={() => setBadge(b.id as any)}
                      style={{
                        flex: 1,
                        padding: '0.5rem',
                        borderRadius: '0.65rem',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        border: '1px solid',
                        borderColor: badge === b.id ? '#7c3aed' : '#d6d3d1',
                        backgroundColor: badge === b.id ? '#ede9fe' : 'transparent',
                        color: badge === b.id ? '#6d28d9' : '#57534e',
                        cursor: 'pointer',
                      }}
                    >
                      {b.label}
                    </button>
                  ))}
                </div>
              </div>

              <button onClick={downloadAvatar} className={styles.downloadBtn}>
                <Download style={{ width: '1.1rem', height: '1.1rem' }} />
                <span>Download High-Res Round PNG</span>
              </button>
            </div>
          </div>
        )}
      </div>

      <AdBanner format="horizontal" />
    </div>
  );
}
