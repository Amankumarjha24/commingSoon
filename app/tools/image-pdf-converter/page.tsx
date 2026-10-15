'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import AdBanner from '@/components/AdBanner';
import styles from './page.module.css';
import { PDFDocument } from 'pdf-lib';
import JSZip from 'jszip';
import {
  Image as ImageIcon,
  FileText,
  UploadCloud,
  Download,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Layers,
  Sparkles,
  Plus,
} from 'lucide-react';

interface ImageItem {
  id: string;
  file: File;
  previewUrl: string;
}

export default function ImagePdfConverterPage() {
  const [activeTab, setActiveTab] = useState<'imgToPdf' | 'pdfToImg'>('imgToPdf');

  // Tab 1: Images to PDF
  const [images, setImages] = useState<ImageItem[]>([]);
  const [pageSize, setPageSize] = useState<'A4' | 'fit'>('A4');
  const [margin, setMargin] = useState<number>(15);
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('portrait');
  const [isConvertingImg, setIsConvertingImg] = useState<boolean>(false);
  const [isScanning, setIsScanning] = useState<boolean>(false);

  // Tab 2: PDF to Images
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [isExtractingPdf, setIsExtractingPdf] = useState<boolean>(false);
  const [statusMsg, setStatusMsg] = useState<string>('');

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newItems: ImageItem[] = Array.from(files).map((f) => ({
      id: `${f.name}-${Date.now()}-${Math.random()}`,
      file: f,
      previewUrl: URL.createObjectURL(f),
    }));

    setImages((prev) => [...prev, ...newItems]);
  };

  const moveImage = (index: number, dir: 'left' | 'right') => {
    const target = dir === 'left' ? index - 1 : index + 1;
    if (target < 0 || target >= images.length) return;
    const updated = [...images];
    const [moved] = updated.splice(index, 1);
    updated.splice(target, 0, moved);
    setImages(updated);
  };

  const removeImage = (index: number) => {
    URL.revokeObjectURL(images[index].previewUrl);
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const clearAllImages = () => {
    images.forEach((img) => URL.revokeObjectURL(img.previewUrl));
    setImages([]);
  };

  // Convert Images to Single PDF with Scanner Laser Beam Effect
  const handleImagesToPdf = async () => {
    if (images.length === 0) return;
    setIsScanning(true);
    setIsConvertingImg(true);

    // Run laser scan animation for 1.8 seconds before finalizing PDF
    await new Promise((res) => setTimeout(res, 1800));

    try {
      const pdfDoc = await PDFDocument.create();

      for (const item of images) {
        const imageBytes = await item.file.arrayBuffer();
        let embeddedImage;

        if (item.file.type === 'image/jpeg' || item.file.type === 'image/jpg') {
          embeddedImage = await pdfDoc.embedJpg(imageBytes);
        } else if (item.file.type === 'image/png') {
          embeddedImage = await pdfDoc.embedPng(imageBytes);
        } else {
          // Convert other formats (WebP/GIF/BMP) to PNG via canvas
          const imgBitmap = await createImageBitmap(item.file);
          const canvas = document.createElement('canvas');
          canvas.width = imgBitmap.width;
          canvas.height = imgBitmap.height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(imgBitmap, 0, 0);
          const pngBlob = await new Promise<Blob | null>((res) => canvas.toBlob(res, 'image/png'));
          if (pngBlob) {
            const pngBytes = await pngBlob.arrayBuffer();
            embeddedImage = await pdfDoc.embedPng(pngBytes);
          }
        }

        if (!embeddedImage) continue;

        let pageWidth = 595.28; // Standard A4 points (72 DPI)
        let pageHeight = 841.89;

        if (orientation === 'landscape') {
          [pageWidth, pageHeight] = [pageHeight, pageWidth];
        }

        if (pageSize === 'fit') {
          pageWidth = embeddedImage.width + margin * 2;
          pageHeight = embeddedImage.height + margin * 2;
        }

        const page = pdfDoc.addPage([pageWidth, pageHeight]);

        const availableWidth = pageWidth - margin * 2;
        const availableHeight = pageHeight - margin * 2;

        const scale = Math.min(
          availableWidth / embeddedImage.width,
          availableHeight / embeddedImage.height,
          1
        );

        const imgWidth = embeddedImage.width * scale;
        const imgHeight = embeddedImage.height * scale;

        const x = (pageWidth - imgWidth) / 2;
        const y = (pageHeight - imgHeight) / 2;

        page.drawImage(embeddedImage, {
          x,
          y,
          width: imgWidth,
          height: imgHeight,
        });
      }

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes as any], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `converted-documents-${Date.now()}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err: any) {
      console.error(err);
      alert('Failed to generate PDF: ' + err.message);
    } finally {
      setIsScanning(false);
      setIsConvertingImg(false);
    }
  };

  // Convert PDF to Images
  const handlePdfToImages = async () => {
    if (!pdfFile) return;
    setIsExtractingPdf(true);
    setStatusMsg('Parsing PDF pages...');

    try {
      const buffer = await pdfFile.arrayBuffer();
      const pdf = await PDFDocument.load(buffer);
      const count = pdf.getPageCount();

      setStatusMsg(`Rendering ${count} page(s) to high-resolution images...`);

      const pdfjsLib = await import('pdfjs-dist');
      pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

      const loadingTask = pdfjsLib.getDocument({ data: new Uint8Array(buffer) });
      const pdfDoc = await loadingTask.promise;

      const zip = new JSZip();

      for (let pageNum = 1; pageNum <= pdfDoc.numPages; pageNum++) {
        setStatusMsg(`Converting Page ${pageNum} of ${pdfDoc.numPages}...`);
        const page = await pdfDoc.getPage(pageNum);
        const viewport = page.getViewport({ scale: 2.0 });
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = viewport.width;
        canvas.height = viewport.height;

        if (ctx) {
          await (page.render as any)({ canvasContext: ctx, viewport, canvas }).promise;
          const imageBlob = await new Promise<Blob | null>((res) =>
            canvas.toBlob(res, 'image/png', 0.95)
          );
          if (imageBlob) {
            zip.file(`page-${pageNum}.png`, imageBlob);
          }
        }
      }

      setStatusMsg('Packaging images into ZIP...');
      const zipBlob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(zipBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${pdfFile.name.replace('.pdf', '')}-images.zip`;
      a.click();
      URL.revokeObjectURL(url);
      setStatusMsg(`Success! All ${count} pages downloaded as high-res PNG images in ZIP.`);
    } catch (err: any) {
      console.error(err);
      setStatusMsg('Error extracting images: ' + err.message);
    } finally {
      setIsExtractingPdf(false);
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
        <Link href="/?category=pdf#tools-section" className={styles.breadcrumbLink}>
          PDF Tools
        </Link>
        <span>/</span>
        <span className={styles.breadcrumbActive}>Image ↔ PDF Converter</span>
      </div>

      {/* Header */}
      <div className={styles.headerContainer}>
        <h1 className={styles.title}>
          <span className={styles.iconWrapper}>🖼️</span>
          Image ↔ PDF Converter
        </h1>
        <p className={styles.subtitle}>
          Convert photos (JPG, PNG, WebP) into an organized PDF document with laser-scanner preview, or extract PDF pages to high-res images in 1 click.
        </p>
      </div>

      {/* Tab Switcher */}
      <div className={styles.tabSelector}>
        <button
          onClick={() => setActiveTab('imgToPdf')}
          className={`${styles.tabBtn} ${activeTab === 'imgToPdf' ? styles.tabBtnActive : ''}`}
        >
          <ImageIcon style={{ width: '1.1rem', height: '1.1rem' }} />
          <span>Images to PDF</span>
        </button>
        <button
          onClick={() => setActiveTab('pdfToImg')}
          className={`${styles.tabBtn} ${activeTab === 'pdfToImg' ? styles.tabBtnActive : ''}`}
        >
          <FileText style={{ width: '1.1rem', height: '1.1rem' }} />
          <span>PDF to Images (PNG/ZIP)</span>
        </button>
      </div>

      {/* TAB 1: Images to PDF */}
      {activeTab === 'imgToPdf' && (
        <div className={styles.card}>
          {images.length === 0 ? (
            <label className={styles.dropzone}>
              <input
                type="file"
                multiple
                accept="image/png,image/jpeg,image/webp,image/gif"
                onChange={handleImageUpload}
                style={{ display: 'none' }}
              />
              <UploadCloud className={styles.dropIcon} />
              <div className={styles.dropText}>Choose Images (JPG, PNG, WebP)</div>
              <div className={styles.dropSub}>Select multiple photos to combine into a single PDF</div>
            </label>
          ) : (
            <div style={{ width: '100%' }}>
              {/* Top Toolbar */}
              <div className={styles.topActionsRow}>
                <div>
                  <strong>{images.length} Image(s) Selected</strong>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <label className={styles.addMoreBtn}>
                    <input
                      type="file"
                      multiple
                      accept="image/png,image/jpeg,image/webp,image/gif"
                      onChange={handleImageUpload}
                      style={{ display: 'none' }}
                    />
                    <Plus style={{ width: '0.9rem', height: '0.9rem' }} />
                    <span>Add More</span>
                  </label>
                  <button
                    onClick={clearAllImages}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#ef4444',
                      cursor: 'pointer',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                    }}
                  >
                    Clear All
                  </button>
                </div>
              </div>

              {/* SCANNER CONTAINER WITH LASER BEAM */}
              <div className={styles.scannerContainer}>
                {isScanning && (
                  <>
                    <div className={styles.scannerBeam} />
                    <div className={styles.scannerGlow} />
                    <div className={styles.scanningBadge}>
                      <Sparkles style={{ width: '1rem', height: '1rem' }} />
                      <span>Laser Scanning Images & Synthesizing Vector PDF...</span>
                    </div>
                  </>
                )}

                {/* Centered Preview Grid */}
                <div className={styles.previewGrid}>
                  {images.map((img, idx) => (
                    <div key={img.id} className={styles.imageCard}>
                      <img src={img.previewUrl} alt={img.file.name} className={styles.thumbImg} />
                      <span className={styles.imageName}>{img.file.name}</span>
                      <div className={styles.imageActions}>
                        <button
                          onClick={() => moveImage(idx, 'left')}
                          disabled={idx === 0}
                          className={styles.actionIconBtn}
                          title="Move Left"
                        >
                          <ChevronLeft style={{ width: '0.8rem', height: '0.8rem' }} />
                        </button>
                        <button
                          onClick={() => moveImage(idx, 'right')}
                          disabled={idx === images.length - 1}
                          className={styles.actionIconBtn}
                          title="Move Right"
                        >
                          <ChevronRight style={{ width: '0.8rem', height: '0.8rem' }} />
                        </button>
                        <button
                          onClick={() => removeImage(idx)}
                          className={`${styles.actionIconBtn} ${styles.deleteIconBtn}`}
                          title="Remove Image"
                        >
                          <Trash2 style={{ width: '0.8rem', height: '0.8rem' }} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* PDF Settings */}
              <div className={styles.optionsGrid} style={{ marginTop: '1.5rem' }}>
                <div>
                  <label className={styles.label}>Page Size</label>
                  <select
                    value={pageSize}
                    onChange={(e) => setPageSize(e.target.value as any)}
                    className={styles.select}
                  >
                    <option value="A4">Standard A4 Sheet</option>
                    <option value="fit">Fit to Image Size</option>
                  </select>
                </div>

                <div>
                  <label className={styles.label}>Orientation</label>
                  <select
                    value={orientation}
                    onChange={(e) => setOrientation(e.target.value as any)}
                    className={styles.select}
                  >
                    <option value="portrait">Portrait</option>
                    <option value="landscape">Landscape</option>
                  </select>
                </div>

                <div>
                  <label className={styles.label}>Margins</label>
                  <select
                    value={margin}
                    onChange={(e) => setMargin(parseInt(e.target.value, 10))}
                    className={styles.select}
                  >
                    <option value={0}>No Margin (Edge to Edge)</option>
                    <option value={15}>Small Margin (15px)</option>
                    <option value={30}>Large Margin (30px)</option>
                  </select>
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={handleImagesToPdf}
                disabled={isConvertingImg || isScanning}
                className={styles.actionBtn}
              >
                <Download style={{ width: '1.2rem', height: '1.2rem' }} />
                <span>
                  {isScanning
                    ? 'Scanning & Building PDF...'
                    : `Scan & Convert ${images.length} Image(s) to PDF`}
                </span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: PDF to Images */}
      {activeTab === 'pdfToImg' && (
        <div className={styles.card}>
          <label className={styles.dropzone}>
            <input
              type="file"
              accept=".pdf,application/pdf"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) {
                  setPdfFile(f);
                  setStatusMsg('');
                }
              }}
              style={{ display: 'none' }}
            />
            <FileText className={styles.dropIcon} />
            <div className={styles.dropText}>
              {pdfFile ? pdfFile.name : 'Choose a PDF to Extract Images'}
            </div>
            <div className={styles.dropSub}>Extracts every page as high-res PNG and packages into a ZIP</div>
          </label>

          {pdfFile && (
            <div style={{ marginTop: '1.5rem', width: '100%' }}>
              <button
                onClick={handlePdfToImages}
                disabled={isExtractingPdf}
                className={styles.actionBtn}
              >
                <Download style={{ width: '1.2rem', height: '1.2rem' }} />
                <span>{isExtractingPdf ? 'Extracting Pages...' : 'Convert PDF Pages to Images (ZIP)'}</span>
              </button>

              {statusMsg && (
                <div style={{ marginTop: '1rem', textAlign: 'center', fontSize: '0.85rem', fontWeight: 600 }}>
                  {statusMsg}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      <AdBanner format="horizontal" />
    </div>
  );
}
