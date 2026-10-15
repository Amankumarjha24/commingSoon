import type { Metadata } from 'next';
import ToolSeoSection from '@/components/ToolSeoSection';
import { TOOLS_SEO_DATA } from '@/lib/toolsSeoData';

export const metadata: Metadata = {
  title: 'Photopea Studio Pro — Free Online Photoshop PSD Alternative',
  description: 'Full PSD-compatible online photo editor with layers, masks, RAW support, and raster brushes. A free browser-based Adobe Photoshop replacement.',
  alternates: {
    canonical: 'https://toolsfortools.in/tools/photopea-editor',
  },
  openGraph: {
    title: 'Photopea Studio Pro — Free Online Photoshop PSD Alternative | ToolsforTools',
    description: 'Full PSD-compatible online photo editor with layers, masks, RAW support, and raster brushes. A free browser-based Adobe Photoshop replacement.',
    url: 'https://toolsfortools.in/tools/photopea-editor',
    siteName: 'ToolsforTools',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Photopea Studio Pro — Free Online Photoshop PSD Alternative | ToolsforTools',
    description: 'Full PSD-compatible online photo editor with layers, masks, RAW support, and raster brushes. A free browser-based Adobe Photoshop replacement.',
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
