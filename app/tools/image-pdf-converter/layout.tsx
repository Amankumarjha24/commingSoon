import type { Metadata } from 'next';
import ToolSeoSection from '@/components/ToolSeoSection';
import { TOOLS_SEO_DATA } from '@/lib/toolsSeoData';

export const metadata: Metadata = {
  title: 'Image to PDF Converter — Convert JPG, PNG & WebP to PDF',
  description: 'Combine multiple photos and images into a single professional PDF document, or extract all pages as high-resolution images in 1 click.',
  alternates: {
    canonical: 'https://toolsfortools.in/tools/image-pdf-converter',
  },
  openGraph: {
    title: 'Image to PDF Converter — Convert JPG, PNG & WebP to PDF | ToolsforTools',
    description: 'Combine multiple photos and images into a single professional PDF document, or extract all pages as high-resolution images in 1 click.',
    url: 'https://toolsfortools.in/tools/image-pdf-converter',
    siteName: 'ToolsforTools',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Image to PDF Converter — Convert JPG, PNG & WebP to PDF | ToolsforTools',
    description: 'Combine multiple photos and images into a single professional PDF document, or extract all pages as high-resolution images in 1 click.',
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
