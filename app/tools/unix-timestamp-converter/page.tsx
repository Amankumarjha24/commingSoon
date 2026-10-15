'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Clock, Copy, CheckCircle, RefreshCw, Play, Pause, Calendar } from 'lucide-react';
import AdBanner from '@/components/AdBanner';
import styles from './page.module.css';

export default function UnixTimestampConverterPage() {
  const [currentEpoch, setCurrentEpoch] = useState<number>(Math.floor(Date.now() / 1000));
  const [isLive, setIsLive] = useState<boolean>(true);

  // Epoch to Date state
  const [inputEpoch, setInputEpoch] = useState<string>(Math.floor(Date.now() / 1000).toString());
  const [epochDateResults, setEpochDateResults] = useState<any>(null);

  // Date to Epoch state
  const [inputDate, setInputDate] = useState<string>(new Date().toISOString().slice(0, 16));
  const [dateEpochResult, setDateEpochResult] = useState<number>(Math.floor(Date.now() / 1000));
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Live timer tick
  useEffect(() => {
    if (!isLive) return;
    const interval = setInterval(() => {
      setCurrentEpoch(Math.floor(Date.now() / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, [isLive]);

  // Handle Epoch to Date conversion
  useEffect(() => {
    const val = Number(inputEpoch.trim());
    if (isNaN(val) || val <= 0) {
      setEpochDateResults(null);
      return;
    }
    // Handle milliseconds vs seconds
    const ms = inputEpoch.length > 11 ? val : val * 1000;
    const d = new Date(ms);
    if (isNaN(d.getTime())) {
      setEpochDateResults(null);
      return;
    }

    setEpochDateResults({
      gmt: d.toUTCString(),
      local: d.toString(),
      iso: d.toISOString(),
      relative: getRelativeTime(d.getTime()),
    });
  }, [inputEpoch]);

  // Handle Date to Epoch conversion
  useEffect(() => {
    const d = new Date(inputDate);
    if (!isNaN(d.getTime())) {
      setDateEpochResult(Math.floor(d.getTime() / 1000));
    }
  }, [inputDate]);

  function getRelativeTime(timestamp: number) {
    const diff = Math.floor((Date.now() - timestamp) / 1000);
    if (Math.abs(diff) < 60) return `${diff} seconds ago`;
    const mins = Math.floor(diff / 60);
    if (Math.abs(mins) < 60) return `${mins} minutes ago`;
    const hrs = Math.floor(mins / 60);
    if (Math.abs(hrs) < 24) return `${hrs} hours ago`;
    const days = Math.floor(hrs / 24);
    return `${days} days ago`;
  }

  const copyVal = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className={styles.container}>
      <div className={styles.breadcrumb}>
        <Link href="/" className={styles.breadcrumbLink}>Home</Link>
        <span>/</span>
        <Link href="/?category=dev#tools-section" className={styles.breadcrumbLink}>Dev & Text</Link>
        <span>/</span>
        <span className={styles.breadcrumbActive}>Unix Timestamp Converter</span>
      </div>

      <div className={styles.headerContainer}>
        <h1 className={styles.title}>
          <span className={styles.iconWrapper}>⏱️</span>
          Unix Timestamp & Epoch Converter
        </h1>
        <p className={styles.subtitle}>
          Live ticking Unix epoch clock with bidirectional epoch-to-date and date-to-epoch converters.
        </p>
      </div>

      <div className={styles.card}>
        {/* Live Ticker */}
        <div className={styles.liveTicker}>
          <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#059669', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Current Unix Epoch Timestamp
          </div>
          <div className={styles.tickerVal}>
            {currentEpoch}
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <button
              onClick={() => copyVal(currentEpoch.toString(), 'current')}
              style={{ padding: '0.45rem 1rem', borderRadius: '0.5rem', border: '1px solid #10b981', background: '#ecfdf5', color: '#047857', fontWeight: 700, fontSize: '0.75rem', cursor: 'pointer' }}
            >
              {copiedKey === 'current' ? 'Copied!' : 'Copy Timestamp'}
            </button>
            <button
              onClick={() => setIsLive(!isLive)}
              style={{ background: 'none', border: 'none', color: '#78716c', cursor: 'pointer', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
            >
              {isLive ? <Pause style={{ width: '0.85rem', height: '0.85rem' }} /> : <Play style={{ width: '0.85rem', height: '0.85rem' }} />}
              <span>{isLive ? 'Pause' : 'Resume'}</span>
            </button>
          </div>
        </div>

        {/* Converters Grid */}
        <div className={styles.sectionGrid}>
          {/* Epoch to Date */}
          <div className={styles.subCard}>
            <div className={styles.cardTitle}>
              <Clock style={{ width: '1.1rem', height: '1.1rem', color: '#059669' }} />
              <span>Convert Epoch Timestamp to Date</span>
            </div>

            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#78716c', display: 'block', marginBottom: '0.35rem' }}>
                Unix Timestamp (Seconds or Milliseconds)
              </label>
              <input
                type="text"
                value={inputEpoch}
                onChange={(e) => setInputEpoch(e.target.value)}
                placeholder="e.g. 1773000000"
                className={styles.inputField}
              />
            </div>

            {epochDateResults && (
              <div className={styles.resultList}>
                <div className={styles.resultRow}>
                  <span style={{ color: '#78716c' }}>GMT / UTC:</span>
                  <span style={{ fontWeight: 700, color: '#1c1917' }}>{epochDateResults.gmt}</span>
                </div>
                <div className={styles.resultRow}>
                  <span style={{ color: '#78716c' }}>Local Time:</span>
                  <span style={{ fontWeight: 700, color: '#1c1917' }}>{epochDateResults.local}</span>
                </div>
                <div className={styles.resultRow}>
                  <span style={{ color: '#78716c' }}>ISO 8601:</span>
                  <span style={{ fontWeight: 700, color: '#1c1917' }}>{epochDateResults.iso}</span>
                </div>
                <div className={styles.resultRow}>
                  <span style={{ color: '#78716c' }}>Relative:</span>
                  <span style={{ fontWeight: 700, color: '#059669' }}>{epochDateResults.relative}</span>
                </div>
              </div>
            )}
          </div>

          {/* Date to Epoch */}
          <div className={styles.subCard}>
            <div className={styles.cardTitle}>
              <Calendar style={{ width: '1.1rem', height: '1.1rem', color: '#059669' }} />
              <span>Convert Date & Time to Epoch</span>
            </div>

            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#78716c', display: 'block', marginBottom: '0.35rem' }}>
                Select Date and Time
              </label>
              <input
                type="datetime-local"
                value={inputDate}
                onChange={(e) => setInputDate(e.target.value)}
                className={styles.inputField}
              />
            </div>

            <div className={styles.resultList}>
              <div className={styles.resultRow}>
                <span style={{ color: '#78716c' }}>Epoch (Seconds):</span>
                <span style={{ fontWeight: 700, color: '#059669' }}>{dateEpochResult}</span>
              </div>
              <div className={styles.resultRow}>
                <span style={{ color: '#78716c' }}>Epoch (Milliseconds):</span>
                <span style={{ fontWeight: 700, color: '#1c1917' }}>{dateEpochResult * 1000}</span>
              </div>
            </div>

            <button
              onClick={() => copyVal(dateEpochResult.toString(), 'result')}
              style={{ width: '100%', padding: '0.65rem', borderRadius: '0.65rem', background: '#059669', color: '#ffffff', fontWeight: 700, fontSize: '0.8125rem', border: 'none', cursor: 'pointer' }}
            >
              {copiedKey === 'result' ? 'Copied to Clipboard!' : 'Copy Converted Timestamp'}
            </button>
          </div>
        </div>
      </div>

      <AdBanner format="horizontal" />
    </div>
  );
}
