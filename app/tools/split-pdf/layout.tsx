import type { Metadata } from 'next';
import ToolSeoSection from '@/components/ToolSeoSection';
import { TOOLS_SEO_DATA } from '@/lib/toolsSeoData';

export const metadata: Metadata = {
  title: 'Split PDF Online — Extract Pages & Custom Ranges from PDF',
  description: 'Split large PDF documents into single pages or custom ranges without uploading to any server. Fast, free, and completely private.',
  alternates: {
    canonical: 'https://toolsfortools.in/tools/split-pdf',
  },
  openGraph: {
    title: 'Split PDF Online — Extract Pages & Custom Ranges from PDF | ToolsforTools',
    description: 'Split large PDF documents into single pages or custom ranges without uploading to any server. Fast, free, and completely private.',
    url: 'https://toolsfortools.in/tools/split-pdf',
    siteName: 'ToolsforTools',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Split PDF Online — Extract Pages & Custom Ranges from PDF | ToolsforTools',
    description: 'Split large PDF documents into single pages or custom ranges without uploading to any server. Fast, free, and completely private.',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  const seoData = TOOLS_SEO_DATA['split-pdf'];
  return (
    <>
      {children}
      {seoData && <ToolSeoSection data={seoData} />}
    </>
  );
}
