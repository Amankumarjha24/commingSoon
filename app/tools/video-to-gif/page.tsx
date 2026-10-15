'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { UploadCloud, Film, Download, CheckCircle, RefreshCw } from 'lucide-react';
import JSZip from 'jszip';
import AdBanner from '@/components/AdBanner';
import styles from './page.module.css';

// Quantize an RGBA frame to a power-of-2 indexed color palette for omggif
function quantizeFrame(rgbaData: Uint8ClampedArray, width: number, height: number) {
  const palette: number[] = [];
  const colorMap = new Map<number, number>();
  const pixels = new Uint8Array(width * height);

  for (let i = 0; i < width * height; i++) {
    const offset = i * 4;
    // Quantize 5 bits per channel (32 levels per channel = 32768 total shades)
    const r = rgbaData[offset] & 0xf8;
    const g = rgbaData[offset + 1] & 0xf8;
    const b = rgbaData[offset + 2] & 0xf8;
    const key = (r << 16) | (g << 8) | b;

    let idx = colorMap.get(key);
    if (idx === undefined) {
      if (palette.length < 256) {
        idx = palette.length;
        palette.push(key);
        colorMap.set(key, idx);
      } else {
        idx = 0;
      }
    }
    pixels[i] = idx;
  }

  // omggif requires power-of-2 palette length between 2 and 256
  let pLen = 2;
  while (pLen < palette.length && pLen < 256) {
    pLen *= 2;
  }
  while (palette.length < pLen) {
    palette.push(0);
  }

  return { palette, pixels };
}

