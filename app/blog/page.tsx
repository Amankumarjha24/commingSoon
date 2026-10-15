import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { fetchAllBlogs } from '../../lib/blogData';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'Blog & Technology Guides — Privacy-First Web Utilities',
  description: 'Read expert tutorials on offline PDF processing, photo compression for government exams, client-side WebAssembly architecture, and financial planning.',
  alternates: {
    canonical: 'https://toolsfortools.in/blog',
  },
  openGraph: {
    title: 'ToolsforTools Blog — In-Browser Utility & Privacy Guides',
    description: 'Master client-side file tools, image compression, and private document processing with our comprehensive guides.',
    url: 'https://toolsfortools.in/blog',
    siteName: 'ToolsforTools',
    type: 'website',
  },
};

export const revalidate = 60;

export default async function BlogListingPage() {
  const posts = await fetchAllBlogs();

  const blogJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: 'ToolsforTools Blog & Technical Tutorials',
    url: 'https://toolsfortools.in/blog',
    description: 'Tutorials and guides for client-side privacy, PDF tools, image optimization, and personal utilities.',
    publisher: {
      '@type': 'Organization',
      name: 'ToolsforTools',
      url: 'https://toolsfortools.in',
    },
    blogPost: posts.map((p) => ({
      '@type': 'BlogPosting',
      headline: p.title,
      description: p.excerpt,
      url: `https://toolsfortools.in/blog/${p.slug}`,
      datePublished: p.createdAt || '2026-10-10',
      author: {
        '@type': 'Person',
        name: p.author,
      },
    })),
  };

  return (
    <div className={styles.container}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogJsonLd) }}
      />

      <nav aria-label="Breadcrumb" className={styles.breadcrumb}>
        <Link href="/" className={styles.breadcrumbLink}>Home</Link>
        <span className={styles.breadcrumbSep}>/</span>
        <span className={styles.breadcrumbActive}>Blog</span>
      </nav>

      <header className={styles.header}>
        <div className={styles.pillBadge}>
          <span className={styles.dot}></span>
          ToolsforTools Insights
        </div>
        <h1 className={styles.title}>
          Engineering & Privacy Guides
        </h1>
        <p className={styles.subtitle}>
          In-depth tutorials, file compression benchmarks, client-side security breakdowns, and productivity playbooks written by the ToolsforTools team.
        </p>
      </header>

      <section className={styles.grid}>
        {posts.map((post) => (
          <article key={post.slug} className={styles.card}>
            {post.coverImage && (
              <Link href={`/blog/${post.slug}`} className={styles.imageWrap}>
                <img
                  src={post.coverImage}
                  alt={post.title}
                  className={styles.coverImg}
                  loading="lazy"
                />
              </Link>
            )}

            <div className={styles.cardContent}>
              <div className={styles.cardMeta}>
                <span className={styles.categoryBadge}>{post.category}</span>
                <span className={styles.readTime}>⏱️ {post.readTime}</span>
              </div>

              <h2 className={styles.cardTitle}>
                <Link href={`/blog/${post.slug}`} className={styles.cardTitleLink}>
                  {post.title}
                </Link>
              </h2>

              <p className={styles.cardExcerpt}>{post.excerpt}</p>

              <div className={styles.cardFooter}>
                <span className={styles.author}>By {post.author}</span>
                <Link href={`/blog/${post.slug}`} className={styles.readMoreBtn}>
                  Read Article →
                </Link>
              </div>
            </div>
          </article>
        ))}
      </section>

      {/* Internal linking back to tools */}
      <section className={styles.toolsCta}>
        <h3 className={styles.ctaTitle}>Looking for our instant utilities?</h3>
        <p className={styles.ctaDesc}>
          Explore all 30 client-side tools processed 100% inside your browser with zero server uploads.
        </p>
        <Link href="/" className={styles.ctaBtn}>
          Browse All 30 Tools →
        </Link>
      </section>
    </div>
  );
}
