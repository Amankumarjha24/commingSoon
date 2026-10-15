'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { UploadCloud, Sparkles, Smile, Download, Type } from 'lucide-react';
import AdBanner from '@/components/AdBanner';
import styles from './page.module.css';

export default function MemeMakerPage() {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imgElement, setImgElement] = useState<HTMLImageElement | null>(null);
  const [topText, setTopText] = useState<string>('WHEN THE CODE WORKS');
  const [bottomText, setBottomText] = useState<string>('ON THE FIRST RUN');
  const [fontSize, setFontSize] = useState<number>(42);
  const [textColor, setTextColor] = useState<string>('#ffffff');
  const [strokeColor, setStrokeColor] = useState<string>('#000000');
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
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (imgElement) {
      canvas.width = imgElement.width;
      canvas.height = imgElement.height;
      ctx.drawImage(imgElement, 0, 0);
    } else {
      // Default placeholder meme canvas
      canvas.width = 600;
      canvas.height = 600;
      ctx.fillStyle = '#1e1b4b';
      ctx.fillRect(0, 0, 600, 600);
      ctx.font = '80px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('🎭', 300, 320);
    }

    // Configure Meme Text Styles
    ctx.textAlign = 'center';
    ctx.font = `900 ${fontSize}px Impact, Arial, sans-serif`;
    ctx.fillStyle = textColor;
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = Math.max(3, fontSize / 10);
    ctx.lineJoin = 'miter';
    ctx.miterLimit = 2;

    // Draw Top Text
    if (topText) {
      ctx.textBaseline = 'top';
      ctx.strokeText(topText.toUpperCase(), canvas.width / 2, 24);
      ctx.fillText(topText.toUpperCase(), canvas.width / 2, 24);
    }

    // Draw Bottom Text
    if (bottomText) {
      ctx.textBaseline = 'bottom';
      ctx.strokeText(bottomText.toUpperCase(), canvas.width / 2, canvas.height - 24);
      ctx.fillText(bottomText.toUpperCase(), canvas.width / 2, canvas.height - 24);
    }
  }, [imgElement, topText, bottomText, fontSize, textColor, strokeColor]);

  const downloadMeme = () => {
    if (!canvasRef.current) return;
    const link = document.createElement('a');
    link.download = `meme-${Date.now()}.png`;
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
        <span className={styles.breadcrumbActive}>Meme Maker & Captioner</span>
      </div>

      <div className={styles.headerContainer}>
        <h1 className={styles.title}>
          <span className={styles.iconWrapper}>🎭</span>
          Meme Maker & Image Captioner
        </h1>
        <p className={styles.subtitle}>
          Add classic top & bottom meme captions, custom stroke styling, and export crisp memes in 1 click.
        </p>
      </div>

      <div className={styles.card}>
        <div className={styles.studioGrid}>
          <div className={styles.canvasWrapper}>
            <canvas ref={canvasRef} className={styles.canvas} />
            {imageFile ? (
              <button
                onClick={() => {
                  setImageFile(null);
                  setImgElement(null);
                }}
                style={{ marginTop: '1rem', background: 'none', border: 'none', color: '#ef4444', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }}
              >
                Change Image
              </button>
            ) : (
              <label style={{ marginTop: '1rem', display: 'inline-flex', alignItems: 'center', gap: '0.35rem', color: '#e11d48', fontSize: '0.8125rem', fontWeight: 700, cursor: 'pointer' }}>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  style={{ display: 'none' }}
                />
                <UploadCloud style={{ width: '1.1rem', height: '1.1rem' }} />
                <span>Upload Custom Photo for Meme</span>
              </label>
            )}
          </div>

          <div className={styles.formBox}>
            <div className={styles.inputGroup}>
              <label className={styles.label}>Top Caption</label>
              <input
                type="text"
                value={topText}
                onChange={(e) => setTopText(e.target.value)}
                placeholder="WHEN THE CODE RUNS..."
                className={styles.textInput}
              />
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label}>Bottom Caption</label>
              <input
                type="text"
                value={bottomText}
                onChange={(e) => setBottomText(e.target.value)}
                placeholder="WITHOUT ANY BUGS..."
                className={styles.textInput}
              />
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label}>Font Size: {fontSize}px</label>
              <input
                type="range"
                min="20"
                max="90"
                value={fontSize}
                onChange={(e) => setFontSize(Number(e.target.value))}
                style={{ accentColor: '#e11d48', cursor: 'pointer' }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className={styles.inputGroup}>
                <label className={styles.label}>Text Color</label>
                <input
                  type="color"
                  value={textColor}
                  onChange={(e) => setTextColor(e.target.value)}
                  style={{ width: '100%', height: '2.5rem', borderRadius: '0.5rem', border: '1px solid #d6d3d1', cursor: 'pointer' }}
                />
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.label}>Outline Color</label>
                <input
                  type="color"
                  value={strokeColor}
                  onChange={(e) => setStrokeColor(e.target.value)}
                  style={{ width: '100%', height: '2.5rem', borderRadius: '0.5rem', border: '1px solid #d6d3d1', cursor: 'pointer' }}
                />
              </div>
            </div>

            <button onClick={downloadMeme} className={styles.downloadBtn}>
              <Download style={{ width: '1.1rem', height: '1.1rem' }} />
              <span>Download Meme PNG</span>
            </button>
          </div>
        </div>
      </div>

      <AdBanner format="horizontal" />
    </div>
  );
}
