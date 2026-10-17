import type { Metadata } from 'next';
import ToolSeoSection from '@/components/ToolSeoSection';
import { TOOLS_SEO_DATA } from '@/lib/toolsSeoData';

export const metadata: Metadata = {
  title: 'Compress PDF to 100KB, 50KB — Reduce PDF File Size Online Free',
  description: 'Free online PDF compressor to reduce PDF file size to 100KB, 200KB or 50KB without losing quality. 100% private in-browser document compression with zero upload.',
  alternates: {
    canonical: 'https://toolsfortools.in/tools/compress-pdf',
  },
  openGraph: {
    title: 'Compress PDF to 100KB, 50KB — Reduce PDF File Size Online Free | ToolsforTools',
    description: 'Free online PDF compressor to reduce PDF file size to 100KB, 200KB or 50KB without losing quality. 100% private in-browser document compression with zero upload.',
    url: 'https://toolsfortools.in/tools/compress-pdf',
    siteName: 'ToolsforTools',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Compress PDF to 100KB, 50KB — Reduce PDF File Size Online Free | ToolsforTools',
    description: 'Free online PDF compressor to reduce PDF file size to 100KB, 200KB or 50KB without losing quality. 100% private in-browser document compression with zero upload.',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  const seoData = TOOLS_SEO_DATA['compress-pdf'];
  return (
    <>
      {children}
      {seoData && <ToolSeoSection data={seoData} />}
    </>
  );
}
