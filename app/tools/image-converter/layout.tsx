import type { Metadata } from 'next';
import ToolSeoSection from '@/components/ToolSeoSection';
import { TOOLS_SEO_DATA } from '@/lib/toolsSeoData';

export const metadata: Metadata = {
  title: 'Image Format Converter — Convert JPG, PNG, WebP, GIF, BMP Online',
  description: 'Convert images between WebP, PNG, JPG, GIF, and BMP formats instantly. Batch image conversion with 100% client-side privacy.',
  alternates: {
    canonical: 'https://toolsfortools.in/tools/image-converter',
  },
  openGraph: {
    title: 'Image Format Converter — Convert JPG, PNG, WebP, GIF, BMP Online | ToolsforTools',
    description: 'Convert images between WebP, PNG, JPG, GIF, and BMP formats instantly. Batch image conversion with 100% client-side privacy.',
    url: 'https://toolsfortools.in/tools/image-converter',
    siteName: 'ToolsforTools',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Image Format Converter — Convert JPG, PNG, WebP, GIF, BMP Online | ToolsforTools',
    description: 'Convert images between WebP, PNG, JPG, GIF, and BMP formats instantly. Batch image conversion with 100% client-side privacy.',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  const seoData = TOOLS_SEO_DATA['image-converter'];
  return (
    <>
      {children}
      {seoData && <ToolSeoSection data={seoData} />}
    </>
  );
}
