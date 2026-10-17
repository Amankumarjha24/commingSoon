import type { Metadata } from 'next';
import ToolSeoSection from '@/components/ToolSeoSection';
import { TOOLS_SEO_DATA } from '@/lib/toolsSeoData';

export const metadata: Metadata = {
  title: 'Mute Video Online Free — Remove Audio Track from Video Privately',
  description: 'Mute video online free. Remove audio tracks and strip sound from MP4, WebM, and MOV videos directly in your browser with zero file upload.',
  alternates: {
    canonical: 'https://toolsfortools.in/tools/mute-video',
  },
  openGraph: {
    title: 'Mute Video Online Free — Remove Audio Track from Video Privately | ToolsforTools',
    description: 'Mute video online free. Remove audio tracks and strip sound from MP4, WebM, and MOV videos directly in your browser with zero file upload.',
    url: 'https://toolsfortools.in/tools/mute-video',
    siteName: 'ToolsforTools',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Mute Video Online Free — Remove Audio Track from Video Privately | ToolsforTools',
    description: 'Mute video online free. Remove audio tracks and strip sound from MP4, WebM, and MOV videos directly in your browser with zero file upload.',
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
