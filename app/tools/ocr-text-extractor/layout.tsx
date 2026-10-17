import type { Metadata } from 'next';
import ToolSeoSection from '@/components/ToolSeoSection';
import { TOOLS_SEO_DATA } from '@/lib/toolsSeoData';

export const metadata: Metadata = {
  title: 'Extract Text from Image Online (OCR) — Hindi & English Document Scanner',
  description: 'Extract text from image online free. Neural OCR tool accurately converts photos, scanned documents, receipts, and screenshots into editable text.',
  alternates: {
    canonical: 'https://toolsfortools.in/tools/ocr-text-extractor',
  },
  openGraph: {
    title: 'Extract Text from Image Online (OCR) — Hindi & English Document Scanner | ToolsforTools',
    description: 'Extract text from image online free. Neural OCR tool accurately converts photos, scanned documents, receipts, and screenshots into editable text.',
    url: 'https://toolsfortools.in/tools/ocr-text-extractor',
    siteName: 'ToolsforTools',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Extract Text from Image Online (OCR) — Hindi & English Document Scanner | ToolsforTools',
    description: 'Extract text from image online free. Neural OCR tool accurately converts photos, scanned documents, receipts, and screenshots into editable text.',
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
