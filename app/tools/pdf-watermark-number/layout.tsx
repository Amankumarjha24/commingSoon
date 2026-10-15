import type { Metadata } from 'next';
import ToolSeoSection from '@/components/ToolSeoSection';
import { TOOLS_SEO_DATA } from '@/lib/toolsSeoData';

export const metadata: Metadata = {
  title: 'PDF Watermark & Page Numbering Tool — Add Stamps & Page Numbers',
  description: 'Add custom text watermarks, confidential diagonal stamps, and Bates page numbers (Page X of Y) to PDF files online for free.',
  alternates: {
    canonical: 'https://toolsfortools.in/tools/pdf-watermark-number',
  },
  openGraph: {
    title: 'PDF Watermark & Page Numbering Tool — Add Stamps & Page Numbers | ToolsforTools',
    description: 'Add custom text watermarks, confidential diagonal stamps, and Bates page numbers (Page X of Y) to PDF files online for free.',
    url: 'https://toolsfortools.in/tools/pdf-watermark-number',
    siteName: 'ToolsforTools',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PDF Watermark & Page Numbering Tool — Add Stamps & Page Numbers | ToolsforTools',
    description: 'Add custom text watermarks, confidential diagonal stamps, and Bates page numbers (Page X of Y) to PDF files online for free.',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  const seoData = TOOLS_SEO_DATA['pdf-watermark-number'];
  return (
    <>
      {children}
      {seoData && <ToolSeoSection data={seoData} />}
    </>
  );
}
