'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { UploadCloud, MapPin, Compass, Download, CheckCircle2, Navigation, ExternalLink, RefreshCw, FileText } from 'lucide-react';
import AdBanner from '@/components/AdBanner';
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

export default function GeoTagChangerPage() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [lat, setLat] = useState<string>('28.613939');
  const [lng, setLng] = useState<string>('77.209021');
  const [altitude, setAltitude] = useState<string>('216');
  const [customFileName, setCustomFileName] = useState<string>('');
  
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [outputUrl, setOutputUrl] = useState<string | null>(null);
  const [finalFileName, setFinalFileName] = useState<string>('');
  const [verifiedGps, setVerifiedGps] = useState<{ lat: string; lng: string; mapsUrl: string } | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    setFile(selected);
    setOutputUrl(null);
    setVerifiedGps(null);

    // Default clean file name based on uploaded file
    const baseName = selected.name.replace(/\.[^/.]+$/, '');
    setCustomFileName(`${baseName}-geotagged.jpg`);

    const url = URL.createObjectURL(selected);
    setPreviewUrl(url);

    // Read existing EXIF GPS if available to pre-fill
    const reader = new FileReader();
    reader.onload = async (re) => {
      const dataUrl = re.target?.result as string;
      try {
        const piexif = (await import('piexifjs')).default || await import('piexifjs');
        const exifObj = piexif.load(dataUrl);
        if (exifObj['GPS'] && exifObj['GPS'][piexif.GPSIFD.GPSLatitude]) {
          const readLat = piexif.GPSHelper.dmsRationalToDeg(
            exifObj['GPS'][piexif.GPSIFD.GPSLatitude],
            exifObj['GPS'][piexif.GPSIFD.GPSLatitudeRef] || 'N'
          );
          const readLng = piexif.GPSHelper.dmsRationalToDeg(
            exifObj['GPS'][piexif.GPSIFD.GPSLongitude],
            exifObj['GPS'][piexif.GPSIFD.GPSLongitudeRef] || 'E'
          );
          setLat(readLat.toFixed(6));
          setLng(readLng.toFixed(6));

          if (exifObj['GPS'][piexif.GPSIFD.GPSAltitude]) {
            const alt = exifObj['GPS'][piexif.GPSIFD.GPSAltitude];
            if (alt[1]) setAltitude((alt[0] / alt[1]).toFixed(0));
          }
        }
      } catch (e) {
        // No existing EXIF found
      }
    };
    reader.readAsDataURL(selected);
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
        if (pos.coords.altitude) {
          setAltitude(pos.coords.altitude.toFixed(0));
        }
      },
      (err) => {
        alert('Could not access GPS location. Please allow browser location access or type coordinates manually.');
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
    if (!file || !previewUrl) return;

    const latNum = parseFloat(lat);
    const lngNum = parseFloat(lng);
    const altNum = parseFloat(altitude) || 0;

    if (isNaN(latNum) || latNum < -90 || latNum > 90) {
      alert('Please enter a valid Latitude between -90 and 90 degrees.');
      return;
    }
    if (isNaN(lngNum) || lngNum < -180 || lngNum > 180) {
      alert('Please enter a valid Longitude between -180 and 180 degrees.');
      return;
    }

    setIsProcessing(true);

    try {
      const piexif = (await import('piexifjs')).default || await import('piexifjs');

      // Convert image to JPEG data URL using canvas
      const img = new Image();
      const dataUrlPromise = new Promise<string>((resolve) => {
        img.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0);
          resolve(canvas.toDataURL('image/jpeg', 0.95));
        };
      });
      img.src = previewUrl;
      const baseJpegDataUrl = await dataUrlPromise;

      // Load existing EXIF or create fresh object
      let exifObj: any;
      try {
        exifObj = piexif.load(baseJpegDataUrl);
      } catch {
        exifObj = { '0th': {}, 'Exif': {}, 'GPS': {}, 'Interop': {}, '1st': {}, 'thumbnail': null };
      }

      if (!exifObj['GPS']) exifObj['GPS'] = {};
      if (!exifObj['0th']) exifObj['0th'] = {};

      // Calculate standard EXIF GPS tags
      const latAbs = Math.abs(latNum);
      const latRef = latNum >= 0 ? 'N' : 'S';
      const lngAbs = Math.abs(lngNum);
      const lngRef = lngNum >= 0 ? 'E' : 'W';

      exifObj['GPS'][piexif.GPSIFD.GPSVersionID] = [2, 3, 0, 0];
      exifObj['GPS'][piexif.GPSIFD.GPSLatitudeRef] = latRef;
      exifObj['GPS'][piexif.GPSIFD.GPSLatitude] = piexif.GPSHelper.degToDmsRational(latAbs);
      exifObj['GPS'][piexif.GPSIFD.GPSLongitudeRef] = lngRef;
      exifObj['GPS'][piexif.GPSIFD.GPSLongitude] = piexif.GPSHelper.degToDmsRational(lngAbs);
      exifObj['GPS'][piexif.GPSIFD.GPSAltitudeRef] = 0; // 0 = above sea level
      exifObj['GPS'][piexif.GPSIFD.GPSAltitude] = [Math.round(altNum * 100), 100];

      // Timestamp
      const now = new Date();
      const dateStamp = `${now.getUTCFullYear()}:${String(now.getUTCMonth() + 1).padStart(2, '0')}:${String(now.getUTCDate()).padStart(2, '0')}`;
      exifObj['GPS'][piexif.GPSIFD.GPSDateStamp] = dateStamp;
      exifObj['GPS'][piexif.GPSIFD.GPSTimeStamp] = [
        [now.getUTCHours(), 1],
        [now.getUTCMinutes(), 1],
        [now.getUTCSeconds(), 1],
      ];

      exifObj['0th'][piexif.ImageIFD.Software] = 'ToolsforTools Geo Tag Studio';

      // Dump and insert new EXIF bytes into JPEG
      const exifBytes = piexif.dump(exifObj);
      const newJpegDataUrl = piexif.insert(exifBytes, baseJpegDataUrl);

      // Verify the newly written GPS tags by reading back
      const verifyObj = piexif.load(newJpegDataUrl);
      const vLat = piexif.GPSHelper.dmsRationalToDeg(
        verifyObj['GPS'][piexif.GPSIFD.GPSLatitude],
        verifyObj['GPS'][piexif.GPSIFD.GPSLatitudeRef]
      );
      const vLng = piexif.GPSHelper.dmsRationalToDeg(
        verifyObj['GPS'][piexif.GPSIFD.GPSLongitude],
        verifyObj['GPS'][piexif.GPSIFD.GPSLongitudeRef]
      );

      setVerifiedGps({
        lat: `${vLat.toFixed(6)}° ${latRef}`,
        lng: `${vLng.toFixed(6)}° ${lngRef}`,
        mapsUrl: `https://www.google.com/maps?q=${vLat},${vLng}`,
      });

      // Prepare download URL
      setOutputUrl(newJpegDataUrl);

      // Prepare target file name
      let targetName = customFileName.trim();
      if (!targetName) targetName = 'geotagged-photo.jpg';
      if (!targetName.toLowerCase().endsWith('.jpg') && !targetName.toLowerCase().endsWith('.jpeg')) {
        targetName += '.jpg';
      }
      setFinalFileName(targetName);
    } catch (err: any) {
      console.error(err);
      alert('Error embedding Geo Tag: ' + err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className={styles.container}>
      {/* Breadcrumb */}
      <div className={styles.breadcrumb}>
        <Link href="/" className={styles.breadcrumbLink}>
          Home
        </Link>
        <span>/</span>
        <Link href="/?category=image#tools-section" className={styles.breadcrumbLink}>
          Photo & Image
        </Link>
        <span>/</span>
        <span className={styles.breadcrumbActive}>Geo Tag Changer</span>
      </div>

      <div className={styles.headerContainer}>
        <h1 className={styles.title}>
          <span className={styles.iconWrapper}>
            📍
          </span>
          Geo Tag Changer & EXIF GPS Editor
        </h1>
        <p className={styles.subtitle}>
          Add, change, or inject genuine GPS location coordinates (Latitude, Longitude & Altitude) into photos with custom file naming. 100% client-side.
        </p>
      </div>

      <div className={styles.card}>
        {!file ? (
          <label className={styles.dropzone}>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              style={{ display: 'none' }}
            />
            <UploadCloud className={styles.dropIcon} />
            <div className={styles.dropText}>Choose a Photo to Change or Add Geo Tag</div>
            <div className={styles.dropSub}>JPG, PNG, WebP supported (100% Private In-Browser Processing)</div>
          </label>
        ) : (
          <div className={styles.mainGrid}>
            {/* Left Preview Column */}
            <div className={styles.previewCol}>
              <img
                src={previewUrl || ''}
                alt="Selected photo"
                className={styles.previewImg}
              />
              <button
                type="button"
                onClick={() => {
                  setFile(null);
                  setPreviewUrl(null);
                  setOutputUrl(null);
                  setVerifiedGps(null);
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#ef4444',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                Change Photo
              </button>
            </div>

            {/* Right Form Column */}
            <div className={styles.formCol}>
              {/* Location Credentials Section */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#1c1917' }}>
                  Location Credentials (GPS)
                </span>
                <button
                  type="button"
                  onClick={handleUseCurrentGps}
                  className={styles.gpsBtn}
                >
                  <Navigation style={{ width: '0.8rem', height: '0.8rem' }} />
                  <span>Use My Current GPS</span>
                </button>
              </div>

              {/* Coordinates Inputs */}
              <div className={styles.twoCols}>
                <div className={styles.inputGroup}>
                  <label className={styles.label}>
                    <span>Latitude (Decimal)</span>
                    <span style={{ color: '#f97316' }}>{parseFloat(lat) >= 0 ? 'North' : 'South'}</span>
                  </label>
                  <input
                    type="number"
                    step="0.000001"
                    value={lat}
                    onChange={(e) => setLat(e.target.value)}
                    placeholder="28.613939"
                    className={styles.input}
                  />
                </div>

                <div className={styles.inputGroup}>
                  <label className={styles.label}>
                    <span>Longitude (Decimal)</span>
                    <span style={{ color: '#f97316' }}>{parseFloat(lng) >= 0 ? 'East' : 'West'}</span>
                  </label>
                  <input
                    type="number"
                    step="0.000001"
                    value={lng}
                    onChange={(e) => setLng(e.target.value)}
                    placeholder="77.209021"
                    className={styles.input}
                  />
                </div>
              </div>

              {/* Altitude & Date */}
              <div className={styles.twoCols}>
                <div className={styles.inputGroup}>
                  <label className={styles.label}>
                    <span>Altitude (Meters)</span>
                  </label>
                  <input
                    type="number"
                    value={altitude}
                    onChange={(e) => setAltitude(e.target.value)}
                    placeholder="216"
                    className={styles.input}
                  />
                </div>

                <div className={styles.inputGroup}>
                  <label className={styles.label}>
                    <span>Quick Coordinates Link</span>
                  </label>
                  <a
                    href={`https://www.google.com/maps?q=${lat},${lng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      color: '#ea580c',
                      textDecoration: 'none',
                      marginTop: '0.5rem',
                    }}
                  >
                    <span>Preview Location on Google Maps</span>
                    <ExternalLink style={{ width: '0.85rem', height: '0.85rem' }} />
                  </a>
                </div>
              </div>

              {/* City Presets Bar */}
              <div className={styles.inputGroup}>
                <label className={styles.label}>
                  <span>Popular City Presets</span>
                </label>
                <div className={styles.presetBar}>
                  {CITY_PRESETS.map((city) => (
                    <button
                      key={city.name}
                      type="button"
                      onClick={() => applyPreset(city)}
                      className={styles.presetBtn}
                    >
                      {city.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom File Name Input */}
              <div className={styles.inputGroup}>
                <label className={styles.label}>
                  <span>New Output File Name</span>
                  <span style={{ fontSize: '0.7rem', color: '#78716c' }}>Include .jpg extension</span>
                </label>
                <input
                  type="text"
                  value={customFileName}
                  onChange={(e) => setCustomFileName(e.target.value)}
                  placeholder="e.g. gateway-of-india-delhi.jpg"
                  className={styles.input}
                />
              </div>

              {/* Action Button */}
              <button
                type="button"
                onClick={handleApplyGeoTag}
                disabled={isProcessing}
                className={styles.primaryBtn}
              >
                {isProcessing ? (
                  <>
                    <RefreshCw className="animate-spin" style={{ width: '1.1rem', height: '1.1rem' }} />
                    <span>Injecting Binary EXIF GPS Tags...</span>
                  </>
                ) : (
                  <>
                    <MapPin style={{ width: '1.1rem', height: '1.1rem' }} />
                    <span>Apply & Change Geo Tag Now</span>
                  </>
                )}
              </button>

              {/* Verified Result Box */}
              {outputUrl && verifiedGps && (
                <div className={styles.successBox}>
                  <div className={styles.successTitle}>
                    <CheckCircle2 style={{ width: '1.25rem', height: '1.25rem' }} />
                    <span>Verified Real EXIF Geo Tag Embedded!</span>
                  </div>
                  <div className={styles.successDesc}>
                    GPS Coordinates: <strong>{verifiedGps.lat}, {verifiedGps.lng}</strong> written directly to the JPEG header.
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
                    <a
                      href={outputUrl}
                      download={finalFileName}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.4rem',
                        padding: '0.65rem 1.25rem',
                        borderRadius: '0.65rem',
                        backgroundColor: '#16a34a',
                        color: '#ffffff',
                        fontWeight: 700,
                        fontSize: '0.85rem',
                        textDecoration: 'none',
                        boxShadow: '0 2px 4px rgba(22, 163, 74, 0.25)',
                      }}
                    >
                      <Download style={{ width: '1rem', height: '1rem' }} />
                      <span>Download {finalFileName}</span>
                    </a>

                    <a
                      href={verifiedGps.mapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        color: '#166534',
                        textDecoration: 'none',
                      }}
                    >
                      <span>Check on Google Maps</span>
                      <ExternalLink style={{ width: '0.85rem', height: '0.85rem' }} />
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <AdBanner format="horizontal" />
    </div>
  );
}
