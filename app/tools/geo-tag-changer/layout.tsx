import type { Metadata } from 'next';
import ToolSeoSection from '@/components/ToolSeoSection';
import { TOOLS_SEO_DATA } from '@/lib/toolsSeoData';

export const metadata: Metadata = {
  title: 'Geotag Photo Online Free — Add GPS Location to Photos & EXIF Editor',
  description: 'Free online geotag photo editor. Add GPS location to photos, inject latitude & longitude EXIF coordinates, and edit geotag photos online with zero server uploads.',
  alternates: {
    canonical: 'https://toolsfortools.in/tools/geo-tag-changer',
  },
  openGraph: {
    title: 'Geotag Photo Online Free — Add GPS Location to Photos & EXIF Editor | ToolsforTools',
    description: 'Free online geotag photo editor. Add GPS location to photos, inject latitude & longitude EXIF coordinates, and edit geotag photos online with zero server uploads.',
    url: 'https://toolsfortools.in/tools/geo-tag-changer',
    siteName: 'ToolsforTools',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Geotag Photo Online Free — Add GPS Location to Photos & EXIF Editor | ToolsforTools',
    description: 'Free online geotag photo editor. Add GPS location to photos, inject latitude & longitude EXIF coordinates, and edit geotag photos online with zero server uploads.',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  const seoData = TOOLS_SEO_DATA['geo-tag-changer'];
  return (
    <>
      {children}
      {seoData && <ToolSeoSection data={seoData} />}
    </>
  );
}
