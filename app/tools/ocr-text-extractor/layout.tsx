import type { Metadata } from 'next';
import ToolSeoSection from '@/components/ToolSeoSection';
import { TOOLS_SEO_DATA } from '@/lib/toolsSeoData';

export const metadata: Metadata = {
  title: 'Free Online OCR Text Extractor — Extract Text from Images with AI',
  description: 'Extract printed or handwritten text from images, scanned documents, and screenshots using neural OCR AI. Supports English and Hindi.',
  alternates: {
    canonical: 'https://toolsfortools.in/tools/ocr-text-extractor',
  },
  openGraph: {
    title: 'Free Online OCR Text Extractor — Extract Text from Images with AI | ToolsforTools',
    description: 'Extract printed or handwritten text from images, scanned documents, and screenshots using neural OCR AI. Supports English and Hindi.',
    url: 'https://toolsfortools.in/tools/ocr-text-extractor',
    siteName: 'ToolsforTools',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Online OCR Text Extractor — Extract Text from Images with AI | ToolsforTools',
    description: 'Extract printed or handwritten text from images, scanned documents, and screenshots using neural OCR AI. Supports English and Hindi.',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  const seoData = TOOLS_SEO_DATA['ocr-text-extractor'];
  return (
    <>
      {children}
      {seoData && <ToolSeoSection data={seoData} />}
    </>
  );
}
