'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { UploadCloud, Sparkles, VolumeX, Download, CheckCircle, Video } from 'lucide-react';
import AdBanner from '@/components/AdBanner';
import styles from './page.module.css';

export default function MuteVideoPage() {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [mutedVideoUrl, setMutedVideoUrl] = useState<string | null>(null);
  const [progressMsg, setProgressMsg] = useState<string>('');
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setVideoFile(file);
      setVideoUrl(URL.createObjectURL(file));
      setMutedVideoUrl(null);
    }
  };

  const handleMuteVideo = async () => {
    if (!videoFile || !videoRef.current) return;
    setIsProcessing(true);
    setProgressMsg('Initializing Silent Video Stream...');

    try {
      const video = videoRef.current;
      video.muted = true;
      video.currentTime = 0;

      // Create off-screen canvas to capture pure silent frames
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

      setProgressMsg('Stripping Audio Tracks & Synthesizing Silent Video...');

      const drawFrame = () => {
        if (!video.paused && !video.ended) {
          ctx?.drawImage(video, 0, 0, canvas.width, canvas.height);
          requestAnimationFrame(drawFrame);
        }
      };
      drawFrame();

      await new Promise<void>((resolve) => {
        video.onended = () => resolve();
      });

      recorder.stop();
      const mutedBlob = await recordPromise;
      const url = URL.createObjectURL(mutedBlob);
      setMutedVideoUrl(url);
    } catch (err: any) {
      console.error(err);
      alert('Error muting video: ' + err.message);
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
        <span className={styles.breadcrumbActive}>Mute Video</span>
      </div>

      <div className={styles.headerContainer}>
        <h1 className={styles.title}>
          <span className={styles.iconWrapper}>🔇</span>
          Mute Video (Remove Sound)
        </h1>
        <p className={styles.subtitle}>
          Remove all background noise, voiceovers, or music from any video file with 100% client-side privacy.
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
            <div className={styles.dropText}>Choose a Video to Mute</div>
            <div className={styles.dropSub}>MP4, WebM, MOV supported (Instant Client-Side Muting)</div>
          </label>
        ) : (
          <div className={styles.scannerContainer}>
            {isProcessing && (
              <>
                <div className={styles.scannerBeam} />
                <div className={styles.scannerGlow} />
                <div className={styles.scanningBadge}>
                  <Sparkles style={{ width: '1rem', height: '1rem' }} />
                  <span>{progressMsg || 'Processing Video...'}</span>
                </div>
              </>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', gap: '1rem' }}>
              <video
                ref={videoRef}
                src={videoUrl || ''}
                controls
                playsInline
                className={styles.videoPlayer}
              />

              <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', maxWidth: '38rem', alignItems: 'center' }}>
                <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#44403c' }}>{videoFile.name}</span>
                <button
                  onClick={() => {
                    setVideoFile(null);
                    setVideoUrl(null);
                    setMutedVideoUrl(null);
                  }}
                  style={{ background: 'none', border: 'none', color: '#ef4444', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }}
                >
                  Change Video
                </button>
              </div>

              {!mutedVideoUrl && (
                <button
                  onClick={handleMuteVideo}
                  disabled={isProcessing}
                  className={styles.muteBtn}
                >
                  <VolumeX style={{ width: '1.1rem', height: '1.1rem' }} />
                  <span>{isProcessing ? 'Muting Video...' : 'Mute Video Now'}</span>
                </button>
              )}
            </div>

            {mutedVideoUrl && (
              <div className={styles.resultBox} style={{ marginTop: '1.5rem' }}>
                <div className={styles.resultTitle}>
                  <CheckCircle style={{ width: '1.25rem', height: '1.25rem' }} />
                  <span>Video Muted Successfully (Sound Stripped)</span>
                </div>
                <video src={mutedVideoUrl} controls className={styles.videoPlayer} />
                <div>
                  <a
                    href={mutedVideoUrl}
                    download={`muted-${videoFile.name}`}
                    className={styles.downloadBtn}
                  >
                    <Download style={{ width: '1.1rem', height: '1.1rem' }} />
                    <span>Download Muted Video</span>
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
