'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import {
  UploadCloud,
  MapPin,
  Compass,
  Download,
  CheckCircle2,
  Navigation,
  ExternalLink,
  RefreshCw,
  Trash2,
  FileVideo,
  ShieldCheck,
  AlertCircle,
  Play,
} from 'lucide-react';
import AdBanner from '@/components/AdBanner';
import {
  VideoGeotagEngine,
  VideoFormatInfo,
  VideoGPSMetadata,
  GeotagVerification,
} from '@/lib/videoGeotagEngine';
import styles from './page.module.css';

interface CityPreset {
  name: string;
  lat: number;
  lng: number;
  alt: number;
}

const CITY_PRESETS: CityPreset[] = [
  { name: 'New Delhi', lat: 28.613939, lng: 77.209021, alt: 216 },
  { name: 'Mumbai', lat: 19.076090, lng: 72.877426, alt: 14 },
  { name: 'Bengaluru', lat: 12.971599, lng: 77.594566, alt: 920 },
  { name: 'Dubai', lat: 25.204849, lng: 55.270783, alt: 16 },
  { name: 'London', lat: 51.507351, lng: -0.127758, alt: 25 },
  { name: 'New York', lat: 40.712776, lng: -74.005974, alt: 10 },
  { name: 'Tokyo', lat: 35.676192, lng: 139.650311, alt: 40 },
  { name: 'Paris', lat: 48.856614, lng: 2.352222, alt: 35 },
  { name: 'Sydney', lat: -33.868820, lng: 151.209296, alt: 19 },
];

