import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { fetchBlogBySlug, fetchAllBlogs } from '../../../lib/blogData';
import styles from './page.module.css';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const posts = await fetchAllBlogs();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await fetchBlogBySlug(slug);

  if (!post) {
    return {
      title: 'Post Not Found',
    };
  }

  const title = post.seoTitle || post.title;
  const description = post.seoDescription || post.excerpt;
  const canonicalUrl = `https://toolsfortools.in/blog/${post.slug}`;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: 'ToolsforTools',
      type: 'article',
      publishedTime: post.createdAt,
      images: post.coverImage ? [{ url: post.coverImage }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: post.coverImage ? [post.coverImage] : undefined,
    },
  };
}

// Simple safe markdown to HTML parser for blog body
function renderMarkdownContent(content: string): string {
  let html = content
    // Escaping
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    // Code blocks
    .replace(/```([a-z]*)\n([\s\S]*?)```/g, '<pre class="codeBlock"><code>$2</code></pre>')
    // Inline code
    .replace(/`([^`]+)`/g, '<code class="inlineCode">$1</code>')
    // Headings
    .replace(/^### (.*$)/gim, '<h3 class="heading3">$1</h3>')
    .replace(/^## (.*$)/gim, '<h2 class="heading2">$1</h2>')
    .replace(/^# (.*$)/gim, '<h1 class="heading1">$1</h1>')
    // Bold & italic
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    // Horizontal rule
    .replace(/^---$/gim, '<hr class="divider" />')
    // Links [Text](Url)
    .replace(/\[([^\]]+)\]\((https?:\/\/[^\)]+)\)/g, '<a href="$2" class="contentLink" target="_blank" rel="noopener noreferrer">$1</a>')
    // Bullet lists
    .replace(/^\* (.*$)/gim, '<li class="listItem">$1</li>')
    // Wrap paragraphs for regular lines
    .split('\n\n')
    .map(block => {
      const trimmed = block.trim();
      if (!trimmed) return '';
      if (
        trimmed.startsWith('<h') ||
        trimmed.startsWith('<pre') ||
        trimmed.startsWith('<hr') ||
        trimmed.startsWith('<li')
      ) {
        return trimmed;
      }
      return `<p class="paragraph">${trimmed}</p>`;
    })
    .join('\n');

  return html;
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await fetchBlogBySlug(slug);

  if (!post) {
    notFound();
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    url: `https://toolsfortools.in/blog/${post.slug}`,
    image: post.coverImage || 'https://toolsfortools.in/logo.png',
    datePublished: post.createdAt || '2026-10-10',
    dateModified: post.updatedAt || post.createdAt || '2026-10-10',
    author: {
      '@type': post.author.includes('Editorial') || post.author.includes('Desk') || post.author.includes('Team') ? 'Organization' : 'Person',
      name: post.author,
    },
    publisher: {
      '@type': 'Organization',
      name: 'ToolsforTools',
      url: 'https://toolsfortools.in',
      logo: {
        '@type': 'ImageObject',
        url: 'https://toolsfortools.in/logo.png',
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://toolsfortools.in/blog/${post.slug}`,
    },
  };

  const formattedDate = post.createdAt
    ? new Date(post.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : 'October 2026';

  return (
    <div className={styles.container}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <nav aria-label="Breadcrumb" className={styles.breadcrumb}>
        <Link href="/" className={styles.breadcrumbLink}>Home</Link>
        <span className={styles.breadcrumbSep}>/</span>
        <Link href="/blog" className={styles.breadcrumbLink}>Blog</Link>
        <span className={styles.breadcrumbSep}>/</span>
        <span className={styles.breadcrumbActive}>{post.title}</span>
      </nav>

      <header className={styles.header}>
        <div className={styles.categoryPill}>
          {post.category}
        </div>
        
        <h1 className={styles.title}>{post.title}</h1>

        <div className={styles.authorMeta}>
          <div className={styles.authorAvatar}>
            {post.author.charAt(0).toUpperCase()}
          </div>
          <div className={styles.authorInfo}>
            <span className={styles.authorName}>{post.author}</span>
            <span className={styles.publishDetails}>
              {formattedDate} • ⏱️ {post.readTime}
            </span>
          </div>
        </div>
      </header>

      {post.coverImage && (
        <div className={styles.coverWrap}>
          <img
            src={post.coverImage}
            alt={post.title}
            className={styles.coverImg}
          />
        </div>
      )}

      {/* Article Body */}
      <article
        className={styles.articleBody}
        dangerouslySetInnerHTML={{ __html: renderMarkdownContent(post.content) }}
      />

      {/* Footer CTA & Related Tools */}
      <footer className={styles.articleFooter}>
        <div className={styles.shareBanner}>
          <div className={styles.shareText}>
            <h4>ToolsforTools — 100% Client-Side Privacy</h4>
            <p>Every file you process never leaves your computer or smartphone.</p>
          </div>
          <Link href="/" className={styles.exploreToolsBtn}>
            Try Free In-Browser Tools →
          </Link>
        </div>

        <div className={styles.backLinkWrap}>
          <Link href="/blog" className={styles.backLink}>
            ← Back to All Articles
          </Link>
        </div>
      </footer>
    </div>
  );
}
