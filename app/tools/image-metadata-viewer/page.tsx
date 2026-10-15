'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { UploadCloud, ShieldCheck, Download, CheckCircle2, MapPin, Camera, Calendar, ExternalLink } from 'lucide-react';
import AdBanner from '@/components/AdBanner';
import styles from './page.module.css';

export default function ImageMetadataViewerPage() {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [meta, setMeta] = useState<any>(null);
  const [exifData, setExifData] = useState<any>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [strippedUrl, setStrippedUrl] = useState<string | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageFile(file);
    setStrippedUrl(null);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);

    const img = new Image();
    img.onload = async () => {
      setMeta({
        fileName: file.name,
        fileSize: `${(file.size / 1024).toFixed(1)} KB`,
        mimeType: file.type || 'image/jpeg',
        dimensions: `${img.width} × ${img.height} px`,
        aspectRatio: (img.width / img.height).toFixed(2),
        megapixels: `${((img.width * img.height) / 1000000).toFixed(1)} MP`,
        lastModified: new Date(file.lastModified).toLocaleString(),
        colorDepth: '24-bit sRGB',
        rawBytes: `${file.size} bytes`,
      });

      // Attempt to parse EXIF with piexifjs
      const reader = new FileReader();
      reader.onload = async (re) => {
        const dataUrl = re.target?.result as string;
        try {
          const piexif = (await import('piexifjs')).default || await import('piexifjs');
          const exifObj = piexif.load(dataUrl);

          const parsedExif: any = {};

          if (exifObj['0th']) {
            parsedExif.cameraMake = exifObj['0th'][piexif.ImageIFD.Make];
            parsedExif.cameraModel = exifObj['0th'][piexif.ImageIFD.Model];
            parsedExif.software = exifObj['0th'][piexif.ImageIFD.Software];
          }

          if (exifObj['Exif']) {
            parsedExif.dateOriginal = exifObj['Exif'][piexif.ExifIFD.DateTimeOriginal];
            const iso = exifObj['Exif'][piexif.ExifIFD.ISOSpeedRatings];
            if (iso) parsedExif.iso = Array.isArray(iso) ? iso[0] : iso;

            const fnum = exifObj['Exif'][piexif.ExifIFD.FNumber];
            if (fnum && fnum[1]) parsedExif.aperture = `f/${(fnum[0] / fnum[1]).toFixed(1)}`;

            const exp = exifObj['Exif'][piexif.ExifIFD.ExposureTime];
            if (exp && exp[1]) parsedExif.shutter = `${exp[0]}/${exp[1]}s`;
          }

          if (exifObj['GPS'] && exifObj['GPS'][piexif.GPSIFD.GPSLatitude]) {
            try {
              const latDeg = piexif.GPSHelper.dmsRationalToDeg(
                exifObj['GPS'][piexif.GPSIFD.GPSLatitude],
                exifObj['GPS'][piexif.GPSIFD.GPSLatitudeRef] || 'N'
              );
              const lngDeg = piexif.GPSHelper.dmsRationalToDeg(
                exifObj['GPS'][piexif.GPSIFD.GPSLongitude],
                exifObj['GPS'][piexif.GPSIFD.GPSLongitudeRef] || 'E'
              );

              let altStr = undefined;
              if (exifObj['GPS'][piexif.GPSIFD.GPSAltitude]) {
                const alt = exifObj['GPS'][piexif.GPSIFD.GPSAltitude];
                if (alt[1]) altStr = `${(alt[0] / alt[1]).toFixed(1)} m`;
              }

              parsedExif.gps = {
                latitude: latDeg.toFixed(6),
                longitude: lngDeg.toFixed(6),
                altitude: altStr,
                mapsUrl: `https://www.google.com/maps?q=${latDeg},${lngDeg}`,
              };
            } catch (gpsErr) {
              console.warn('GPS parsing notice:', gpsErr);
            }
          }

          setExifData(parsedExif);
        } catch (e) {
          // File may not be a JPEG or may have no EXIF block
          setExifData({});
        }
      };
      reader.readAsDataURL(file);
    };
    img.src = url;
  };

  const stripMetadata = async () => {
    if (!previewUrl || !imageFile) return;

    try {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0);

        canvas.toBlob((blob) => {
          if (blob) {
            const cleanUrl = URL.createObjectURL(blob);
            setStrippedUrl(cleanUrl);
          }
        }, 'image/jpeg', 0.95);
      };
      img.src = previewUrl;
    } catch (err) {
      console.error('Failed to strip metadata:', err);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.breadcrumb}>
        <Link href="/" className={styles.breadcrumbLink}>Home</Link>
        <span>/</span>
        <Link href="/?category=image#tools-section" className={styles.breadcrumbLink}>Photo & Image</Link>
        <span>/</span>
        <span className={styles.breadcrumbActive}>EXIF Metadata Viewer</span>
      </div>

      <div className={styles.headerContainer}>
        <h1 className={styles.title}>
          <span className={styles.iconWrapper}>🔍</span>
          EXIF Metadata Viewer & Stripper
        </h1>
        <p className={styles.subtitle}>
          Inspect hidden image metadata (camera model, shutter speed, GPS location coordinates) and scrub private EXIF data before sharing.
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
            <div className={styles.dropText}>Choose an Image to Inspect Metadata</div>
            <div className={styles.dropSub}>JPG, PNG, WebP supported (100% Client-Side In-Browser Privacy)</div>
          </label>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <img
                  src={previewUrl || ''}
                  alt="Thumbnail"
                  style={{ width: '56px', height: '56px', borderRadius: '0.65rem', objectFit: 'cover' }}
                />
                <div>
                  <div style={{ fontSize: '0.875rem', fontWeight: 800, color: '#1c1917' }}>{meta?.fileName}</div>
                  <div style={{ fontSize: '0.75rem', color: '#78716c' }}>{meta?.dimensions} • {meta?.fileSize}</div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setImageFile(null);
                  setMeta(null);
                  setExifData(null);
                  setPreviewUrl(null);
                  setStrippedUrl(null);
                }}
                style={{ background: 'none', border: 'none', color: '#ef4444', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }}
              >
                Change Image
              </button>
            </div>

            {/* GPS Highlight Card if present */}
            {exifData?.gps && (
              <div style={{
                padding: '1rem',
                borderRadius: '0.75rem',
                background: 'linear-gradient(135deg, rgba(254, 243, 199, 0.5), rgba(254, 215, 170, 0.4))',
                border: '1px solid #f97316',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '0.75rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{
                    width: '2.25rem',
                    height: '2.25rem',
                    borderRadius: '0.5rem',
                    background: '#f97316',
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <MapPin style={{ width: '1.25rem', height: '1.25rem' }} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#9a3412' }}>
                      📍 Embedded GPS Coordinates Found
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#7c2d12' }}>
                      Lat: {exifData.gps.latitude}°, Lng: {exifData.gps.longitude}° {exifData.gps.altitude ? `• Alt: ${exifData.gps.altitude}` : ''}
                    </div>
                  </div>
                </div>

                <a
                  href={exifData.gps.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    padding: '0.4rem 0.85rem',
                    borderRadius: '0.5rem',
                    background: '#ea580c',
                    color: '#fff',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    textDecoration: 'none'
                  }}
                >
                  <span>Open in Google Maps</span>
                  <ExternalLink style={{ width: '0.8rem', height: '0.8rem' }} />
                </a>
              </div>
            )}

            {/* Camera & EXIF Specific Details */}
            {exifData && (exifData.cameraMake || exifData.cameraModel || exifData.iso) && (
              <div style={{
                padding: '0.85rem 1.25rem',
                borderRadius: '0.75rem',
                backgroundColor: 'rgba(245, 245, 244, 0.6)',
                border: '1px solid #e7e5e4',
                display: 'flex',
                alignItems: 'center',
                gap: '1.5rem',
                flexWrap: 'wrap',
                fontSize: '0.75rem',
                color: '#44403c'
              }}>
                {exifData.cameraModel && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <Camera style={{ width: '0.9rem', height: '0.9rem', color: '#f97316' }} />
                    <span style={{ fontWeight: 700 }}>Camera:</span> {exifData.cameraMake ? `${exifData.cameraMake} ` : ''}{exifData.cameraModel}
                  </div>
                )}
                {exifData.dateOriginal && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <Calendar style={{ width: '0.9rem', height: '0.9rem', color: '#f97316' }} />
                    <span style={{ fontWeight: 700 }}>Captured:</span> {exifData.dateOriginal}
                  </div>
                )}
                {exifData.shutter && (
                  <div><span style={{ fontWeight: 700 }}>Shutter:</span> {exifData.shutter}</div>
                )}
                {exifData.aperture && (
                  <div><span style={{ fontWeight: 700 }}>Aperture:</span> {exifData.aperture}</div>
                )}
                {exifData.iso && (
                  <div><span style={{ fontWeight: 700 }}>ISO:</span> {exifData.iso}</div>
                )}
              </div>
            )}

            {/* General Technical File Metadata Grid */}
            {meta && (
              <div className={styles.metaGrid}>
                <div className={styles.metaCard}>
                  <span className={styles.metaKey}>Dimensions</span>
                  <span className={styles.metaVal}>{meta.dimensions}</span>
                </div>
                <div className={styles.metaCard}>
                  <span className={styles.metaKey}>File Size</span>
                  <span className={styles.metaVal}>{meta.fileSize}</span>
                </div>
                <div className={styles.metaCard}>
                  <span className={styles.metaKey}>Resolution</span>
                  <span className={styles.metaVal}>{meta.megapixels}</span>
                </div>
                <div className={styles.metaCard}>
                  <span className={styles.metaKey}>Aspect Ratio</span>
                  <span className={styles.metaVal}>{meta.aspectRatio} : 1</span>
                </div>
                <div className={styles.metaCard}>
                  <span className={styles.metaKey}>MIME Format</span>
                  <span className={styles.metaVal}>{meta.mimeType}</span>
                </div>
                <div className={styles.metaCard}>
                  <span className={styles.metaKey}>Color Model</span>
                  <span className={styles.metaVal}>{meta.colorDepth}</span>
                </div>
                <div className={styles.metaCard}>
                  <span className={styles.metaKey}>Date Modified</span>
                  <span className={styles.metaVal}>{meta.lastModified}</span>
                </div>
                <div className={styles.metaCard}>
                  <span className={styles.metaKey}>Total Byte Size</span>
                  <span className={styles.metaVal}>{meta.rawBytes}</span>
                </div>
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center', marginTop: '1rem' }}>
              {!strippedUrl ? (
                <button type="button" onClick={stripMetadata} className={styles.stripBtn}>
                  <ShieldCheck style={{ width: '1.2rem', height: '1.2rem' }} />
                  <span>Sanitize & Strip EXIF Metadata (Safe for Social Media)</span>
                </button>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#0891b2', fontWeight: 800, fontSize: '0.875rem' }}>
                    <CheckCircle2 style={{ width: '1.2rem', height: '1.2rem' }} />
                    <span>EXIF Scrubbed! All device & geolocation tags removed.</span>
                  </div>
                  <a
                    href={strippedUrl}
                    download={`sanitized-${imageFile.name}`}
                    className={styles.stripBtn}
                  >
                    <Download style={{ width: '1.1rem', height: '1.1rem' }} />
                    <span>Download Sanitized Clean Image</span>
                  </a>
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
