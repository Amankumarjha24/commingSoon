import React from 'react';
import Link from 'next/link';
import styles from './ToolSeoSection.module.css';

export interface ToolSeoData {
  slug: string;
  toolName: string;
  category: string;
  categoryLabel: string;
  steps: { stepNumber: number; title: string; desc: string }[];
  constraints: { label: string; value: string }[];
  faqs: { q: string; a: string }[];
  relatedTools: { slug: string; name: string; shortDesc: string }[];
}

export default function ToolSeoSection({ data }: { data: ToolSeoData }) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://toolsfortools.in';

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebApplication',
        name: `ToolsforTools ${data.toolName}`,
        url: `${siteUrl}/tools/${data.slug}`,
        applicationCategory: 'UtilitiesApplication',
        operatingSystem: 'Web browser (Chrome, Safari, Firefox, Edge)',
        browserRequirements: 'Requires modern web browser with HTML5 and JavaScript enabled',
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD',
        },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: `${siteUrl}`,
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: data.categoryLabel,
            item: `${siteUrl}/?category=${data.category}`,
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: data.toolName,
            item: `${siteUrl}/tools/${data.slug}`,
          },
        ],
      },
      {
        '@type': 'FAQPage',
        mainEntity: data.faqs.map((faq) => ({
          '@type': 'Question',
          name: faq.q,
          acceptedAnswer: {
            '@type': 'Answer',
            text: faq.a,
          },
        })),
      },
    ],
  };

  return (
    <section className={styles.seoWrapper} aria-label={`${data.toolName} guide and specifications`}>
      {/* Factual Search Engine Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c'),
        }}
      />

      {/* 1. Step-by-Step Usage Guide */}
      <div>
        <div className={styles.sectionHeader}>
          <div className={styles.sectionSubtitle}>Workflow Guide</div>
          <h2 className={styles.sectionTitle}>How to Use {data.toolName}</h2>
        </div>
        <div className={styles.stepsGrid}>
          {data.steps.map((step) => (
            <div key={step.stepNumber} className={styles.stepCard}>
              <div className={styles.stepBadge}>{step.stepNumber}</div>
              <h3 className={styles.stepTitle}>{step.title}</h3>
              <p className={styles.stepDesc}>{step.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Technical Specifications & Limitations */}
      <div className={styles.specsBox}>
        <div className={styles.sectionHeader}>
          <div className={styles.sectionSubtitle}>Verified Specs</div>
          <h2 className={styles.sectionTitle}>Technical Specifications & Processing Limits</h2>
        </div>
        <div className={styles.specsGrid}>
          {data.constraints.map((item, idx) => (
            <div key={idx} className={styles.specCard}>
              <div className={styles.specLabel}>{item.label}</div>
              <div className={styles.specValue}>{item.value}</div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Frequently Asked Questions */}
      {data.faqs && data.faqs.length > 0 && (
        <div>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionSubtitle}>User Help</div>
            <h2 className={styles.sectionTitle}>Frequently Asked Questions</h2>
          </div>
          <div className={styles.faqList}>
            {data.faqs.map((faq, idx) => (
              <div key={idx} className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>
                  <span className={styles.faqQIcon}>Q:</span>
                  <span>{faq.q}</span>
                </h3>
                <p className={styles.faqAnswer}>{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. Contextual Related Tools */}
      {data.relatedTools && data.relatedTools.length > 0 && (
        <div>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionSubtitle}>Explore More</div>
            <h2 className={styles.sectionTitle}>Related {data.categoryLabel} Tools</h2>
          </div>
          <div className={styles.relatedGrid}>
            {data.relatedTools.map((rel) => (
              <Link key={rel.slug} href={`/tools/${rel.slug}`} className={styles.relatedCard}>
                <div className={styles.relatedTitle}>
                  <span>{rel.name}</span>
                  <span className={styles.relatedArrow}>→</span>
                </div>
                <p className={styles.relatedDesc}>{rel.shortDesc}</p>
              </Link>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