export default function VideoGeotagChangerPage() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [formatInfo, setFormatInfo] = useState<VideoFormatInfo | null>(null);
  const [existingGPS, setExistingGPS] = useState<VideoGPSMetadata | null>(null);

  // Form coordinates
  const [lat, setLat] = useState<string>('28.613939');
  const [lng, setLng] = useState<string>('77.209021');
  const [altitude, setAltitude] = useState<string>('216');
  const [customFileName, setCustomFileName] = useState<string>('');

  // Processing state
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Output state
  const [outputUrl, setOutputUrl] = useState<string | null>(null);
  const [outputFileName, setOutputFileName] = useState<string>('');
  const [outputFileSize, setOutputFileSize] = useState<number>(0);
  const [verification, setVerification] = useState<GeotagVerification | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Revoke object URLs on unmount
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      if (outputUrl) URL.revokeObjectURL(outputUrl);
    };
  }, [previewUrl, outputUrl]);

  const processSelectedFile = async (selected: File) => {
    setErrorMessage(null);
    setOutputUrl(null);
    setVerification(null);

    // Validate size (browser memory safety)
    const MAX_FILE_SIZE = 1024 * 1024 * 1024; // 1GB
    if (selected.size > MAX_FILE_SIZE) {
      setErrorMessage('File size exceeds the 1GB in-browser memory safety limit. Please choose a smaller video.');
      return;
    }

    setFile(selected);

    // Default clean output file name
    const baseName = selected.name.replace(/\.[^/.]+$/, '');
    setCustomFileName(`${baseName}-geotagged.mp4`);

    // Create preview URL
    const objUrl = URL.createObjectURL(selected);
    setPreviewUrl(objUrl);

    // Read initial slice (first 100KB to 2MB) or full file to detect container format & existing GPS
    try {
      const sliceSize = Math.min(selected.size, 4 * 1024 * 1024);
      const sliceBuf = await selected.slice(0, sliceSize).arrayBuffer();
      const format = VideoGeotagEngine.detectFormat(new Uint8Array(sliceBuf));
      setFormatInfo(format);

      if (!format.isSupported) {
        setErrorMessage(format.error || 'Unsupported video container format.');
        return;
      }

      // Read full file to inspect metadata (or slice if moov is at beginning)
      const fullBuf = await selected.arrayBuffer();
      const gps = VideoGeotagEngine.readGPS(new Uint8Array(fullBuf));
      setExistingGPS(gps);

      if (gps) {
        setLat(gps.latitude.toFixed(6));
        setLng(gps.longitude.toFixed(6));
        if (gps.altitude !== null) {
          setAltitude(gps.altitude.toFixed(0));
        }
      }
    } catch (err: any) {
      console.error(err);
      setErrorMessage(`Failed to read video headers: ${err.message || 'Malformed container'}`);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      processSelectedFile(selected);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const dropped = e.dataTransfer.files?.[0];
    if (dropped) {
      processSelectedFile(dropped);
    }
  };

  const handleUseCurrentGps = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLat(pos.coords.latitude.toFixed(6));
        setLng(pos.coords.longitude.toFixed(6));
        if (pos.coords.altitude !== null) {
          setAltitude(pos.coords.altitude.toFixed(0));
        }
      },
      (err) => {
        alert('Could not access device location. Please allow browser location access or type coordinates manually.');
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const applyPreset = (preset: CityPreset) => {
    setLat(preset.lat.toFixed(6));
    setLng(preset.lng.toFixed(6));
    setAltitude(preset.alt.toString());
  };

  const handleApplyGeoTag = async () => {
    if (!file) return;

    const latNum = parseFloat(lat);
    const lngNum = parseFloat(lng);
    const altNum = altitude ? parseFloat(altitude) : null;

    if (isNaN(latNum) || latNum < -90 || latNum > 90) {
      alert('Please enter a valid Latitude between -90 and +90 degrees.');
      return;
    }
    if (isNaN(lngNum) || lngNum < -180 || lngNum > 180) {
      alert('Please enter a valid Longitude between -180 and +180 degrees.');
      return;
    }

    setIsProcessing(true);
    setStatusMessage('Reading video container and injecting ISO 6709 location atom...');
    setErrorMessage(null);

    try {
      const buffer = await file.arrayBuffer();
      const rawBytes = new Uint8Array(buffer);

      // Embed GPS metadata into video container
      const updatedBytes = VideoGeotagEngine.setGPS(rawBytes, latNum, lngNum, altNum);

      setStatusMessage('Verifying container integrity and GPS coordinates...');

      // Independent Verification: Parse output buffer to confirm metadata exists and matches
      const verifyResult = VideoGeotagEngine.verifyGPS(updatedBytes, latNum, lngNum);
      setVerification(verifyResult);

      if (!verifyResult.verified) {
        throw new Error(verifyResult.error || 'Verification failed: GPS metadata could not be verified in exported container.');
      }

      // Create output downloadable blob
      const blob = new Blob([updatedBytes.buffer as ArrayBuffer], { type: 'video/mp4' });
      const newUrl = URL.createObjectURL(blob);

      let targetName = customFileName.trim();
      if (!targetName) targetName = 'geotagged-video.mp4';
      if (!targetName.toLowerCase().endsWith('.mp4') && !targetName.toLowerCase().endsWith('.mov')) {
        targetName += '.mp4';
      }

      setOutputUrl(newUrl);
      setOutputFileName(targetName);
      setOutputFileSize(updatedBytes.length);
    } catch (err: any) {
      console.error(err);
      setErrorMessage(`Error geotagging video: ${err.message || 'Operation failed'}`);
    } finally {
      setIsProcessing(false);
      setStatusMessage('');
    }
  };

  const handleRemoveGeoTag = async () => {
    if (!file) return;

    if (!confirm('Are you sure you want to strip all GPS location metadata from this video?')) {
      return;
    }

    setIsProcessing(true);
    setStatusMessage('Stripping location metadata atoms from video...');
    setErrorMessage(null);

    try {
      const buffer = await file.arrayBuffer();
      const rawBytes = new Uint8Array(buffer);
      const cleanedBytes = VideoGeotagEngine.removeGPS(rawBytes);

      // Verify removal
      const checkGps = VideoGeotagEngine.readGPS(cleanedBytes);
      if (checkGps) {
        throw new Error('GPS metadata could not be completely removed.');
      }

      const blob = new Blob([cleanedBytes.buffer as ArrayBuffer], { type: 'video/mp4' });
      const newUrl = URL.createObjectURL(blob);

      let targetName = customFileName.trim() || 'video-cleaned.mp4';
      targetName = targetName.replace('-geotagged', '-cleaned');

      setOutputUrl(newUrl);
      setOutputFileName(targetName);
      setOutputFileSize(cleanedBytes.length);
      setVerification({
        verified: true,
        coordinates: undefined,
        mapsUrl: undefined,
      });
      setExistingGPS(null);
    } catch (err: any) {
      console.error(err);
      setErrorMessage(`Error removing location: ${err.message || 'Operation failed'}`);
    } finally {
      setIsProcessing(false);
      setStatusMessage('');
    }
  };

  const handleReset = () => {
    setFile(null);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    if (outputUrl) URL.revokeObjectURL(outputUrl);
    setPreviewUrl(null);
    setOutputUrl(null);
    setVerification(null);
    setExistingGPS(null);
    setFormatInfo(null);
    setErrorMessage(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className={styles.container}>
      {/* Breadcrumb Navigation */}
      <nav className={styles.breadcrumb} aria-label="Breadcrumb">
        <Link href="/" className={styles.breadcrumbLink}>
          Home
        </Link>
        <span>/</span>
        <Link href="/?category=video#tools-section" className={styles.breadcrumbLink}>
          Video & Audio
        </Link>
        <span>/</span>
        <span className={styles.breadcrumbActive}>Video Geo Tag Changer</span>
      </nav>

      {/* Main Header */}
      <header className={styles.headerContainer}>
        <h1 className={styles.title}>
          <span className={styles.iconWrapper} aria-hidden="true">
            📍
          </span>
          Video Geo Tag Changer – Edit GPS Metadata Online
        </h1>
        <p className={styles.subtitle}>
          Geotag video online free. Add, change, or edit GPS location metadata (Latitude, Longitude & Altitude) in MP4 and QuickTime MOV videos with zero quality loss and no server uploads.
        </p>
      </header>

      {/* Top Banner Ad Space */}
      <div style={{ marginBottom: '1.5rem' }}>
        <AdBanner format="horizontal" />
      </div>

      {/* Error Banner */}
      {errorMessage && (
        <div className={`${styles.statusBanner} ${styles.statusNeutral}`} style={{ borderColor: '#fca5a5', backgroundColor: '#fef2f2', color: '#991b1b', marginBottom: '1.5rem' }}>
          <AlertCircle size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
          <div>
            <strong>Error: </strong> {errorMessage}
          </div>
        </div>
      )}

      {/* Upload & Workspace Card */}
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <h2 className={styles.cardTitle}>
            <FileVideo size={20} className="text-rose-500" />
            1. Select Video File
          </h2>
          {file && (
            <button type="button" onClick={handleReset} className={styles.btnSecondary} style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem' }}>
              <RefreshCw size={13} /> Change Video
            </button>
          )}
        </div>

        {!file ? (
          <div
            className={styles.dropZone}
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && fileInputRef.current?.click()}
            aria-label="Upload MP4 or MOV video file"
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="video/mp4,video/quicktime,video/x-m4v,.mp4,.mov,.m4v"
              className={styles.fileInput}
            />
            <div className={styles.dropIconWrapper}>
              <UploadCloud size={28} />
            </div>
            <p className={styles.dropText}>
              Click to browse or drop an MP4 or MOV video here
            </p>
            <p className={styles.dropSubtext}>
              Supports MP4, QuickTime MOV, M4V containers. 100% private in your browser.
            </p>
          </div>
        ) : (
          <div className={styles.previewBox}>
            {/* Native Video Player Preview */}
            {previewUrl && (
              <video
                src={previewUrl}
                controls
                playsInline
                className={styles.videoElement}
                aria-label="Uploaded video preview"
              />
            )}

            {/* Video File Meta Badges */}
            <div className={styles.fileMetaRow}>
              <span className={styles.metaBadge}>
                <strong>File:</strong> {file.name}
              </span>
              <span className={styles.metaBadge}>
                <strong>Size:</strong> {formatBytes(file.size)}
              </span>
              {formatInfo && (
                <span className={styles.metaBadge}>
                  <strong>Container:</strong> {formatInfo.format} ({formatInfo.majorBrand})
                </span>
              )}
            </div>

            {/* Detected Existing GPS Metadata Status */}
            {existingGPS ? (
              <div className={`${styles.statusBanner} ${styles.statusSuccess}`}>
                <CheckCircle2 size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <strong>Existing GPS Metadata Detected:</strong>
                  <div style={{ marginTop: '0.25rem', fontFamily: 'monospace' }}>
                    Latitude: {existingGPS.latitude.toFixed(6)}° | Longitude: {existingGPS.longitude.toFixed(6)}°
                    {existingGPS.altitude !== null ? ` | Alt: ${existingGPS.altitude}m` : ''}
                  </div>
                  <div style={{ marginTop: '0.35rem' }}>
                    <a
                      href={`https://www.google.com/maps?q=${existingGPS.latitude},${existingGPS.longitude}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: '#047857', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '4px', textDecoration: 'underline' }}
                    >
                      View existing location on Google Maps <ExternalLink size={12} />
                    </a>
                  </div>
                </div>
              </div>
            ) : (
              <div className={`${styles.statusBanner} ${styles.statusNeutral}`}>
                <AlertCircle size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <strong>No GPS Location Metadata Found:</strong> This video currently has no embedded geotags. Use the controls below to add GPS coordinates.
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* GPS Location Editor Controls (Visible once file uploaded) */}
      {file && (
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>
              <MapPin size={20} className="text-rose-500" />
              2. Set Video Location Coordinates
            </h2>
            <button
              type="button"
              onClick={handleUseCurrentGps}
              className={styles.btnSecondary}
              style={{ padding: '0.4rem 0.85rem', fontSize: '0.8125rem' }}
            >
              <Navigation size={14} className="text-rose-500" /> Use Current Location
            </button>
          </div>

          <p className={styles.cardDesc}>
            Enter exact decimal GPS coordinates. Latitude must be between -90 and +90; Longitude between -180 and +180.
          </p>

          {/* Coordinate Inputs */}
          <div className={styles.coordGrid}>
            <div className={styles.formGroup}>
              <label htmlFor="video-lat-input" className={styles.label}>
                Latitude (-90° to +90°)
              </label>
              <div className={styles.inputWrapper}>
                <input
                  id="video-lat-input"
                  type="number"
                  step="0.000001"
                  min="-90"
                  max="90"
                  value={lat}
                  onChange={(e) => setLat(e.target.value)}
                  placeholder="e.g. 28.613939"
                  className={styles.input}
                />
                <span className={styles.inputUnit}>°N/S</span>
              </div>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="video-lng-input" className={styles.label}>
                Longitude (-180° to +180°)
              </label>
              <div className={styles.inputWrapper}>
                <input
                  id="video-lng-input"
                  type="number"
                  step="0.000001"
                  min="-180"
                  max="180"
                  value={lng}
                  onChange={(e) => setLng(e.target.value)}
                  placeholder="e.g. 77.209021"
                  className={styles.input}
                />
                <span className={styles.inputUnit}>°E/W</span>
              </div>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="video-alt-input" className={styles.label}>
                Altitude (Optional)
              </label>
              <div className={styles.inputWrapper}>
                <input
                  id="video-alt-input"
                  type="number"
                  step="1"
                  value={altitude}
                  onChange={(e) => setAltitude(e.target.value)}
                  placeholder="e.g. 216"
                  className={styles.input}
                />
                <span className={styles.inputUnit}>m</span>
              </div>
            </div>
          </div>

          {/* City Presets */}
          <div className={styles.presetSection}>
            <div className={styles.presetTitle}>Popular City Quick Presets:</div>
            <div className={styles.presetGrid}>
              {CITY_PRESETS.map((preset) => {
                const isActive =
                  parseFloat(lat).toFixed(4) === preset.lat.toFixed(4) &&
                  parseFloat(lng).toFixed(4) === preset.lng.toFixed(4);
                return (
                  <button
                    key={preset.name}
                    type="button"
                    onClick={() => applyPreset(preset)}
                    className={`${styles.presetButton} ${isActive ? styles.presetButtonActive : ''}`}
                  >
                    📍 {preset.name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Custom File Name Input */}
          <div className={styles.formGroup} style={{ marginTop: '1.25rem' }}>
            <label htmlFor="custom-video-filename" className={styles.label}>
              Output Video File Name
            </label>
            <input
              id="custom-video-filename"
              type="text"
              value={customFileName}
              onChange={(e) => setCustomFileName(e.target.value)}
              placeholder="e.g. vacation-video-geotagged.mp4"
              className={styles.input}
            />
          </div>

          {/* Action Buttons */}
          <div className={styles.buttonRow}>
            <button
              type="button"
              onClick={handleApplyGeoTag}
              disabled={isProcessing}
              className={styles.btnPrimary}
            >
              {isProcessing ? (
                <>
                  <RefreshCw size={16} className="animate-spin" />
                  {statusMessage || 'Processing Video...'}
                </>
              ) : (
                <>
                  <Compass size={18} /> Apply & Embed Video GPS Metadata
                </>
              )}
            </button>

            {existingGPS && (
              <button
                type="button"
                onClick={handleRemoveGeoTag}
                disabled={isProcessing}
                className={styles.btnDanger}
              >
                <Trash2 size={16} /> Remove Location Metadata
              </button>
            )}
          </div>

          {/* Verified Output & Download Card */}
          {verification && outputUrl && (
            <div className={styles.verifyCard}>
              <div className={styles.verifyTitle}>
                <ShieldCheck size={20} />
                GPS Metadata Verified & Embedded Successfully!
              </div>

              {verification.coordinates && (
                <div className={styles.verifyCoordGrid}>
                  <div className={styles.verifyItem}>
                    <span className={styles.verifyItemLabel}>Verified Latitude</span>
                    <span className={styles.verifyItemVal}>
                      {verification.coordinates.latitude.toFixed(6)}°
                    </span>
                  </div>
                  <div className={styles.verifyItem}>
                    <span className={styles.verifyItemLabel}>Verified Longitude</span>
                    <span className={styles.verifyItemVal}>
                      {verification.coordinates.longitude.toFixed(6)}°
                    </span>
                  </div>
                  <div className={styles.verifyItem}>
                    <span className={styles.verifyItemLabel}>Output Size (Lossless)</span>
                    <span className={styles.verifyItemVal}>
                      {formatBytes(outputFileSize)}
                    </span>
                  </div>
                </div>
              )}

              {/* Verified Map Link */}
              {verification.mapsUrl && (
                <div style={{ marginBottom: '1.25rem' }}>
                  <a
                    href={verification.mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.btnSecondary}
                    style={{ fontSize: '0.8125rem', padding: '0.45rem 0.85rem', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                  >
                    <MapPin size={14} className="text-rose-500" /> View Pin on Google Maps <ExternalLink size={12} />
                  </a>
                </div>
              )}

              {/* Output Download Button */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'center' }}>
                <a
                  href={outputUrl}
                  download={outputFileName}
                  className={styles.btnPrimary}
                  style={{ backgroundColor: '#16a34a' }}
                >
                  <Download size={18} /> Download Geotagged Video ({formatBytes(outputFileSize)})
                </a>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Technical Specifications & Privacy Box */}
      <div className={styles.infoBox}>
        <div className={styles.infoTitle}>
          <ShieldCheck size={18} className="text-emerald-500" />
          Client-Side Zero-Reencode Architecture & Privacy Promise
        </div>
        <p className={styles.infoText}>
          <strong>How Video Geotagging Works:</strong> In MP4 and QuickTime MOV containers, GPS coordinates are stored inside the <code>moov.udta.©xyz</code> location atom adhering to the ISO 6709 standard. Our tool directly inserts or updates this metadata atom and shifts the internal sample chunk offset tables (<code>stco</code> &amp; <code>co64</code>).
        </p>
        <p className={styles.infoText} style={{ marginTop: '0.5rem' }}>
          <strong>Zero Re-encoding:</strong> The video frames and audio packets in the <code>mdat</code> container remain 100% bit-for-bit identical. There is zero compression artifacting, zero resolution loss, and instant processing speed.
        </p>
        <p className={styles.infoText} style={{ marginTop: '0.5rem' }}>
          <strong>Complete Privacy:</strong> Your video files are processed entirely inside your local device memory using client-side JavaScript. Files are never uploaded, transmitted, or stored on any external server.
        </p>
      </div>

      {/* Bottom Banner Ad Space */}
      <div style={{ marginTop: '2rem' }}>
        <AdBanner format="horizontal" />
      </div>
    </div>
  );
}
