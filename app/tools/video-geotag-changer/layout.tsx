import type { Metadata } from 'next';
import ToolSeoSection from '@/components/ToolSeoSection';
import { TOOLS_SEO_DATA } from '@/lib/toolsSeoData';

export const metadata: Metadata = {
  title: 'Geotag Video Online Free – GPS Location Editor | ToolsforTools',
  description: 'Geotag videos online for free with ToolsforTools. Add or change GPS location metadata, edit video coordinates, and download your updated video easily.',
  alternates: {
    canonical: 'https://toolsfortools.in/tools/video-geotag-changer',
  },
  openGraph: {
    title: 'Geotag Video Online Free – GPS Location Editor | ToolsforTools',
    description: 'Geotag videos online for free with ToolsforTools. Add or change GPS location metadata, edit video coordinates, and download your updated video easily.',
    url: 'https://toolsfortools.in/tools/video-geotag-changer',
    siteName: 'ToolsforTools',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Geotag Video Online Free – GPS Location Editor | ToolsforTools',
    description: 'Geotag videos online for free with ToolsforTools. Add or change GPS location metadata, edit video coordinates, and download your updated video easily.',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  const seoData = TOOLS_SEO_DATA['video-geotag-changer'];
  return (
    <>
      {children}
      {seoData && <ToolSeoSection data={seoData} />}
    </>
  );
}
