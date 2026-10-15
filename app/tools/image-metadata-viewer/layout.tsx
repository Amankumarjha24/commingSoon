import type { Metadata } from 'next';
import ToolSeoSection from '@/components/ToolSeoSection';
import { TOOLS_SEO_DATA } from '@/lib/toolsSeoData';

export const metadata: Metadata = {
  title: 'EXIF Metadata Viewer & Stripper — Inspect GPS & Camera Tags',
  description: 'Read hidden camera settings, shutter speed, ISO, and GPS location coordinates from photos. Sanitize and remove all EXIF metadata with 1 click.',
  alternates: {
    canonical: 'https://toolsfortools.in/tools/image-metadata-viewer',
  },
  openGraph: {
    title: 'EXIF Metadata Viewer & Stripper — Inspect GPS & Camera Tags | ToolsforTools',
    description: 'Read hidden camera settings, shutter speed, ISO, and GPS location coordinates from photos. Sanitize and remove all EXIF metadata with 1 click.',
    url: 'https://toolsfortools.in/tools/image-metadata-viewer',
    siteName: 'ToolsforTools',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'EXIF Metadata Viewer & Stripper — Inspect GPS & Camera Tags | ToolsforTools',
    description: 'Read hidden camera settings, shutter speed, ISO, and GPS location coordinates from photos. Sanitize and remove all EXIF metadata with 1 click.',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  const seoData = TOOLS_SEO_DATA['image-metadata-viewer'];
  return (
    <>
      {children}
      {seoData && <ToolSeoSection data={seoData} />}
    </>
  );
}
