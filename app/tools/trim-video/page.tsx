'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { UploadCloud, Sparkles, Scissors, Download, CheckCircle, Play, Pause } from 'lucide-react';
import AdBanner from '@/components/AdBanner';
import styles from './page.module.css';

export default function TrimVideoPage() {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [duration, setDuration] = useState<number>(0);
  const [startTime, setStartTime] = useState<number>(0);
  const [endTime, setEndTime] = useState<number>(0);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [isTrimming, setIsTrimming] = useState<boolean>(false);
  const [trimmedUrl, setTrimmedUrl] = useState<string | null>(null);
  const [progressMsg, setProgressMsg] = useState<string>('');
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setVideoFile(file);
      const url = URL.createObjectURL(file);
      setVideoUrl(url);
      setTrimmedUrl(null);
    }
  };

  const onLoadedMetadata = () => {
    if (videoRef.current) {
      const dur = videoRef.current.duration || 10;
      setDuration(dur);
      setStartTime(0);
      setEndTime(Math.min(dur, 10)); // Default 10s or full
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    const ms = Math.floor((seconds % 1) * 10);
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}.${ms}`;
  };

  const handleTrimVideo = async () => {
    if (!videoFile || !videoRef.current) return;
    if (endTime <= startTime) {
      alert('End time must be greater than start time.');
      return;
    }

    setIsTrimming(true);
    setProgressMsg('Seeking to Start Timestamp...');

    try {
      const video = videoRef.current;
      video.pause();
      video.currentTime = startTime;

      await new Promise((r) => {
        video.onseeked = () => r(null);
      });

      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth || 1280;
      canvas.height = video.videoHeight || 720;
      const ctx = canvas.getContext('2d');

      const stream = canvas.captureStream(30);
      const mime = MediaRecorder.isTypeSupported('video/mp4') ? 'video/mp4' : 'video/webm';
      const recorder = new MediaRecorder(stream, { mimeType: mime });
      const chunks: Blob[] = [];

      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) chunks.push(e.data);
      };

      const recordPromise = new Promise<Blob>((resolve) => {
        recorder.onstop = () => {
          resolve(new Blob(chunks, { type: mime }));
        };
      });

      recorder.start();
      await video.play();

      setProgressMsg('Trimming Video Timeline in Browser...');

      const drawLoop = () => {
        if (video.currentTime >= endTime || video.ended || video.paused) {
          recorder.stop();
          video.pause();
        } else {
          ctx?.drawImage(video, 0, 0, canvas.width, canvas.height);
          requestAnimationFrame(drawLoop);
        }
      };
      drawLoop();

      const trimmedBlob = await recordPromise;
      const url = URL.createObjectURL(trimmedBlob);
      setTrimmedUrl(url);
    } catch (err: any) {
      console.error(err);
      alert('Error trimming video: ' + err.message);
    } finally {
      setIsTrimming(false);
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
        <span className={styles.breadcrumbActive}>Video Trimmer & Cutter</span>
      </div>

      <div className={styles.headerContainer}>
        <h1 className={styles.title}>
          <span className={styles.iconWrapper}>✂️</span>
          Video Trimmer & Cutter
        </h1>
        <p className={styles.subtitle}>
          Trim video clips to exact start & end timestamps. Fast, accurate, client-side browser processing.
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
            <div className={styles.dropText}>Choose a Video to Trim</div>
            <div className={styles.dropSub}>MP4, WebM, MOV supported (Fast Client-Side Slicing)</div>
          </label>
        ) : (
          <div className={styles.scannerContainer}>
            {isTrimming && (
              <>
                <div className={styles.scannerBeam} />
                <div className={styles.scannerGlow} />
                <div className={styles.scanningBadge}>
                  <Sparkles style={{ width: '1rem', height: '1rem' }} />
                  <span>{progressMsg || 'Slicing Video Timeline...'}</span>
                </div>
              </>
            )}

            <div style={{ width: '100%', marginBottom: '1.25rem' }}>
              <video
                ref={videoRef}
                src={videoUrl || ''}
                controls
                playsInline
                onLoadedMetadata={onLoadedMetadata}
                onTimeUpdate={() => {
                  if (videoRef.current) setCurrentTime(videoRef.current.currentTime);
                }}
                style={{ width: '100%', maxHeight: '340px', borderRadius: '1rem', backgroundColor: '#000000' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.75rem', alignItems: 'center' }}>
                <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#44403c' }}>
                  {videoFile.name} • Total Duration: {formatTime(duration)}
                </span>
                <button
                  onClick={() => {
                    setVideoFile(null);
                    setVideoUrl(null);
                    setTrimmedUrl(null);
                  }}
                  style={{ background: 'none', border: 'none', color: '#ef4444', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }}
                >
                  Change Video
                </button>
              </div>
            </div>

            <div className={styles.timelineCard}>
              <div className={styles.timeInputsGrid}>
                <div className={styles.timeInputBox}>
                  <label className={styles.timeLabel}>Start Timestamp (Seconds)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max={duration}
                    value={startTime}
                    onChange={(e) => setStartTime(Math.max(0, Number(e.target.value)))}
                    className={styles.timeInput}
                  />
                  <button
                    onClick={() => setStartTime(currentTime)}
                    style={{ fontSize: '0.75rem', color: '#d97706', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}
                  >
                    Set to Current ({formatTime(currentTime)})
                  </button>
                </div>

                <div className={styles.timeInputBox}>
                  <label className={styles.timeLabel}>End Timestamp (Seconds)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max={duration}
                    value={endTime}
                    onChange={(e) => setEndTime(Math.min(duration, Number(e.target.value)))}
                    className={styles.timeInput}
                  />
                  <button
                    onClick={() => setEndTime(currentTime)}
                    style={{ fontSize: '0.75rem', color: '#d97706', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}
                  >
                    Set to Current ({formatTime(currentTime)})
                  </button>
                </div>
              </div>

              <div style={{ textAlign: 'center', fontSize: '0.8125rem', fontWeight: 700, color: '#d97706' }}>
                Selected Clip Duration: {formatTime(Math.max(0, endTime - startTime))}
              </div>

              {!trimmedUrl && (
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <button
                    onClick={handleTrimVideo}
                    disabled={isTrimming}
                    className={styles.trimBtn}
                  >
                    <Scissors style={{ width: '1.1rem', height: '1.1rem' }} />
                    <span>{isTrimming ? 'Trimming Clip...' : 'Trim & Export Video Clip'}</span>
                  </button>
                </div>
              )}
            </div>

            {trimmedUrl && (
              <div className={styles.resultBox} style={{ marginTop: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#b45309', fontWeight: 800 }}>
                  <CheckCircle style={{ width: '1.25rem', height: '1.25rem' }} />
                  <span>Video Trimmed Successfully!</span>
                </div>
                <video src={trimmedUrl} controls playsInline style={{ maxWidth: '380px', borderRadius: '0.75rem' }} />
                <a
                  href={trimmedUrl}
                  download={`trimmed-${videoFile.name}`}
                  className={styles.downloadBtn}
                >
                  <Download style={{ width: '1.1rem', height: '1.1rem' }} />
                  <span>Download Trimmed Video</span>
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
