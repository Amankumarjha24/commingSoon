import type { Metadata } from 'next';
import ToolSeoSection from '@/components/ToolSeoSection';
import { TOOLS_SEO_DATA } from '@/lib/toolsSeoData';

export const metadata: Metadata = {
  title: 'Split PDF Online Free — Extract Pages & Separate PDF Files',
  description: 'Free online tool to split PDF files into separate pages or custom page ranges instantly. Fast, secure, in-browser PDF page extractor with no upload limits.',
  alternates: {
    canonical: 'https://toolsfortools.in/tools/split-pdf',
  },
  openGraph: {
    title: 'Split PDF Online Free — Extract Pages & Separate PDF Files | ToolsforTools',
    description: 'Free online tool to split PDF files into separate pages or custom page ranges instantly. Fast, secure, in-browser PDF page extractor with no upload limits.',
    url: 'https://toolsfortools.in/tools/split-pdf',
    siteName: 'ToolsforTools',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Split PDF Online Free — Extract Pages & Separate PDF Files | ToolsforTools',
    description: 'Free online tool to split PDF files into separate pages or custom page ranges instantly. Fast, secure, in-browser PDF page extractor with no upload limits.',
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
