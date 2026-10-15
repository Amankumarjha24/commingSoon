import React from 'react';
import Link from 'next/link';
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.grid}>
          {/* Brand Info */}
          <div className={styles.brandInfo}>
            <div className={styles.brandHeader}>
              <img
                src="/logo-light.png"
                alt="ToolsforTools"
                className={styles.footerLogoLight}
                width={150}
                height={50}
              />
              <img
                src="/logo-dark.png"
                alt="ToolsforTools"
                className={styles.footerLogoDark}
                width={150}
                height={50}
              />
            </div>
            <p className={styles.brandDesc}>
              Every utility tool you need in your daily workflow. Built with client-side Web APIs and WebAssembly so your photos, documents, and data never leave your browser.
            </p>
            <div className={styles.privacyInfo}>
              <span className={styles.privacyDot} />
              <span>Zero server upload · 100% Privacy by Design</span>
            </div>
          </div>

          {/* Tools Quick Links */}
          <div>
            <h4 className={styles.sectionTitle}>
              Popular Utilities
            </h4>
            <ul className={styles.linkList}>
              <li>
                <Link href="/tools/photopea-editor" className={styles.linkItem}>
                  Photopea Studio Pro
                </Link>
              </li>
              <li>
                <Link href="/tools/image-compressor" className={styles.linkItem}>
                  Target KB Compressor (20KB)
                </Link>
              </li>
              <li>
                <Link href="/tools/merge-pdf" className={styles.linkItem}>
                  Merge & Split PDF
                </Link>
              </li>
              <li>
                <Link href="/tools/sip-calculator" className={styles.linkItem}>
                  SIP Wealth Calculator
                </Link>
              </li>
              <li>
                <Link href="/tools/qr-generator" className={styles.linkItem}>
                  QR Code Generator
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal & Company */}
          <div>
            <h4 className={styles.sectionTitle}>
              Platform & Legal
            </h4>
            <ul className={styles.linkList}>
              <li>
                <Link href="/about" className={styles.linkItem}>
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/blog" className={styles.linkItem}>
                  Tech Blog & Guides
                </Link>
              </li>
              <li>
                <Link href="/privacy" className={styles.linkItem}>
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className={styles.linkItem}>
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/contact" className={styles.linkItem}>
                  Contact Support
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className={styles.bottomBar}>
          <div>
            © {new Date().getFullYear()} ToolsforTools. All rights reserved.
          </div>
          <div className={styles.featuresList}>
            <span>Client-Side Speed</span>
            <span>•</span>
            <span>No Cookies Required</span>
            <span>•</span>
            <span>PWA Ready</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
