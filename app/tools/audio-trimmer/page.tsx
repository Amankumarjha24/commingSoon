'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  UploadCloud,
  Music,
  Scissors,
  Download,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  CheckCircle,
  ShieldCheck,
  Zap,
  Sliders,
  AlertCircle,
} from 'lucide-react';
import AdBanner from '@/components/AdBanner';
import styles from './page.module.css';

export default function AudioTrimmerPage() {
  // File state
  const [file, setFile] = useState<File | null>(null);
  const [fileSizeStr, setFileSizeStr] = useState<string>('');
  const [audioBuffer, setAudioBuffer] = useState<AudioBuffer | null>(null);
  const [isDecoding, setIsDecoding] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Audio playback state
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [volume, setVolume] = useState<number>(1);
  const [isLoopingSelection, setIsLoopingSelection] = useState<boolean>(false);

  // Trimming timestamps (in seconds)
  const [startTime, setStartTime] = useState<number>(0);
  const [endTime, setEndTime] = useState<number>(0);

  // Audio enhancement & export options
  const [fadeInSec, setFadeInSec] = useState<number>(0);
  const [fadeOutSec, setFadeOutSec] = useState<number>(0);
  const [channelMode, setChannelMode] = useState<'stereo' | 'mono'>('stereo');
  const [outputFormat, setOutputFormat] = useState<'wav' | 'wav-compatible'>('wav');

  // Trimming process & result state
  const [isTrimming, setIsTrimming] = useState<boolean>(false);
  const [trimmedBlobUrl, setTrimmedBlobUrl] = useState<string | null>(null);
  const [trimmedSizeStr, setTrimmedSizeStr] = useState<string>('');
  const [trimmedDuration, setTrimmedDuration] = useState<number>(0);

  // Refs
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const isPlayingSelectionRef = useRef<boolean>(false);

  // Clean up object URLs on unmount
  useEffect(() => {
    return () => {
      if (audioUrl) URL.revokeObjectURL(audioUrl);
      if (trimmedBlobUrl) URL.revokeObjectURL(trimmedBlobUrl);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [audioUrl, trimmedBlobUrl]);

  // Format seconds to mm:ss.SS
  const formatTime = (sec: number): string => {
    if (isNaN(sec) || sec < 0) sec = 0;
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    const ms = Math.floor((sec % 1) * 100);
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}.${String(ms).padStart(2, '0')}`;
  };

  // Handle file upload
  const processAudioFile = async (selectedFile: File) => {
    setErrorMsg(null);
    setTrimmedBlobUrl(null);
    setIsTrimming(false);

    // Validate size (< 120MB)
    if (selectedFile.size > 120 * 1024 * 1024) {
      setErrorMsg('File exceeds 120MB. Please select a smaller audio clip to prevent browser memory exhaustion.');
      return;
    }

    setFile(selectedFile);
    setFileSizeStr((selectedFile.size / (1024 * 1024)).toFixed(2) + ' MB');
    setIsDecoding(true);

    try {
      const arrayBuffer = await selectedFile.arrayBuffer();
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) {
        throw new Error('Web Audio API is not supported in this browser.');
      }

      const audioCtx = new AudioCtx();
      // Decode audio data safely
      const decoded = await audioCtx.decodeAudioData(arrayBuffer);
      setAudioBuffer(decoded);

      const dur = decoded.duration;
      setDuration(dur);
      setStartTime(0);
      setEndTime(dur);

      // Create native audio player url
      if (audioUrl) URL.revokeObjectURL(audioUrl);
      const url = URL.createObjectURL(selectedFile);
      setAudioUrl(url);
      setCurrentTime(0);

      // Determine default channels
      if (decoded.numberOfChannels === 1) {
        setChannelMode('mono');
      } else {
        setChannelMode('stereo');
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg(
        'Unable to decode audio. Please ensure the file is an intact MP3, WAV, AAC, M4A, OGG, or FLAC track.'
      );
      setFile(null);
      setAudioBuffer(null);
    } finally {
      setIsDecoding(false);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      processAudioFile(files[0]);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processAudioFile(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  // Waveform rendering
  const drawWaveform = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !audioBuffer) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    ctx.clearRect(0, 0, width, height);

    // Number of bars
    const numBars = Math.min(240, Math.floor(width / 3));
    const channelData = audioBuffer.getChannelData(0);
    const totalSamples = channelData.length;
    const step = Math.floor(totalSamples / numBars);

    const startNorm = duration > 0 ? startTime / duration : 0;
    const endNorm = duration > 0 ? endTime / duration : 1;
    const currentNorm = duration > 0 ? currentTime / duration : 0;

    const barWidth = Math.max(1.5, (width / numBars) - 1.5);

    for (let i = 0; i < numBars; i++) {
      let maxVal = 0;
      const offset = i * step;
      for (let j = 0; j < step; j += 4) {
        const val = Math.abs(channelData[offset + j] || 0);
        if (val > maxVal) maxVal = val;
      }

      const barHeight = Math.max(4, maxVal * (height * 0.85));
      const x = i * (barWidth + 1.5);
      const y = (height - barHeight) / 2;

      const barNorm = i / numBars;
      const isSelected = barNorm >= startNorm && barNorm <= endNorm;

      if (isSelected) {
        // Selected trim region: vibrant violet gradient
        const grad = ctx.createLinearGradient(0, y, 0, y + barHeight);
        grad.addColorStop(0, '#c084fc');
        grad.addColorStop(0.5, '#8b5cf6');
        grad.addColorStop(1, '#6366f1');
        ctx.fillStyle = grad;
      } else {
        // Outside selection: subtle slate gray
        ctx.fillStyle = '#334155';
      }

      ctx.beginPath();
      ctx.roundRect(x, y, barWidth, barHeight, 2);
      ctx.fill();
    }

    // Draw Start Handle line
    const startX = startNorm * width;
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(startX, 0);
    ctx.lineTo(startX, height);
    ctx.stroke();

    // Start handle top flag
    ctx.fillStyle = '#10b981';
    ctx.beginPath();
    ctx.arc(startX, 8, 5, 0, Math.PI * 2);
    ctx.fill();

    // Draw End Handle line
    const endX = endNorm * width;
    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(endX, 0);
    ctx.lineTo(endX, height);
    ctx.stroke();

    // End handle top flag
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.arc(endX, 8, 5, 0, Math.PI * 2);
    ctx.fill();

    // Draw Playhead scrubber line
    const playX = currentNorm * width;
    ctx.strokeStyle = '#fbbf24';
    ctx.lineWidth = 2;
    ctx.shadowColor = 'rgba(251, 191, 36, 0.6)';
    ctx.shadowBlur = 6;
    ctx.beginPath();
    ctx.moveTo(playX, 0);
    ctx.lineTo(playX, height);
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Playhead arrow indicator
    ctx.fillStyle = '#fbbf24';
    ctx.beginPath();
    ctx.moveTo(playX - 6, 0);
    ctx.lineTo(playX + 6, 0);
    ctx.lineTo(playX, 8);
    ctx.closePath();
    ctx.fill();
  }, [audioBuffer, startTime, endTime, currentTime, duration]);

  // Sync canvas size on mount / resize
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const updateCanvasWidth = () => {
      const rect = canvas.getBoundingClientRect();
      if (rect.width > 0) {
        canvas.width = rect.width;
        canvas.height = 120;
        drawWaveform();
      }
    };

    updateCanvasWidth();
    window.addEventListener('resize', updateCanvasWidth);
    return () => window.removeEventListener('resize', updateCanvasWidth);
  }, [drawWaveform]);

  // Redraw when times update
  useEffect(() => {
    drawWaveform();
  }, [drawWaveform, startTime, endTime, currentTime]);

  // Audio Playback Listener & Monitor
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onTimeUpdate = () => {
      const t = audio.currentTime;
      setCurrentTime(t);

      // If playing in selection preview mode
      if (isPlayingSelectionRef.current) {
        if (t >= endTime) {
          if (isLoopingSelection) {
            audio.currentTime = startTime;
            audio.play();
          } else {
            audio.pause();
            audio.currentTime = startTime;
            setIsPlaying(false);
            isPlayingSelectionRef.current = false;
          }
        }
      }
    };

    const onEnded = () => {
      setIsPlaying(false);
      isPlayingSelectionRef.current = false;
    };

    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('ended', onEnded);

    return () => {
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('ended', onEnded);
    };
  }, [startTime, endTime, isLoopingSelection]);

  // Waveform Click to Seek
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    const audio = audioRef.current;
    if (!canvas || !audio || duration <= 0) return;

    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const ratio = Math.max(0, Math.min(1, clickX / rect.width));
    const seekTime = ratio * duration;

    audio.currentTime = seekTime;
    setCurrentTime(seekTime);
  };

  // Playback Control Handlers
  const togglePlayWhole = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
      isPlayingSelectionRef.current = false;
    } else {
      isPlayingSelectionRef.current = false;
      audio.play();
      setIsPlaying(true);
    }
  };

  const playSelectionPreview = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (endTime <= startTime) {
      alert('End time must be greater than start time.');
      return;
    }

    isPlayingSelectionRef.current = true;
    audio.currentTime = startTime;
    audio.play();
    setIsPlaying(true);
  };

  const stopAndReset = () => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.pause();
    audio.currentTime = startTime;
    setCurrentTime(startTime);
    setIsPlaying(false);
    isPlayingSelectionRef.current = false;
  };

  // Timestamp stepper adjustments
  const adjustStartTime = (delta: number) => {
    setStartTime((prev) => {
      const next = Math.max(0, Math.min(duration, +(prev + delta).toFixed(2)));
      return next < endTime ? next : prev;
    });
  };

  const adjustEndTime = (delta: number) => {
    setEndTime((prev) => {
      const next = Math.max(0, Math.min(duration, +(prev + delta).toFixed(2)));
      return next > startTime ? next : prev;
    });
  };

  const setStartToPlayhead = () => {
    if (currentTime < endTime) {
      setStartTime(+currentTime.toFixed(2));
    }
  };

  const setEndToPlayhead = () => {
    if (currentTime > startTime) {
      setEndTime(+currentTime.toFixed(2));
    }
  };

  // WAV Generator Function
  const generateWavBlob = (
    buffer: AudioBuffer,
    startSec: number,
    endSec: number,
    channels: 'stereo' | 'mono',
    fadeIn: number,
    fadeOut: number
  ): Blob => {
    const sampleRate = buffer.sampleRate;
    const startSample = Math.floor(startSec * sampleRate);
    const endSample = Math.floor(endSec * sampleRate);
    const sampleCount = Math.max(1, endSample - startSample);

    const numOutChannels = channels === 'mono' ? 1 : Math.min(buffer.numberOfChannels, 2);
    const bytesPerSample = 2; // 16-bit PCM
    const blockAlign = numOutChannels * bytesPerSample;
    const byteRate = sampleRate * blockAlign;
    const dataSize = sampleCount * blockAlign;
    const totalSize = 44 + dataSize;

    const arrayBuffer = new ArrayBuffer(totalSize);
    const view = new DataView(arrayBuffer);

    // Helper to write ASCII chars
    const writeAscii = (offset: number, str: string) => {
      for (let i = 0; i < str.length; i++) {
        view.setUint8(offset + i, str.charCodeAt(i));
      }
    };

    // RIFF chunk descriptor
    writeAscii(0, 'RIFF');
    view.setUint32(4, 36 + dataSize, true);
    writeAscii(8, 'WAVE');

    // fmt sub-chunk
    writeAscii(12, 'fmt ');
    view.setUint32(16, 16, true); // PCM subchunk size
    view.setUint16(20, 1, true);  // AudioFormat 1 = PCM
    view.setUint16(22, numOutChannels, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, byteRate, true);
    view.setUint16(32, blockAlign, true);
    view.setUint16(34, 16, true); // 16 bits per sample

    // data sub-chunk
    writeAscii(36, 'data');
    view.setUint32(40, dataSize, true);

    // Audio channel data arrays
    const inputChannels: Float32Array[] = [];
    for (let c = 0; c < buffer.numberOfChannels; c++) {
      inputChannels.push(buffer.getChannelData(c));
    }

    const fadeInSamples = Math.floor(fadeIn * sampleRate);
    const fadeOutSamples = Math.floor(fadeOut * sampleRate);

    let offset = 44;
    for (let i = 0; i < sampleCount; i++) {
      const srcIdx = startSample + i;

      // Calculate fade curve
      let fadeFactor = 1.0;
      if (fadeInSamples > 0 && i < fadeInSamples) {
        fadeFactor = i / fadeInSamples;
      } else if (fadeOutSamples > 0 && i >= sampleCount - fadeOutSamples) {
        fadeFactor = Math.max(0, (sampleCount - i) / fadeOutSamples);
      }

      if (numOutChannels === 1) {
        // Mono output: average channels
        let sum = 0;
        for (let c = 0; c < inputChannels.length; c++) {
          sum += inputChannels[c][srcIdx] || 0;
        }
        let sample = (sum / inputChannels.length) * fadeFactor;
        sample = Math.max(-1, Math.min(1, sample));
        const intSample = sample < 0 ? sample * 32768 : sample * 32767;
        view.setInt16(offset, intSample | 0, true);
        offset += 2;
      } else {
        // Stereo output: write L and R
        for (let c = 0; c < 2; c++) {
          const chIdx = c < inputChannels.length ? c : 0;
          let sample = (inputChannels[chIdx][srcIdx] || 0) * fadeFactor;
          sample = Math.max(-1, Math.min(1, sample));
          const intSample = sample < 0 ? sample * 32768 : sample * 32767;
          view.setInt16(offset, intSample | 0, true);
          offset += 2;
        }
      }
    }

    return new Blob([view], { type: 'audio/wav' });
  };

  // Trim and Export Action
  const handleTrimAndDownload = async () => {
    if (!audioBuffer) return;
    if (endTime <= startTime) {
      alert('End time must be greater than start time.');
      return;
    }

    setIsTrimming(true);
    // Pause any playing audio
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }

    // Small delay to allow UI spinner render
    await new Promise((r) => setTimeout(r, 120));

    try {
      const blob = generateWavBlob(
        audioBuffer,
        startTime,
        endTime,
        channelMode,
        fadeInSec,
        fadeOutSec
      );

      if (trimmedBlobUrl) URL.revokeObjectURL(trimmedBlobUrl);
      const url = URL.createObjectURL(blob);
      setTrimmedBlobUrl(url);

      const clipDur = +(endTime - startTime).toFixed(2);
      setTrimmedDuration(clipDur);
      setTrimmedSizeStr((blob.size / (1024 * 1024)).toFixed(2) + ' MB');

      // Auto trigger download
      const baseName = file?.name.replace(/\.[^/.]+$/, '') || 'audio-clip';
      const ext = outputFormat === 'wav' ? 'wav' : 'wav';
      const a = document.createElement('a');
      a.href = url;
      a.download = `${baseName}-trimmed.${ext}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (err: any) {
      console.error(err);
      alert('An error occurred during audio trimming. Please check your start and end points.');
    } finally {
      setIsTrimming(false);
    }
  };

  // Reset to initial state
  const handleResetAll = () => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    if (audioUrl) URL.revokeObjectURL(audioUrl);
    if (trimmedBlobUrl) URL.revokeObjectURL(trimmedBlobUrl);

    setFile(null);
    setAudioBuffer(null);
    setAudioUrl(null);
    setTrimmedBlobUrl(null);
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
    setStartTime(0);
    setEndTime(0);
    setErrorMsg(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const selectedClipDuration = +(endTime - startTime).toFixed(2);

  return (
    <div className={styles.container}>
      {/* 1. Breadcrumbs */}
      <nav className={styles.breadcrumb} aria-label="Breadcrumb">
        <Link href="/" className={styles.breadcrumbLink}>
          Home
        </Link>
        <span>/</span>
        <Link href="/?category=video#tools-section" className={styles.breadcrumbLink}>
          Video & Audio
        </Link>
        <span>/</span>
        <span className={styles.breadcrumbActive}>Audio Cutter & MP3 Trimmer</span>
      </nav>

      {/* 2. Tool Header & H1 */}
      <header className={styles.headerContainer}>
        <div className={styles.title}>
          <div className={styles.iconWrapper}>🎵</div>
          <h1>Free Online Audio Cutter & MP3 Trimmer</h1>
        </div>
        <p className={styles.subtitle}>
          Cut MP3, WAV, AAC, and songs online for free. Select start and end times, preview your clip,
          and download it easily. 100% private in-browser processing with zero server uploads.
        </p>

        <div className={styles.trustBadges}>
          <span className={styles.badge}>
            <ShieldCheck style={{ width: 14, height: 14 }} /> 100% Client-Side Privacy
          </span>
          <span className={styles.badge}>
            <Zap style={{ width: 14, height: 14 }} /> Instant Web Audio Processing
          </span>
          <span className={styles.badge}>
            <Scissors style={{ width: 14, height: 14 }} /> Millisecond Precision
          </span>
          <span className={styles.badge}>
            <Music style={{ width: 14, height: 14 }} /> Lossless 16-Bit PCM Export
          </span>
        </div>
      </header>

      {/* Hidden Native Audio Element */}
      {audioUrl && (
        <audio
          ref={audioRef}
          src={audioUrl}
          preload="auto"
          onVolumeChange={(e) => setVolume((e.target as HTMLAudioElement).volume)}
        />
      )}

      {/* Top Banner Ad Space */}
      <div style={{ marginBottom: '1.5rem' }}>
        <AdBanner format="horizontal" />
      </div>

      {/* 3. Main Interactive Workspace Card */}
      <main className={styles.card}>
        {/* Hidden File Input */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileInputChange}
          accept="audio/*,.mp3,.wav,.m4a,.aac,.ogg,.flac,.weba,.webm"
          style={{ display: 'none' }}
        />

        {/* Error notification */}
        {errorMsg && (
          <div
            style={{
              padding: '0.85rem 1.25rem',
              backgroundColor: '#fef2f2',
              border: '1px solid #fecaca',
              borderRadius: '0.75rem',
              color: '#dc2626',
              fontSize: '0.85rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}
          >
            <AlertCircle style={{ width: 18, height: 18, flexShrink: 0 }} />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Upload Dropzone (When no file is loaded) */}
        {!file && (
          <div
            className={styles.dropzone}
            onClick={() => fileInputRef.current?.click()}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
          >
            <UploadCloud className={styles.dropIcon} />
            <div className={styles.dropText}>Click or Drag Audio File to Trim</div>
            <div className={styles.dropSub}>
              Supports MP3, WAV, AAC, M4A, OGG, and FLAC (Up to 100MB)
            </div>
            {isDecoding && (
              <div style={{ marginTop: '1rem', color: '#7c3aed', fontWeight: 700, fontSize: '0.85rem' }}>
                Decoding audio waveform in browser...
              </div>
            )}
          </div>
        )}

        {/* Active Audio Workspace (When file is loaded) */}
        {file && audioBuffer && (
          <>
            {/* File Info Bar */}
            <div className={styles.fileInfoBar}>
              <div className={styles.fileInfoMain}>
                <Music style={{ width: 18, height: 18, color: '#7c3aed', flexShrink: 0 }} />
                <span className={styles.fileName} title={file.name}>
                  {file.name}
                </span>
                <span className={styles.fileMetaPill}>{fileSizeStr}</span>
                <span className={styles.fileMetaPill}>{formatTime(duration)}</span>
                <span className={styles.fileMetaPill}>
                  {audioBuffer.sampleRate} Hz • {audioBuffer.numberOfChannels === 1 ? 'Mono' : 'Stereo'}
                </span>
              </div>
              <button onClick={handleResetAll} className={styles.resetBtn}>
                Reset / Change File
              </button>
            </div>

            {/* Interactive Canvas Waveform */}
            <div className={styles.waveformWrapper}>
              <div className={styles.waveformHeader}>
                <span>Click waveform to seek playhead</span>
                <span>
                  Start: {formatTime(startTime)} | End: {formatTime(endTime)}
                </span>
              </div>

              <canvas
                ref={canvasRef}
                className={styles.waveformCanvas}
                onClick={handleCanvasClick}
                title="Interactive Waveform: Click to seek audio position"
              />

              <div className={styles.timeRuler}>
                <span>00:00.00</span>
                <span>{formatTime(duration / 4)}</span>
                <span>{formatTime(duration / 2)}</span>
                <span>{formatTime((duration * 3) / 4)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            {/* Playback Controls Bar */}
            <div className={styles.controlsBar}>
              <div className={styles.playbackBtns}>
                <button
                  onClick={togglePlayWhole}
                  className={styles.btnPrimary}
                  title={isPlaying ? 'Pause' : 'Play whole audio'}
                >
                  {isPlaying ? <Pause style={{ width: 16, height: 16 }} /> : <Play style={{ width: 16, height: 16 }} />}
                  {isPlaying ? 'Pause' : 'Play Track'}
                </button>

                <button
                  onClick={playSelectionPreview}
                  className={styles.btnSecondary}
                  title="Listen to the exact trimmed section"
                >
                  <Scissors style={{ width: 15, height: 15, color: '#7c3aed' }} />
                  Preview Selection
                </button>

                <button
                  onClick={() => setIsLoopingSelection(!isLoopingSelection)}
                  className={`${styles.btnSecondary} ${isLoopingSelection ? styles.btnActive : ''}`}
                  title="Toggle looping for trimmed selection preview"
                >
                  <RotateCcw style={{ width: 14, height: 14 }} />
                  {isLoopingSelection ? 'Loop: On' : 'Loop: Off'}
                </button>

                <button onClick={stopAndReset} className={styles.btnSecondary} title="Stop and rewind to start marker">
                  Stop
                </button>
              </div>

              <div className={styles.timeDisplay}>
                <span>{formatTime(currentTime)}</span>
                <span style={{ color: '#9ca3af', margin: '0 0.35rem' }}>/</span>
                <span style={{ color: '#6b7280' }}>{formatTime(duration)}</span>
              </div>
            </div>

            {/* Selected Duration Banner */}
            <div className={styles.durationBanner}>
              <div className={styles.durationText}>
                Selected Trim Duration:
              </div>
              <div className={styles.durationVal}>
                {formatTime(selectedClipDuration)} ({selectedClipDuration}s)
              </div>
            </div>

            {/* Dual Range Scrubbers */}
            <div className={styles.dualRangeWrap}>
              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#10b981', display: 'block', marginBottom: '0.2rem' }}>
                  Start Marker Scrubber: {formatTime(startTime)}
                </label>
                <input
                  type="range"
                  min="0"
                  max={duration}
                  step="0.05"
                  value={startTime}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value);
                    if (val < endTime) setStartTime(val);
                  }}
                  className={styles.rangeInput}
                  style={{ accentColor: '#10b981' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#ef4444', display: 'block', marginBottom: '0.2rem' }}>
                  End Marker Scrubber: {formatTime(endTime)}
                </label>
                <input
                  type="range"
                  min="0"
                  max={duration}
                  step="0.05"
                  value={endTime}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value);
                    if (val > startTime) setEndTime(val);
                  }}
                  className={styles.rangeInput}
                  style={{ accentColor: '#ef4444' }}
                />
              </div>
            </div>

            {/* Precision Time Settings Grid */}
            <div className={styles.settingsGrid}>
              {/* Start Timestamp Control Box */}
              <div className={styles.settingBox}>
                <div className={styles.boxHeader}>
                  <div className={styles.boxTitle}>
                    <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#10b981' }} />
                    Start Time (Seconds)
                  </div>
                  <span style={{ fontSize: '0.75rem', fontFamily: 'monospace', fontWeight: 700, color: '#10b981' }}>
                    {formatTime(startTime)}
                  </span>
                </div>

                <div className={styles.timeInputRow}>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max={endTime - 0.05}
                    value={startTime}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value) || 0;
                      if (val >= 0 && val < endTime) setStartTime(val);
                    }}
                    className={styles.inputNumber}
                  />

                  <div className={styles.stepperBtns}>
                    <button onClick={() => adjustStartTime(-1)} className={styles.stepBtn}>-1s</button>
                    <button onClick={() => adjustStartTime(-0.1)} className={styles.stepBtn}>-0.1s</button>
                    <button onClick={() => adjustStartTime(0.1)} className={styles.stepBtn}>+0.1s</button>
                    <button onClick={() => adjustStartTime(1)} className={styles.stepBtn}>+1s</button>
                  </div>
                </div>

                <button onClick={setStartToPlayhead} className={styles.usePlayheadBtn}>
                  Set Start to Current Playhead ({formatTime(currentTime)})
                </button>
              </div>

              {/* End Timestamp Control Box */}
              <div className={styles.settingBox}>
                <div className={styles.boxHeader}>
                  <div className={styles.boxTitle}>
                    <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#ef4444' }} />
                    End Time (Seconds)
                  </div>
                  <span style={{ fontSize: '0.75rem', fontFamily: 'monospace', fontWeight: 700, color: '#ef4444' }}>
                    {formatTime(endTime)}
                  </span>
                </div>

                <div className={styles.timeInputRow}>
                  <input
                    type="number"
                    step="0.01"
                    min={startTime + 0.05}
                    max={duration}
                    value={endTime}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value) || 0;
                      if (val > startTime && val <= duration) setEndTime(val);
                    }}
                    className={styles.inputNumber}
                  />

                  <div className={styles.stepperBtns}>
                    <button onClick={() => adjustEndTime(-1)} className={styles.stepBtn}>-1s</button>
                    <button onClick={() => adjustEndTime(-0.1)} className={styles.stepBtn}>-0.1s</button>
                    <button onClick={() => adjustEndTime(0.1)} className={styles.stepBtn}>+0.1s</button>
                    <button onClick={() => adjustEndTime(1)} className={styles.stepBtn}>+1s</button>
                  </div>
                </div>

                <button onClick={setEndToPlayhead} className={styles.usePlayheadBtn}>
                  Set End to Current Playhead ({formatTime(currentTime)})
                </button>
              </div>
            </div>

            {/* Audio Options: Fade In, Fade Out, Channels */}
            <div className={styles.optionsRow}>
              <div className={styles.optionItem}>
                <label className={styles.optionLabel}>Fade In (Smooth Intro)</label>
                <select
                  value={fadeInSec}
                  onChange={(e) => setFadeInSec(parseFloat(e.target.value))}
                  className={styles.selectInput}
                >
                  <option value={0}>None (Instant Cut)</option>
                  <option value={0.5}>0.5 Seconds</option>
                  <option value={1}>1.0 Second</option>
                  <option value={2}>2.0 Seconds</option>
                </select>
              </div>

              <div className={styles.optionItem}>
                <label className={styles.optionLabel}>Fade Out (Smooth Outro)</label>
                <select
                  value={fadeOutSec}
                  onChange={(e) => setFadeOutSec(parseFloat(e.target.value))}
                  className={styles.selectInput}
                >
                  <option value={0}>None (Instant Cut)</option>
                  <option value={0.5}>0.5 Seconds</option>
                  <option value={1}>1.0 Second</option>
                  <option value={2}>2.0 Seconds</option>
                </select>
              </div>

              <div className={styles.optionItem}>
                <label className={styles.optionLabel}>Audio Channels</label>
                <select
                  value={channelMode}
                  onChange={(e) => setChannelMode(e.target.value as 'stereo' | 'mono')}
                  className={styles.selectInput}
                >
                  <option value="stereo">Stereo (2 Channels - Original)</option>
                  <option value="mono">Mono (1 Channel - Half File Size)</option>
                </select>
              </div>
            </div>

            {/* Primary Action Button */}
            <div className={styles.actionRow}>
              <button
                onClick={handleTrimAndDownload}
                disabled={isTrimming || selectedClipDuration <= 0}
                className={styles.trimCtaBtn}
              >
                <Scissors style={{ width: 18, height: 18 }} />
                {isTrimming ? 'Processing Audio in Browser...' : 'Trim & Download Audio'}
              </button>
              <span style={{ fontSize: '0.75rem', color: '#78716c' }}>
                Exports studio-quality 16-bit PCM WAV. Zero cloud upload.
              </span>
            </div>

            {/* Trim Result Card (Displayed after successful trim) */}
            {trimmedBlobUrl && (
              <div className={styles.resultCard}>
                <div className={styles.resultHeader}>
                  <div className={styles.successIcon}>✓</div>
                  <div>
                    <div className={styles.resultTitle}>Audio Trimmed Successfully!</div>
                    <div className={styles.resultSub}>
                      Trimmed duration: {trimmedDuration}s ({formatTime(trimmedDuration)}) • File size: {trimmedSizeStr}
                    </div>
                  </div>
                </div>

                {/* Inline Audio Player for Result Preview */}
                <audio controls src={trimmedBlobUrl} className={styles.audioPlayer} />

                <div className={styles.resultActions}>
                  <a
                    href={trimmedBlobUrl}
                    download={`${file.name.replace(/\.[^/.]+$/, '')}-trimmed.wav`}
                    className={styles.downloadCta}
                  >
                    <Download style={{ width: 16, height: 16 }} />
                    Download Trimmed Audio ({trimmedSizeStr})
                  </a>

                  <button
                    onClick={() => {
                      setTrimmedBlobUrl(null);
                    }}
                    className={styles.btnSecondary}
                  >
                    Keep Adjusting
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        {/* Technical Architecture & Privacy Disclosure Box */}
        <div className={styles.transparencyBox}>
          <div className={styles.transparencyTitle}>
            <ShieldCheck style={{ width: 16, height: 16, color: '#10b981' }} />
            Privacy Architecture & Processing Notes
          </div>
          <p className={styles.transparencyText}>
            This tool operates 100% on the client side using the standard browser Web Audio API. When you upload an audio file, it is decoded into raw PCM samples inside your device memory (RAM) and sliced to your specified millisecond timestamps. No voice recordings, music tracks, or personal audio files are ever uploaded to any external server or saved to the cloud. Output files are encoded in uncompressed 16-bit Linear PCM (RIFF WAVE) for pristine acoustic fidelity without re-compression degradation.
          </p>
        </div>
      </main>

      {/* Bottom Ad Space */}
      <div style={{ marginTop: '2rem' }}>
        <AdBanner format="horizontal" />
      </div>
    </div>
  );
}
