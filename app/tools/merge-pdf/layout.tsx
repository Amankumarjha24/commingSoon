import type { Metadata } from 'next';
import ToolSeoSection from '@/components/ToolSeoSection';
import { TOOLS_SEO_DATA } from '@/lib/toolsSeoData';

export const metadata: Metadata = {
  title: 'Merge PDF Files Online — Combine Multiple PDFs into One',
  description: 'Combine multiple PDF files into a single organized document in seconds. 100% private browser processing with unlimited file joins.',
  alternates: {
    canonical: 'https://toolsfortools.in/tools/merge-pdf',
  },
  openGraph: {
    title: 'Merge PDF Files Online — Combine Multiple PDFs into One | ToolsforTools',
    description: 'Combine multiple PDF files into a single organized document in seconds. 100% private browser processing with unlimited file joins.',
    url: 'https://toolsfortools.in/tools/merge-pdf',
    siteName: 'ToolsforTools',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Merge PDF Files Online — Combine Multiple PDFs into One | ToolsforTools',
    description: 'Combine multiple PDF files into a single organized document in seconds. 100% private browser processing with unlimited file joins.',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  const seoData = TOOLS_SEO_DATA['merge-pdf'];
  return (
    <>
      {children}
      {seoData && <ToolSeoSection data={seoData} />}
    </>
  );
}
