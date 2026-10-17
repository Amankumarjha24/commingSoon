import type { Metadata } from 'next';
import ToolSeoSection from '@/components/ToolSeoSection';
import { TOOLS_SEO_DATA } from '@/lib/toolsSeoData';

export const metadata: Metadata = {
  title: 'JPG to PDF Converter Online — Convert Image to PDF Free',
  description: 'Free online JPG to PDF converter. Convert multiple images (PNG, WebP, JPG) into a single PDF document in seconds with 100% client-side privacy.',
  alternates: {
    canonical: 'https://toolsfortools.in/tools/image-pdf-converter',
  },
  openGraph: {
    title: 'JPG to PDF Converter Online — Convert Image to PDF Free | ToolsforTools',
    description: 'Free online JPG to PDF converter. Convert multiple images (PNG, WebP, JPG) into a single PDF document in seconds with 100% client-side privacy.',
    url: 'https://toolsfortools.in/tools/image-pdf-converter',
    siteName: 'ToolsforTools',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'JPG to PDF Converter Online — Convert Image to PDF Free | ToolsforTools',
    description: 'Free online JPG to PDF converter. Convert multiple images (PNG, WebP, JPG) into a single PDF document in seconds with 100% client-side privacy.',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  const seoData = TOOLS_SEO_DATA['image-pdf-converter'];
  return (
    <>
      {children}
      {seoData && <ToolSeoSection data={seoData} />}
    </>
  );
}
