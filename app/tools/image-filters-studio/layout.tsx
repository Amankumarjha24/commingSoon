import type { Metadata } from 'next';
import ToolSeoSection from '@/components/ToolSeoSection';
import { TOOLS_SEO_DATA } from '@/lib/toolsSeoData';

export const metadata: Metadata = {
  title: 'Photo Filters & B&W Studio — Free Image Effects & Vintage Filters',
  description: 'Apply Black & White (Grayscale), Sepia, Blur, and high-contrast filters to photos with an interactive Before/After comparison slider.',
  alternates: {
    canonical: 'https://toolsfortools.in/tools/image-filters-studio',
  },
  openGraph: {
    title: 'Photo Filters & B&W Studio — Free Image Effects & Vintage Filters | ToolsforTools',
    description: 'Apply Black & White (Grayscale), Sepia, Blur, and high-contrast filters to photos with an interactive Before/After comparison slider.',
    url: 'https://toolsfortools.in/tools/image-filters-studio',
    siteName: 'ToolsforTools',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Photo Filters & B&W Studio — Free Image Effects & Vintage Filters | ToolsforTools',
    description: 'Apply Black & White (Grayscale), Sepia, Blur, and high-contrast filters to photos with an interactive Before/After comparison slider.',
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
