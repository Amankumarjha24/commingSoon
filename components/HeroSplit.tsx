'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import styles from './HeroSplit.module.css';

export default function HeroSplit() {
  const [activeToolIndex, setActiveToolIndex] = useState(0);

  const quickTools = [
    {
      name: 'Geo Tag Changer Pro',
      sub: 'Inject & change EXIF GPS coordinates',
      slug: 'geo-tag-changer',
      icon: '📍',
      bgLightClass: styles.toolIcon_bg_emerald_50_text_emerald_600,
    },
    {
      name: 'Photopea Studio',
      sub: 'PSD, XCF, RAW, PNG, JPG editing',
      slug: 'photopea-editor',
      icon: '🎨',
      bgLightClass: styles.toolIcon_bg_orange_50_text_orange_600,
    },
    {
      name: 'Target KB Compressor',
      sub: '20KB / 50KB / 100KB for exam portals',
      slug: 'image-compressor',
      icon: '📦',
      bgLightClass: styles.toolIcon_bg_red_50_text_red_600,
    },
    {
      name: 'Merge & Compress PDF',
      sub: 'Combine & shrink PDFs client-side',
      slug: 'merge-pdf',
      icon: '📄',
      bgLightClass: styles.toolIcon_bg_emerald_50_text_emerald_600,
    },
    {
      name: 'QR Code Generator',
      sub: 'ISO scannable WiFi, URL & text codes',
      slug: 'qr-generator',
      icon: '📱',
      bgLightClass: styles.toolIcon_bg_purple_50_text_purple_600,
    },
    {
      name: 'SIP Wealth Calculator',
      sub: 'Mutual fund compound planner + chart',
      slug: 'sip-calculator',
      icon: '📈',
      bgLightClass: styles.toolIcon_bg_sky_50_text_sky_600,
    },
  ];

  return (
    <section className={styles.section}>
      {/* Background ambient warm glow */}
      <div className={styles.ambientGlow} />

      <div className={styles.container}>
        <div className={styles.grid}>
          {/* Left Column: Hero Copy + Stats */}
          <div className={styles.leftCol}>
            {/* Pill Kicker */}
            <div className={styles.kicker}>
              <span className={styles.kickerDot} />
              Client-Side · 100% Private · Zero Uploads
            </div>

            {/* Main Headline */}
            <h1 className={styles.headline}>
              Do more. <br />
              <span className={styles.headlineAccent}>
                Upload less.
              </span>
            </h1>

            {/* Subtitle */}
            <p className={styles.subtitle}>
              Full-featured photo editing, strict KB photo compression for government exams, instant PDF merging, and compound wealth simulation. Every tool runs directly inside your browser — zero files are ever uploaded.
            </p>

            {/* Action Buttons */}
            <div className={styles.actions}>
              <Link
                href="/tools/photopea-editor"
                className={styles.primaryAction}
              >
                <span>Open Photopea Studio</span>
                <span className={styles.arrow}>→</span>
              </Link>
              <a
                href="#tools-section"
                className={styles.secondaryAction}
              >
                Browse all tools
              </a>
            </div>

            {/* Stats Counter Strip */}
            <div className={styles.statsRow}>
              <div>
                <div className={styles.statValue}>
                  30+
                </div>
                <div className={styles.statLabel}>
                  Free Utility Tools
                </div>
              </div>
              <div className={styles.statDivider} />
              <div>
                <div className={styles.statValue}>
                  0 KB
                </div>
                <div className={styles.statLabel}>
                  Server Storage Used
                </div>
              </div>
              <div className={styles.statDivider} />
              <div>
                <div className={styles.statValueOrange}>
                  100%
                </div>
                <div className={styles.statLabel}>
                  Free & Unlimited
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Quick Access Live Tool Panel */}
          <div className={styles.rightCol}>
            <div className={styles.panel}>
              {/* Panel Top Header */}
              <div className={styles.panelHeader}>
                <div className={styles.panelHeaderLeft}>
                  <span className={styles.panelTitle}>
                    Quick Access Tools
                  </span>
                  <span className={styles.liveBadge}>
                    LIVE
                  </span>
                </div>
                <div className={styles.panelHeaderRight}>
                  <span className={styles.readyDot} />
                  <span>Ready to use</span>
                </div>
              </div>

              {/* Interactive Tool Items List */}
              <div className={styles.toolList}>
                {quickTools.map((tool, idx) => {
                  const isActive = activeToolIndex === idx;
                  return (
                    <Link
                      key={tool.slug}
                      href={`/tools/${tool.slug}`}
                      onMouseEnter={() => setActiveToolIndex(idx)}
                      className={`${styles.toolItem} ${
                        isActive ? styles.toolItemActive : styles.toolItemInactive
                      }`}
                    >
                      <div className={styles.toolInfo}>
                        <div
                          className={`${styles.toolIcon} ${tool.bgLightClass}`}
                        >
                          {tool.icon}
                        </div>
                        <div>
                          <div className={styles.toolName}>
                            {tool.name}
                          </div>
                          <div className={styles.toolSub}>
                            {tool.sub}
                          </div>
                        </div>
                      </div>
                      <span
                        className={`${styles.toolArrow} ${
                          isActive ? styles.toolArrowActive : styles.toolArrowInactive
                        }`}
                      >
                        →
                      </span>
                    </Link>
                  );
                })}
              </div>

              {/* Panel Footer Prompt */}
              <div className={styles.panelFooter}>
                <span>⚡ Runs locally in WebAssembly & Web APIs</span>
                <span className={styles.panelFooterHighlight}>Zero lag</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
