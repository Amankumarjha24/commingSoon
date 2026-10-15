import type { Metadata } from 'next';
import ToolSeoSection from '@/components/ToolSeoSection';
import { TOOLS_SEO_DATA } from '@/lib/toolsSeoData';

export const metadata: Metadata = {
  title: 'Mute Video Online — Remove Audio Track from Video Free',
  description: 'Strip sound and remove unwanted background audio tracks from MP4, WebM, and MOV video files directly in your browser.',
  alternates: {
    canonical: 'https://toolsfortools.in/tools/mute-video',
  },
  openGraph: {
    title: 'Mute Video Online — Remove Audio Track from Video Free | ToolsforTools',
    description: 'Strip sound and remove unwanted background audio tracks from MP4, WebM, and MOV video files directly in your browser.',
    url: 'https://toolsfortools.in/tools/mute-video',
    siteName: 'ToolsforTools',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Mute Video Online — Remove Audio Track from Video Free | ToolsforTools',
    description: 'Strip sound and remove unwanted background audio tracks from MP4, WebM, and MOV video files directly in your browser.',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  const seoData = TOOLS_SEO_DATA['mute-video'];
  return (
    <>
      {children}
      {seoData && <ToolSeoSection data={seoData} />}
    </>
  );
}
