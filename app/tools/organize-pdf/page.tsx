'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import AdBanner from '@/components/AdBanner';
import styles from './page.module.css';
import { PDFDocument, degrees } from 'pdf-lib';
import {
  FileText,
  RotateCw,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Download,
  Copy,
  Layers,
  Sparkles,
} from 'lucide-react';

interface PageItem {
  id: string;
  originalIndex: number;
  rotation: number; // 0, 90, 180, 270
}

export default function OrganizePdfPage() {
  const [file, setFile] = useState<File | null>(null);
  const [pages, setPages] = useState<PageItem[]>([]);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    try {
      const buffer = await selected.arrayBuffer();
      const pdf = await PDFDocument.load(buffer);
      const count = pdf.getPageCount();

      const initialPages: PageItem[] = Array.from({ length: count }, (_, i) => ({
        id: `page-${i}-${Date.now()}`,
        originalIndex: i,
        rotation: 0,
      }));

      setFile(selected);
      setPages(initialPages);
    } catch (err) {
      console.error(err);
      alert('Could not read PDF. It might be password protected or corrupted.');
    }
  };

  const movePage = (index: number, direction: 'left' | 'right') => {
    const targetIndex = direction === 'left' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= pages.length) return;

    const updated = [...pages];
    const [moved] = updated.splice(index, 1);
    updated.splice(targetIndex, 0, moved);
    setPages(updated);
  };

  const rotatePage = (index: number) => {
    const updated = [...pages];
    updated[index].rotation = (updated[index].rotation + 90) % 360;
    setPages(updated);
  };

  const rotateAllPages = () => {
    setPages((prev) =>
      prev.map((p) => ({
        ...p,
        rotation: (p.rotation + 90) % 360,
      }))
    );
  };

  const deletePage = (index: number) => {
    if (pages.length <= 1) {
      alert('PDF must have at least one page.');
      return;
    }
    const updated = pages.filter((_, i) => i !== index);
    setPages(updated);
  };

  const duplicatePage = (index: number) => {
    const target = pages[index];
    const updated = [...pages];
    updated.splice(index + 1, 0, {
      ...target,
      id: `copy-${Date.now()}-${Math.random()}`,
    });
    setPages(updated);
  };

  const handleSavePdf = async () => {
    if (!file || pages.length === 0) return;
    setIsProcessing(true);

    try {
      // Simulate laser scanner beam effect for 1.5s
      await new Promise((r) => setTimeout(r, 1500));

      const buffer = await file.arrayBuffer();
      const srcPdf = await PDFDocument.load(buffer);
      const newPdf = await PDFDocument.create();

      for (const item of pages) {
        const [copied] = await newPdf.copyPages(srcPdf, [item.originalIndex]);
        if (item.rotation !== 0) {
          const currentRotation = copied.getRotation().angle;
          copied.setRotation(degrees((currentRotation + item.rotation) % 360));
        }
        newPdf.addPage(copied);
      }

      const pdfBytes = await newPdf.save();
      const blob = new Blob([pdfBytes as any], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${file.name.replace('.pdf', '')}-organized.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err: any) {
      console.error(err);
      alert('Error creating organized PDF: ' + err.message);
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
        <Link href="/?category=pdf#tools-section" className={styles.breadcrumbLink}>
          PDF Tools
        </Link>
        <span>/</span>
        <span className={styles.breadcrumbActive}>PDF Page Organizer</span>
      </div>

      {/* Header */}
      <div className={styles.headerContainer}>
        <h1 className={styles.title}>
          <span className={styles.iconWrapper}>📑</span>
          PDF Page Organizer
        </h1>
        <p className={styles.subtitle}>
          Visually reorder pages, rotate sideways sheets, delete blank pages, or duplicate slides with 100% client-side privacy.
        </p>
      </div>

      <div className={styles.card}>
        {!file ? (
          <label className={styles.dropzone}>
            <input
              type="file"
              accept=".pdf,application/pdf"
              onChange={handleFileChange}
              style={{ display: 'none' }}
            />
            <Layers className={styles.dropIcon} />
            <div className={styles.dropText}>Choose a PDF to Organize Pages</div>
            <div className={styles.dropSub}>Drag & drop or browse your document (Zero Server Upload)</div>
          </label>
        ) : (
          <div className={styles.scannerContainer}>
            {isProcessing && (
              <>
                <div className={styles.scannerBeam} />
                <div className={styles.scannerGlow} />
                <div style={{ textAlign: 'center', width: '100%' }}>
                  <div className={styles.scanningBadge}>
                    <Sparkles style={{ width: '1rem', height: '1rem' }} />
                    <span>Laser Scanning & Re-indexing PDF Pages...</span>
                  </div>
                </div>
              </>
            )}

            {/* Top Toolbar */}
            <div className={styles.topBar}>
              <div>
                <strong>{file.name}</strong> • {pages.length} Pages
              </div>
              <div className={styles.controlsGroup}>
                <button onClick={rotateAllPages} className={styles.toolBtn}>
                  <RotateCw style={{ width: '0.9rem', height: '0.9rem' }} /> Rotate All 90°
                </button>
                <button onClick={() => setFile(null)} className={styles.toolBtn}>
                  Change File
                </button>
              </div>
            </div>

            {/* Pages Grid */}
            <div className={styles.pagesGrid}>
              {pages.map((p, idx) => (
                <div key={p.id} className={styles.pageCard}>
                  {/* Thumbnail */}
                  <div
                    className={styles.pageThumbnail}
                    style={{
                      transform: `rotate(${p.rotation}deg)`,
                    }}
                  >
                    <span className={styles.pageNumberBadge}>Page {idx + 1}</span>
                    <span className={styles.pageOriginalNumber}>(Original #{p.originalIndex + 1})</span>
                  </div>

                  {/* Actions Bar */}
                  <div className={styles.cardActions}>
                    <button
                      onClick={() => movePage(idx, 'left')}
                      disabled={idx === 0}
                      title="Move Left"
                      className={styles.actionIconBtn}
                    >
                      <ChevronLeft style={{ width: '0.9rem', height: '0.9rem' }} />
                    </button>

                    <button
                      onClick={() => rotatePage(idx)}
                      title="Rotate 90°"
                      className={styles.actionIconBtn}
                    >
                      <RotateCw style={{ width: '0.85rem', height: '0.85rem' }} />
                    </button>

                    <button
                      onClick={() => duplicatePage(idx)}
                      title="Duplicate Page"
                      className={styles.actionIconBtn}
                    >
                      <Copy style={{ width: '0.85rem', height: '0.85rem' }} />
                    </button>

                    <button
                      onClick={() => movePage(idx, 'right')}
                      disabled={idx === pages.length - 1}
                      title="Move Right"
                      className={styles.actionIconBtn}
                    >
                      <ChevronRight style={{ width: '0.9rem', height: '0.9rem' }} />
                    </button>

                    <button
                      onClick={() => deletePage(idx)}
                      title="Delete Page"
                      className={`${styles.actionIconBtn} ${styles.deleteIconBtn}`}
                    >
                      <Trash2 style={{ width: '0.85rem', height: '0.85rem' }} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Download Button */}
            <button
              onClick={handleSavePdf}
              disabled={isProcessing}
              className={styles.saveBtn}
            >
              <Download style={{ width: '1.2rem', height: '1.2rem' }} />
              <span>{isProcessing ? 'Generating Clean PDF...' : 'Download Organized PDF'}</span>
            </button>
          </div>
        )}
      </div>

      <AdBanner format="horizontal" />
    </div>
  );
}
