import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'About Us',
  description: 'Learn about ToolsforTools - 100% private in-browser digital utilities platform with zero file uploads.',
  alternates: {
    canonical: '/about',
  },
};

export default function AboutPage() {
  return (
    <div className={styles.container}>
      <div className={styles.breadcrumb}>
        <Link href="/" className={styles.breadcrumbLink}>
          Home
        </Link>
        <span>/</span>
        <span className={styles.breadcrumbActive}>About Us</span>
      </div>

      <div className={styles.card}>
        <h1 className={styles.title}>About ToolsforTools</h1>

        <div className={styles.content}>
          <p>
            ToolsforTools is an open-access digital utility platform engineered to empower creators, developers, students, and everyday internet users with high-performance web utilities that run directly inside the browser.
          </p>

          <div>
            <h2 className={styles.sectionTitle}>Our Core Philosophy: Privacy by Design</h2>
            <p>
              Unlike conventional tools that require you to upload your sensitive photos, bank statements, or official documents to remote cloud servers, ToolsforTools operates on a <strong>100% client-side computing architecture</strong>. Everything from image processing and binary DCT compression to PDF manipulation is performed strictly in your device's memory using modern HTML5 Canvas, WebAssembly, and JavaScript APIs.
            </p>
          </div>

          <div>
            <h2 className={styles.sectionTitle}>Why Zero File Uploads Matter</h2>
            <div className={styles.benefitList}>
              <div className={styles.benefitItem}>
                <span className={styles.benefitIcon}>🔒</span>
                <div>
                  <strong>Absolute Confidentiality:</strong> Your files never travel over the network and cannot be intercepted, leaked, or logged.
                </div>
              </div>

              <div className={styles.benefitItem}>
                <span className={styles.benefitIcon}>⚡</span>
                <div>
                  <strong>Instant Processing:</strong> Zero upload and download wait times. Processing is instant and runs at your device's full CPU speed.
                </div>
              </div>

              <div className={styles.benefitItem}>
                <span className={styles.benefitIcon}>🎁</span>
                <div>
                  <strong>100% Free Forever:</strong> Because we don't pay massive cloud storage and bandwidth bills, all tools are completely free to use with zero registration.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
