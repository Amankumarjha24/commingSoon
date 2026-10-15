import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'ToolsforTools Terms of Service and acceptable use guidelines.',
  alternates: {
    canonical: '/terms',
  },
};

export default function TermsPage() {
  return (
    <div className={styles.container}>
      <div className={styles.breadcrumb}>
        <Link href="/" className={styles.breadcrumbLink}>
          Home
        </Link>
        <span>/</span>
        <span className={styles.breadcrumbActive}>Terms of Service</span>
      </div>

      <div className={styles.card}>
        <h1 className={styles.title}>Terms of Service</h1>
        <div className={styles.updatedDate}>Last updated: October 2026</div>

        <div className={styles.content}>
          <div>
            <h2 className={styles.sectionTitle}>1. Acceptance of Terms</h2>
            <p>
              By accessing and using ToolsforTools, you accept and agree to be bound by the terms and provisions of this agreement. If you do not agree with any of these terms, you are prohibited from using or accessing this site.
            </p>
          </div>

          <div>
            <h2 className={styles.sectionTitle}>2. Free Use & "As-Is" Service</h2>
            <p>
              The tools and services provided on ToolsforTools are provided "as is" and "as available" without warranties of any kind. We do not guarantee uninterrupted availability or that calculations are free from human error. Always verify critical financial, tax, or legal submissions independently.
            </p>
          </div>

          <div>
            <h2 className={styles.sectionTitle}>3. Lawful & Permitted Use</h2>
            <p>
              You agree not to use the tools for any unlawful purpose, including violating copyright laws, attempting reverse engineering of restricted systems, or distributing malicious payloads.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
