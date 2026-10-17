import type { Metadata } from 'next';
import ToolSeoSection from '@/components/ToolSeoSection';
import { TOOLS_SEO_DATA } from '@/lib/toolsSeoData';

export const metadata: Metadata = {
  title: 'Image Format Converter Online — JPG, PNG & WebP Batch Convert',
  description: 'Free online image format converter. Convert JPG to PNG, PNG to WebP, and WebP to JPG in batch directly in your browser with zero server uploads.',
  alternates: {
    canonical: 'https://toolsfortools.in/tools/image-converter',
  },
  openGraph: {
    title: 'Image Format Converter Online — JPG, PNG & WebP Batch Convert | ToolsforTools',
    description: 'Free online image format converter. Convert JPG to PNG, PNG to WebP, and WebP to JPG in batch directly in your browser with zero server uploads.',
    url: 'https://toolsfortools.in/tools/image-converter',
    siteName: 'ToolsforTools',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Image Format Converter Online — JPG, PNG & WebP Batch Convert | ToolsforTools',
    description: 'Free online image format converter. Convert JPG to PNG, PNG to WebP, and WebP to JPG in batch directly in your browser with zero server uploads.',
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
