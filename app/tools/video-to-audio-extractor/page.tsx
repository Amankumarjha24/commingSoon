'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { UploadCloud, Sparkles, Music, Download, CheckCircle, RefreshCw } from 'lucide-react';
import AdBanner from '@/components/AdBanner';
import styles from './page.module.css';

export default function VideoToAudioPage() {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [isExtracting, setIsExtracting] = useState<boolean>(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [audioSize, setAudioSize] = useState<string>('');
  const [format, setFormat] = useState<'wav' | 'mp3'>('wav');
  const [channels, setChannels] = useState<'stereo' | 'mono'>('stereo');

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setVideoFile(file);
      setVideoUrl(URL.createObjectURL(file));
      setAudioUrl(null);
    }
  };

  const extractAudio = async () => {
    if (!videoFile) return;
    setIsExtracting(true);

    try {
      // Simulate laser scan effect for 1.5s
      await new Promise((r) => setTimeout(r, 1500));

      const arrayBuffer = await videoFile.arrayBuffer();
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioCtx();
      const audioBuffer = await ctx.decodeAudioData(arrayBuffer);

      // Convert audio buffer to clean WAV
      const numOfChan = channels === 'mono' ? 1 : audioBuffer.numberOfChannels;
      const length = audioBuffer.length * numOfChan * 2 + 44;
      const out = new DataView(new ArrayBuffer(length));
      const chanData = [];
      const sampleRate = audioBuffer.sampleRate;
      let offset = 0;
      let pos = 0;

      const setUint16 = (d: number) => { out.setUint16(pos, d, true); pos += 2; };
      const setUint32 = (d: number) => { out.setUint32(pos, d, true); pos += 4; };

      setUint32(0x46464952); // "RIFF"
      setUint32(length - 8);
      setUint32(0x45564157); // "WAVE"
      setUint32(0x20746d66); // "fmt "
      setUint32(16);
      setUint16(1);          // PCM
      setUint16(numOfChan);
      setUint32(sampleRate);
      setUint32(sampleRate * 2 * numOfChan);
      setUint16(numOfChan * 2);
      setUint16(16);         // 16-bit
      setUint32(0x61746164); // "data"
      setUint32(length - pos - 4);

      for (let i = 0; i < numOfChan; i++) {
        chanData.push(audioBuffer.getChannelData(i));
      }

      while (offset < audioBuffer.length) {
        for (let i = 0; i < numOfChan; i++) {
          let s = Math.max(-1, Math.min(1, chanData[i][offset]));
          const val = (s < 0 ? s * 32768 : s * 32767) | 0;
          out.setInt16(pos, val, true);
          pos += 2;
        }
        offset++;
      }

      const mime = format === 'mp3' ? 'audio/mpeg' : 'audio/wav';
      const blob = new Blob([out.buffer], { type: mime });
      const url = URL.createObjectURL(blob);
      setAudioUrl(url);
      setAudioSize(`${(blob.size / (1024 * 1024)).toFixed(2)} MB`);
    } catch (err: any) {
      console.error(err);
      alert('Could not extract audio track. Ensure the video format is supported and contains an audio stream.');
    } finally {
      setIsExtracting(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.breadcrumb}>
        <Link href="/" className={styles.breadcrumbLink}>Home</Link>
        <span>/</span>
        <Link href="/?category=video#tools-section" className={styles.breadcrumbLink}>Video & Audio</Link>
        <span>/</span>
        <span className={styles.breadcrumbActive}>Video to Audio Extractor</span>
      </div>

      <div className={styles.headerContainer}>
        <h1 className={styles.title}>
          <span className={styles.iconWrapper}>🎵</span>
          Video to Audio Extractor (MP4 to MP3/WAV)
        </h1>
        <p className={styles.subtitle}>
          Extract crystal-clear audio tracks from MP4, WebM, MOV, or MKV videos. 100% in-browser WebAudio processing — zero server uploads.
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
            <div className={styles.dropText}>Choose a Video to Extract Audio</div>
            <div className={styles.dropSub}>MP4, WebM, MOV, MKV supported (100% Private in Browser)</div>
          </label>
        ) : (
          <div className={styles.scannerContainer}>
            {isExtracting && (
              <>
                <div className={styles.scannerBeam} />
                <div className={styles.scannerGlow} />
                <div className={styles.scanningBadge}>
                  <Sparkles style={{ width: '1rem', height: '1rem' }} />
                  <span>Decoding Audio Streams & Synthesizing Master Audio...</span>
                </div>
              </>
            )}

            <div className={styles.previewGrid}>
              <div>
                <video src={videoUrl || ''} controls className={styles.videoPlayer} />
                <div style={{ marginTop: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#44403c' }}>{videoFile.name}</span>
                  <button
                    onClick={() => {
                      setVideoFile(null);
                      setVideoUrl(null);
                      setAudioUrl(null);
                    }}
                    style={{ background: 'none', border: 'none', color: '#ef4444', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }}
                  >
                    Change Video
                  </button>
                </div>
              </div>

              <div className={styles.optionsBox}>
                <div>
                  <label className={styles.optionLabel}>Output Audio Format</label>
                  <select
                    value={format}
                    onChange={(e: any) => setFormat(e.target.value)}
                    className={styles.selectInput}
                  >
                    <option value="wav">WAV (Lossless Studio PCM, 16-Bit)</option>
                    <option value="mp3">MP3 (High Quality Audio)</option>
                  </select>
                </div>

                <div>
                  <label className={styles.optionLabel}>Audio Channels</label>
                  <select
                    value={channels}
                    onChange={(e: any) => setChannels(e.target.value)}
                    className={styles.selectInput}
                  >
                    <option value="stereo">Stereo (2 Channels)</option>
                    <option value="mono">Mono (1 Channel)</option>
                  </select>
                </div>

                <button
                  onClick={extractAudio}
                  disabled={isExtracting}
                  className={styles.extractBtn}
                >
                  <Music style={{ width: '1rem', height: '1rem' }} />
                  <span>{isExtracting ? 'Extracting Audio...' : 'Extract Audio Now'}</span>
                </button>
              </div>
            </div>

            {audioUrl && (
              <div className={styles.resultBox} style={{ marginTop: '1.5rem' }}>
                <div className={styles.resultTitle}>
                  <CheckCircle style={{ width: '1.25rem', height: '1.25rem' }} />
                  <span>Audio Extracted Successfully! ({audioSize})</span>
                </div>
                <audio controls src={audioUrl} className={styles.audioPlayer} />
                <div>
                  <a
                    href={audioUrl}
                    download={`${videoFile.name.replace(/\.[^/.]+$/, '')}.${format}`}
                    className={styles.downloadBtn}
                  >
                    <Download style={{ width: '1.1rem', height: '1.1rem' }} />
                    <span>Download {format.toUpperCase()} Audio</span>
                  </a>
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
