import React from 'react';
import HeroSplit from '@/components/HeroSplit';
import ToolsGrid from '@/components/ToolsGrid';
import AdBanner from '@/components/AdBanner';
import Link from 'next/link';
import styles from './page.module.css';

export default function HomePage() {
  const faqs = [
    {
      q: 'Are my photos and PDFs uploaded to any remote server?',
      a: 'No. Every single image conversion, compression, and PDF operation is calculated locally inside your browser memory using HTML5 Canvas, WebAssembly, and modern Web Workers. Your sensitive files never leave your device.',
    },
    {
      q: 'How does the Target KB Image Compressor achieve exact file sizes like 20KB or 50KB?',
      a: 'Our compressor utilizes a binary search iterative DCT quantization algorithm. It automatically calculates the optimal JPEG quality factor and resolution steps until the generated file size hits your required target (e.g. for Sarkari exam, SSC, UPSC, and passport portals).',
    },
    {
      q: 'Is Photopea Studio free to use here?',
      a: 'Yes! Photopea is integrated via official web APIs. You have full access to Photoshop PSD editing, layer styles, RAW digital camera imports, and vector tools without needing a paid Adobe Creative Cloud subscription.',
    },
    {
      q: 'Can I install ToolsforTools on my mobile phone as an app?',
      a: 'Yes. ToolsforTools is an offline-ready Progressive Web App (PWA). Simply tap the "Install App" button in the header, or choose "Add to Home Screen" on your mobile browser (Chrome/Safari) for a native app experience.',
    },
  ];

  return (
    <div>
      {/* 1. Split Hero (Warm Canvas Anthropic/Loom Inspired) */}
      <HeroSplit />

      {/* Top Banner Ad Space */}
      <div className={styles.topBanner}>
        <AdBanner format="horizontal" />
      </div>

      {/* 2. Interactive Tools Grid with Live Search & Categories */}
      <ToolsGrid />

      {/* Middle Banner Ad Space */}
      <div className={styles.middleBanner}>
        <AdBanner format="horizontal" />
      </div>

      {/* 3. MNC Grade Features Bento / Highlights */}
      <section className={styles.featuresSection}>
        <div className={styles.featuresContainer}>
          <div className={styles.featuresHeader}>
            <div className={styles.featuresSubtitle}>
              Engineered For Speed & Privacy
            </div>
            <h2 className={styles.featuresTitle}>
              Why Professionals Rely on ToolsforTools
            </h2>
            <p className={styles.featuresDesc}>
              Unlike traditional SaaS platforms that upload your files to AWS or Google Cloud, we run the compute right where you are.
            </p>
          </div>

          <div className={styles.featuresGrid}>
            {/* Feature 1 */}
            <div className={styles.featureCard}>
              <div className={styles.featureIconWrap}>
                🛡️
              </div>
              <h3 className={styles.featureCardTitle}>
                100% Client-Side Privacy
              </h3>
              <p className={styles.featureCardDesc}>
                Bank statements, government certificates, personal photos, and confidential documents never touch any cloud server. Your data stays on your machine.
              </p>
            </div>

            {/* Feature 2 */}
            <div className={styles.featureCard}>
              <div className={styles.featureIconWrap2}>
                ⚡
              </div>
              <h3 className={styles.featureCardTitle}>
                Zero Bandwidth Delay
              </h3>
              <p className={styles.featureCardDesc}>
                No waiting for 100MB files to upload over slow connections. Processing starts instantly using your CPU and hardware acceleration.
              </p>
            </div>

            {/* Feature 3 */}
            <div className={styles.featureCard}>
              <div className={styles.featureIconWrap3}>
                📱
              </div>
              <h3 className={styles.featureCardTitle}>
                Install as Native App
              </h3>
              <p className={styles.featureCardDesc}>
                Add to your home screen on Android or iOS. Launch in full screen with native app feel, buttery gestures, and offline cache.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. SEO Frequently Asked Questions Section */}
      <section className={styles.faqSection}>
        <div className={styles.faqHeader}>
          <div className={styles.faqSubtitle}>
            Got Questions?
          </div>
          <h2 className={styles.faqTitle}>
            Frequently Asked Questions
          </h2>
        </div>

        <div className={styles.faqList}>
          {faqs.map((faq, i) => (
            <div
              key={i}
              className={styles.faqCard}
            >
              <h3 className={styles.faqCardTitle}>
                {faq.q}
              </h3>
              <p className={styles.faqCardDesc}>
                {faq.a}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
