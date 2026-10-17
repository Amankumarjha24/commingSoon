import type { Metadata } from 'next';
import ToolSeoSection from '@/components/ToolSeoSection';
import { TOOLS_SEO_DATA } from '@/lib/toolsSeoData';

export const metadata: Metadata = {
  title: 'Merge PDF Online Free — Combine PDF Files in Browser',
  description: 'Merge PDF files online free. Combine multiple PDFs into one document directly in your browser. 100% private with no file size limits or server uploads.',
  alternates: {
    canonical: 'https://toolsfortools.in/tools/merge-pdf',
  },
  openGraph: {
    title: 'Merge PDF Online Free — Combine PDF Files in Browser | ToolsforTools',
    description: 'Merge PDF files online free. Combine multiple PDFs into one document directly in your browser. 100% private with no file size limits or server uploads.',
    url: 'https://toolsfortools.in/tools/merge-pdf',
    siteName: 'ToolsforTools',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Merge PDF Online Free — Combine PDF Files in Browser | ToolsforTools',
    description: 'Merge PDF files online free. Combine multiple PDFs into one document directly in your browser. 100% private with no file size limits or server uploads.',
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
