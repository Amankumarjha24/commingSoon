'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import AdBanner from '@/components/AdBanner';
import styles from './page.module.css';
import { PDFDocument, rgb, degrees, StandardFonts } from 'pdf-lib';
import {
  FileText,
  UploadCloud,
  Download,
  Stamp,
  Hash,
  Sparkles,
  PenTool,
} from 'lucide-react';

export default function PdfWatermarkNumberPage() {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState<number>(0);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isScanning, setIsScanning] = useState<boolean>(false);

  // Watermark Options
  const [enableWatermark, setEnableWatermark] = useState<boolean>(true);
  const [watermarkText, setWatermarkText] = useState<string>('CONFIDENTIAL');
  const [watermarkOpacity, setWatermarkOpacity] = useState<number>(0.25);
  const [watermarkColor, setWatermarkColor] = useState<'red' | 'gray' | 'blue'>('gray');
  const [watermarkDiagonal, setWatermarkDiagonal] = useState<boolean>(true);

  // Page Number Options
  const [enableNumbers, setEnableNumbers] = useState<boolean>(true);
  const [numberPosition, setNumberPosition] = useState<'bottom-center' | 'bottom-right' | 'top-right'>('bottom-center');
  const [numberFormat, setNumberFormat] = useState<'page_of_total' | 'simple'>('page_of_total');
  const [skipFirstPage, setSkipFirstPage] = useState<boolean>(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    try {
      const buffer = await selected.arrayBuffer();
      const pdf = await PDFDocument.load(buffer);
      setFile(selected);
      setPageCount(pdf.getPageCount());
    } catch (err) {
      console.error(err);
      alert('Could not read PDF. Ensure it is not password protected.');
    }
  };

  const handleProcessPdf = async () => {
    if (!file) return;
    setIsScanning(true);
    setIsProcessing(true);

    // Laser scan effect
    await new Promise((res) => setTimeout(res, 1800));

    try {
      const buffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(buffer);
      const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
      const regularFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
      const pages = pdfDoc.getPages();
      const total = pages.length;

      // Color mapping
      let wmRgb = rgb(0.5, 0.5, 0.5);
      if (watermarkColor === 'red') wmRgb = rgb(0.85, 0.2, 0.2);
      if (watermarkColor === 'blue') wmRgb = rgb(0.2, 0.4, 0.85);

      pages.forEach((page, index) => {
        const { width, height } = page.getSize();
        const pageNum = index + 1;

        // 1. Watermark
        if (enableWatermark && watermarkText.trim()) {
          const textSize = 50;
          const textWidth = font.widthOfTextAtSize(watermarkText, textSize);

          if (watermarkDiagonal) {
            page.drawText(watermarkText, {
              x: width / 2 - textWidth / 3,
              y: height / 2,
              size: textSize,
              font,
              color: wmRgb,
              opacity: watermarkOpacity,
              rotate: degrees(45),
            });
          } else {
            page.drawText(watermarkText, {
              x: (width - textWidth) / 2,
              y: height / 2,
              size: textSize,
              font,
              color: wmRgb,
              opacity: watermarkOpacity,
            });
          }
        }

        // 2. Page Numbers
        if (enableNumbers) {
          if (skipFirstPage && pageNum === 1) {
            // Skip cover page
            return;
          }

          const label =
            numberFormat === 'page_of_total'
              ? `Page ${pageNum} of ${total}`
              : `${pageNum} / ${total}`;

          const numSize = 10;
          const labelWidth = regularFont.widthOfTextAtSize(label, numSize);

          let x = (width - labelWidth) / 2;
          let y = 25; // bottom-center

          if (numberPosition === 'bottom-right') {
            x = width - labelWidth - 35;
            y = 25;
          } else if (numberPosition === 'top-right') {
            x = width - labelWidth - 35;
            y = height - 30;
          }

          page.drawText(label, {
            x,
            y,
            size: numSize,
            font: regularFont,
            color: rgb(0.3, 0.3, 0.3),
            opacity: 0.9,
          });
        }
      });

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes as any], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${file.name.replace('.pdf', '')}-watermarked.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err: any) {
      console.error(err);
      alert('Error applying finishes: ' + err.message);
    } finally {
      setIsScanning(false);
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
        <Link href="/?category=pdf#tools-section" className={styles.breadcrumbLink}>
          PDF Tools
        </Link>
        <span>/</span>
        <span className={styles.breadcrumbActive}>PDF Watermark & Numbering</span>
      </div>

      {/* Header */}
      <div className={styles.headerContainer}>
        <h1 className={styles.title}>
          <span className={styles.iconWrapper}>✍️</span>
          PDF Watermark & Numbering Toolkit
        </h1>
        <p className={styles.subtitle}>
          Stamp custom text watermarks, Bates/Page numbers ("Page X of Y"), and official headers across all pages with zero cloud upload.
        </p>
      </div>

      <div className={styles.card}>
        {!file ? (
          <label className={styles.dropzone}>
            <input
              type="file"
              accept=".pdf,application/pdf"
              onChange={handleFileUpload}
              style={{ display: 'none' }}
            />
            <Stamp className={styles.dropIcon} />
            <div className={styles.dropText}>Choose a PDF to Watermark & Number</div>
            <div className={styles.dropSub}>100% Client-Side • Bank statements, legal documents stay secure</div>
          </label>
        ) : (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <strong>{file.name}</strong> • {pageCount} Pages
              </div>
              <button
                onClick={() => setFile(null)}
                style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontWeight: 600 }}
              >
                Change PDF
              </button>
            </div>

            <div className={styles.sectionsGrid}>
              {/* Feature 1: Watermark */}
              <div className={styles.featureBox}>
                <div className={styles.featureTitle}>
                  <Stamp style={{ width: '1.1rem', height: '1.1rem', color: '#d97706' }} />
                  <span>Text Watermark</span>
                </div>

                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={enableWatermark}
                    onChange={(e) => setEnableWatermark(e.target.checked)}
                  />
                  <span>Enable Watermark Stamp</span>
                </label>

                {enableWatermark && (
                  <>
                    <div>
                      <label className={styles.label}>Watermark Text</label>
                      <input
                        type="text"
                        value={watermarkText}
                        onChange={(e) => setWatermarkText(e.target.value)}
                        placeholder="e.g. CONFIDENTIAL, DRAFT, COPY"
                        className={styles.input}
                      />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                      <div>
                        <label className={styles.label}>Color</label>
                        <select
                          value={watermarkColor}
                          onChange={(e) => setWatermarkColor(e.target.value as any)}
                          className={styles.select}
                        >
                          <option value="gray">Subtle Gray</option>
                          <option value="red">Urgent Red</option>
                          <option value="blue">Official Blue</option>
                        </select>
                      </div>

                      <div>
                        <label className={styles.label}>Opacity</label>
                        <select
                          value={watermarkOpacity}
                          onChange={(e) => setWatermarkOpacity(parseFloat(e.target.value))}
                          className={styles.select}
                        >
                          <option value={0.15}>15% (Very Light)</option>
                          <option value={0.25}>25% (Standard)</option>
                          <option value={0.45}>45% (Dark Stamp)</option>
                        </select>
                      </div>
                    </div>

                    <label className={styles.checkboxLabel}>
                      <input
                        type="checkbox"
                        checked={watermarkDiagonal}
                        onChange={(e) => setWatermarkDiagonal(e.target.checked)}
                      />
                      <span>Rotate Diagonally (45° Angle)</span>
                    </label>
                  </>
                )}
              </div>

              {/* Feature 2: Page Numbers */}
              <div className={styles.featureBox}>
                <div className={styles.featureTitle}>
                  <Hash style={{ width: '1.1rem', height: '1.1rem', color: '#d97706' }} />
                  <span>Page Numbering</span>
                </div>

                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={enableNumbers}
                    onChange={(e) => setEnableNumbers(e.target.checked)}
                  />
                  <span>Enable Page Numbers</span>
                </label>

                {enableNumbers && (
                  <>
                    <div>
                      <label className={styles.label}>Position</label>
                      <select
                        value={numberPosition}
                        onChange={(e) => setNumberPosition(e.target.value as any)}
                        className={styles.select}
                      >
                        <option value="bottom-center">Bottom Center (Standard)</option>
                        <option value="bottom-right">Bottom Right Corner</option>
                        <option value="top-right">Top Right Header</option>
                      </select>
                    </div>

                    <div>
                      <label className={styles.label}>Format</label>
                      <select
                        value={numberFormat}
                        onChange={(e) => setNumberFormat(e.target.value as any)}
                        className={styles.select}
                      >
                        <option value="page_of_total">Page X of Y (e.g. Page 1 of 12)</option>
                        <option value="simple">Simple Fraction (1 / 12)</option>
                      </select>
                    </div>

                    <label className={styles.checkboxLabel}>
                      <input
                        type="checkbox"
                        checked={skipFirstPage}
                        onChange={(e) => setSkipFirstPage(e.target.checked)}
                      />
                      <span>Skip Cover Page (Do not number Page 1)</span>
                    </label>
                  </>
                )}
              </div>
            </div>

            {isScanning && (
              <div className={styles.scannerContainer}>
                <div className={styles.scannerBeam} />
                <div className={styles.scannerGlow} />
                <div className={styles.scanningBadge}>
                  <Sparkles style={{ width: '1rem', height: '1rem' }} />
                  <span>Stamping Watermark & Generating Bates Numbers...</span>
                </div>
              </div>
            )}

            <button
              onClick={handleProcessPdf}
              disabled={isProcessing}
              className={styles.actionBtn}
            >
              <Download style={{ width: '1.2rem', height: '1.2rem' }} />
              <span>{isScanning ? 'Laser Stamping PDF...' : 'Download Finished PDF'}</span>
            </button>
          </div>
        )}
      </div>

      <AdBanner format="horizontal" />
    </div>
  );
}
