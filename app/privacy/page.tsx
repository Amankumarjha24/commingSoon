import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'ToolsforTools Privacy Policy: Zero file uploads, 100% client-side data protection and local browser processing.',
  alternates: {
    canonical: '/privacy',
  },
};

export default function PrivacyPage() {
  return (
    <div className={styles.container}>
      <div className={styles.breadcrumb}>
        <Link href="/" className={styles.breadcrumbLink}>
          Home
        </Link>
        <span>/</span>
        <span className={styles.breadcrumbActive}>Privacy Policy</span>
      </div>

      <div className={styles.card}>
        <h1 className={styles.title}>Privacy Policy</h1>
        <div className={styles.updatedDate}>Last updated: October 2026</div>

        <div className={styles.content}>
          <div>
            <h2 className={styles.sectionTitle}>1. Data Minimization & Local Processing</h2>
            <div className={styles.highlightBox}>
              <strong>100% Client-Side Privacy:</strong> All file processing (including images, PDFs, text, and numeric inputs) takes place entirely within your browser memory. We never store, view, or transmit your uploaded files to any remote server.
            </div>
          </div>

          <div>
            <h2 className={styles.sectionTitle}>2. Cookies and Third-Party Advertising</h2>
            <p>
              ToolsforTools may display third-party advertisements served by Google AdSense and its affiliate networks. Google uses cookies (including the DoubleClick cookie) to serve ads based on your visits to this and other websites. You may opt out of personalized advertising by visiting Google Ads Settings.
            </p>
          </div>

          <div>
            <h2 className={styles.sectionTitle}>3. Anonymous Analytics</h2>
            <p>
              We collect basic non-personally identifiable visit counters (such as page path, referrer, and user-agent category) to monitor uptime and aggregate usage patterns. No personal identifiers (PII), names, or file contents are ever recorded.
            </p>
          </div>

          <div>
            <h2 className={styles.sectionTitle}>4. Contact Us</h2>
            <p>
              If you have any questions or suggestions regarding our Privacy Policy, please feel free to reach out via our <Link href="/contact" style={{ color: '#f97316', fontWeight: 600 }}>Contact Page</Link>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
