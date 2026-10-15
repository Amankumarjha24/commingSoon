import type { Metadata } from 'next';
import ToolSeoSection from '@/components/ToolSeoSection';
import { TOOLS_SEO_DATA } from '@/lib/toolsSeoData';

export const metadata: Metadata = {
  title: 'Geo Tag Changer & EXIF GPS Editor Pro',
  description: 'Add, edit, or inject genuine GPS coordinates (Latitude, Longitude & Altitude) into photos with custom file naming. 100% private in-browser tool.',
  alternates: {
    canonical: 'https://toolsfortools.in/tools/geo-tag-changer',
  },
  openGraph: {
    title: 'Geo Tag Changer & EXIF GPS Editor Pro | ToolsforTools',
    description: 'Add, edit, or inject genuine GPS coordinates (Latitude, Longitude & Altitude) into photos with custom file naming. 100% private in-browser tool.',
    url: 'https://toolsfortools.in/tools/geo-tag-changer',
    siteName: 'ToolsforTools',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Geo Tag Changer & EXIF GPS Editor Pro | ToolsforTools',
    description: 'Add, edit, or inject genuine GPS coordinates (Latitude, Longitude & Altitude) into photos with custom file naming. 100% private in-browser tool.',
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
