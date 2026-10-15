import type { Metadata } from 'next';
import ToolSeoSection from '@/components/ToolSeoSection';
import { TOOLS_SEO_DATA } from '@/lib/toolsSeoData';

export const metadata: Metadata = {
  title: 'Compress PDF Online — Reduce PDF File Size Without Quality Loss',
  description: 'Optimize and compress PDF document size with object stream optimization. Fast, free client-side PDF compression with zero server upload.',
  alternates: {
    canonical: 'https://toolsfortools.in/tools/compress-pdf',
  },
  openGraph: {
    title: 'Compress PDF Online — Reduce PDF File Size Without Quality Loss | ToolsforTools',
    description: 'Optimize and compress PDF document size with object stream optimization. Fast, free client-side PDF compression with zero server upload.',
    url: 'https://toolsfortools.in/tools/compress-pdf',
    siteName: 'ToolsforTools',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Compress PDF Online — Reduce PDF File Size Without Quality Loss | ToolsforTools',
    description: 'Optimize and compress PDF document size with object stream optimization. Fast, free client-side PDF compression with zero server upload.',
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
