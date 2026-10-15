'use client';

import React from 'react';
import styles from './AdBanner.module.css';

interface AdBannerProps {
  slotId?: string;
  format?: 'horizontal' | 'rectangle';
  className?: string;
}

export default function AdBanner({ slotId = 'default-slot', format = 'horizontal', className = '' }: AdBannerProps) {
  return (
    <div
      className={`${styles.container} ${className}`}
    >
      <div className={styles.sponsoredText}>
        Sponsored Space
      </div>
      <div
        className={`${styles.adSpace} ${format === 'horizontal' ? styles.horizontal : styles.rectangle}`}
      >
        <span className={styles.badge}>
          AdSense Ready (Configurable via Admin Panel)
        </span>
      </div>
    </div>
  );
}