export default function VideoToGifPage() {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [progressMsg, setProgressMsg] = useState<string>('');
  const [fps, setFps] = useState<number>(10);
  const [maxDuration, setMaxDuration] = useState<number>(5);
  const [resolution, setResolution] = useState<number>(360);
  const [zipUrl, setZipUrl] = useState<string | null>(null);
  const [gifUrl, setGifUrl] = useState<string | null>(null);
  const [previewFrameUrl, setPreviewFrameUrl] = useState<string | null>(null);
  const [totalFrames, setTotalFrames] = useState<number>(0);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setVideoFile(file);
      setVideoUrl(URL.createObjectURL(file));
      setZipUrl(null);
      setGifUrl(null);
      setPreviewFrameUrl(null);
    }
  };

  const handleConvertToGif = async () => {
    if (!videoFile || !videoRef.current) return;
    setIsProcessing(true);
    setProgressMsg('Analyzing Video Stream & Frame Timings...');

    try {
      const video = videoRef.current;
      video.muted = true;
      video.currentTime = 0;

      const duration = Math.min(video.duration || 5, maxDuration);
      const interval = 1 / fps;
      const frameCount = Math.floor(duration * fps);
      setTotalFrames(frameCount);

      const canvas = document.createElement('canvas');
      const aspect = (video.videoWidth || 16) / (video.videoHeight || 9);
      canvas.width = resolution;
      canvas.height = Math.round(resolution / aspect);
      const ctx = canvas.getContext('2d');

      const omggifModule = await import('omggif');
      const omggif = (omggifModule as any).default || omggifModule;
      const gifBuffer = new Uint8Array(canvas.width * canvas.height * frameCount + 131072);
      const gifWriter = new omggif.GifWriter(gifBuffer, canvas.width, canvas.height, { loop: 0 });

      const zip = new JSZip();
      let captured = 0;

      for (let t = 0; t < duration; t += interval) {
        video.currentTime = t;
        await new Promise((r) => {
          video.onseeked = () => r(null);
        });

        ctx?.drawImage(video, 0, 0, canvas.width, canvas.height);

        // Add to animated GIF
        const imgData = ctx?.getImageData(0, 0, canvas.width, canvas.height);
        if (imgData) {
          const { palette, pixels } = quantizeFrame(imgData.data, canvas.width, canvas.height);
          gifWriter.addFrame(0, 0, canvas.width, canvas.height, pixels, {
            palette,
            delay: Math.round(100 / fps),
          });
        }

        // Add PNG frame to ZIP
        const blob = await new Promise<Blob | null>((res) => canvas.toBlob(res, 'image/png'));
        if (blob) {
          captured++;
          const pad = String(captured).padStart(4, '0');
          zip.file(`frame_${pad}.png`, blob);
          if (captured === 1) {
            setPreviewFrameUrl(URL.createObjectURL(blob));
          }
        }
        setProgressMsg(`Encoding Frames: ${captured}/${frameCount} (${Math.round((captured / frameCount) * 100)}%)...`);
      }

      setProgressMsg('Finalizing Real Animated GIF...');
      const gifLength = gifWriter.end();
      const realGifBlob = new Blob([gifBuffer.slice(0, gifLength)], { type: 'image/gif' });
      setGifUrl(URL.createObjectURL(realGifBlob));

      const zipBlob = await zip.generateAsync({ type: 'blob' });
      setZipUrl(URL.createObjectURL(zipBlob));
    } catch (err: any) {
      console.error(err);
      alert('Error converting video: ' + err.message);
    } finally {
      setIsProcessing(false);
      setProgressMsg('');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.breadcrumb}>
        <Link href="/" className={styles.breadcrumbLink}>Home</Link>
        <span>/</span>
        <Link href="/?category=video#tools-section" className={styles.breadcrumbLink}>Video & Audio</Link>
        <span>/</span>
        <span className={styles.breadcrumbActive}>Video ↔ GIF Converter</span>
      </div>

      <div className={styles.headerContainer}>
        <h1 className={styles.title}>
          <span className={styles.iconWrapper}>🎞️</span>
          Video ↔ Animated GIF Converter
        </h1>
        <p className={styles.subtitle}>
          Turn videos into real looping animated GIF files and frame sequences with customized FPS, resolution, and zero server uploads.
        </p>
      </div>

      <div className={styles.card}>
        {!videoFile ? (
          <label className={styles.dropzone}>
            <input
              type="file"
              accept="video/*"
              onChange={handleVideoUpload}
              style={{ display: 'none' }}
            />
            <UploadCloud className={styles.dropIcon} />
            <div className={styles.dropText}>Choose a Video File to Convert to GIF</div>
            <div className={styles.dropSub}>MP4, WebM, MOV supported (100% Client-Side In-Browser)</div>
          </label>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: '0.875rem', fontWeight: 800, color: '#1c1917' }}>{videoFile.name}</div>
                <div style={{ fontSize: '0.75rem', color: '#78716c' }}>{(videoFile.size / (1024 * 1024)).toFixed(1)} MB</div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setVideoFile(null);
                  setVideoUrl(null);
                  setZipUrl(null);
                  setGifUrl(null);
                }}
                style={{ background: 'none', border: 'none', color: '#ef4444', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }}
              >
                Change Video
              </button>
            </div>

            <video
              ref={videoRef}
              src={videoUrl || ''}
              controls
              style={{ width: '100%', maxHeight: '280px', borderRadius: '0.75rem', backgroundColor: '#000000' }}
            />

            <div className={styles.controlsGrid}>
              <div className={styles.controlBox}>
                <label className={styles.controlLabel}>Frame Rate (FPS)</label>
                <select
                  value={fps}
                  onChange={(e) => setFps(Number(e.target.value))}
                  className={styles.controlSelect}
                >
                  <option value={8}>8 FPS (Compact File)</option>
                  <option value={10}>10 FPS (Recommended)</option>
                  <option value={15}>15 FPS (Smooth Motion)</option>
                </select>
              </div>

              <div className={styles.controlBox}>
                <label className={styles.controlLabel}>Max Clip Duration</label>
                <select
                  value={maxDuration}
                  onChange={(e) => setMaxDuration(Number(e.target.value))}
                  className={styles.controlSelect}
                >
                  <option value={3}>First 3 Seconds</option>
                  <option value={5}>First 5 Seconds (Standard)</option>
                  <option value={8}>First 8 Seconds</option>
                </select>
              </div>

              <div className={styles.controlBox}>
                <label className={styles.controlLabel}>Resolution Scale</label>
                <select
                  value={resolution}
                  onChange={(e) => setResolution(Number(e.target.value))}
                  className={styles.controlSelect}
                >
                  <option value={320}>320px (Lightweight)</option>
                  <option value={400}>400px (Standard)</option>
                  <option value={480}>480px (High Quality)</option>
                </select>
              </div>
            </div>

            {!gifUrl && (
              <button
                type="button"
                onClick={handleConvertToGif}
                disabled={isProcessing}
                className={styles.convertBtn}
              >
                {isProcessing ? (
                  <>
                    <RefreshCw className="animate-spin" style={{ width: '1.1rem', height: '1.1rem' }} />
                    <span>{progressMsg || 'Encoding Real GIF...'}</span>
                  </>
                ) : (
                  <>
                    <Film style={{ width: '1.1rem', height: '1.1rem' }} />
                    <span>Generate Animated GIF</span>
                  </>
                )}
              </button>
            )}

            {gifUrl && (
              <div className={styles.resultBox} style={{ marginTop: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#4338ca', fontWeight: 800 }}>
                  <CheckCircle style={{ width: '1.25rem', height: '1.25rem' }} />
                  <span>Real Animated GIF Ready! ({totalFrames} frames encoded)</span>
                </div>

                <img
                  src={gifUrl}
                  alt="Animated GIF Preview"
                  style={{ maxWidth: '320px', borderRadius: '0.75rem', border: '2px solid #6366f1' }}
                />

                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', width: '100%', justifyContent: 'center' }}>
                  <a
                    href={gifUrl}
                    download={`${videoFile.name.replace(/\.[^/.]+$/, '')}-animated.gif`}
                    className={styles.downloadBtn}
                    style={{ flex: '1 1 200px', textAlign: 'center' }}
                  >
                    <Download style={{ width: '1.1rem', height: '1.1rem' }} />
                    <span>Download Animated .GIF File</span>
                  </a>

                  {zipUrl && (
                    <a
                      href={zipUrl}
                      download={`${videoFile.name.replace(/\.[^/.]+$/, '')}-gif-frames.zip`}
                      className={styles.downloadBtn}
                      style={{ flex: '1 1 200px', background: '#4f46e5', textAlign: 'center' }}
                    >
                      <Download style={{ width: '1.1rem', height: '1.1rem' }} />
                      <span>Download Frames (.ZIP)</span>
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <AdBanner format="horizontal" />
    </div>
  );
}
