import type { Metadata } from 'next';
import ToolSeoSection from '@/components/ToolSeoSection';
import { TOOLS_SEO_DATA } from '@/lib/toolsSeoData';

export const metadata: Metadata = {
  title: 'Photo Filters & B&W Studio Online — Grayscale, Sepia & Filter Effects',
  description: 'Photo filters online free. Apply black and white (grayscale), sepia, blur, and vintage photo filter effects with real-time before/after preview.',
  alternates: {
    canonical: 'https://toolsfortools.in/tools/image-filters-studio',
  },
  openGraph: {
    title: 'Photo Filters & B&W Studio Online — Grayscale, Sepia & Filter Effects | ToolsforTools',
    description: 'Photo filters online free. Apply black and white (grayscale), sepia, blur, and vintage photo filter effects with real-time before/after preview.',
    url: 'https://toolsfortools.in/tools/image-filters-studio',
    siteName: 'ToolsforTools',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Photo Filters & B&W Studio Online — Grayscale, Sepia & Filter Effects | ToolsforTools',
    description: 'Photo filters online free. Apply black and white (grayscale), sepia, blur, and vintage photo filter effects with real-time before/after preview.',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  const seoData = TOOLS_SEO_DATA['image-filters-studio'];
  return (
    <>
      {children}
      {seoData && <ToolSeoSection data={seoData} />}
    </>
  );
}
