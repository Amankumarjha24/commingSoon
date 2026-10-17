import type { Metadata } from 'next';
import ToolSeoSection from '@/components/ToolSeoSection';
import { TOOLS_SEO_DATA } from '@/lib/toolsSeoData';

export const metadata: Metadata = {
  title: 'Photopea Studio Pro — Free Photoshop Alternative Online (PSD Editor)',
  description: 'Free online photo editor like Photoshop. Open, edit, and save PSD files with full layer, mask, filter, and raster brush support inside your browser.',
  alternates: {
    canonical: 'https://toolsfortools.in/tools/photopea-editor',
  },
  openGraph: {
    title: 'Photopea Studio Pro — Free Photoshop Alternative Online (PSD Editor) | ToolsforTools',
    description: 'Free online photo editor like Photoshop. Open, edit, and save PSD files with full layer, mask, filter, and raster brush support inside your browser.',
    url: 'https://toolsfortools.in/tools/photopea-editor',
    siteName: 'ToolsforTools',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Photopea Studio Pro — Free Photoshop Alternative Online (PSD Editor) | ToolsforTools',
    description: 'Free online photo editor like Photoshop. Open, edit, and save PSD files with full layer, mask, filter, and raster brush support inside your browser.',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  const seoData = TOOLS_SEO_DATA['photopea-editor'];
  return (
    <>
      {children}
      {seoData && <ToolSeoSection data={seoData} />}
    </>
  );
}
