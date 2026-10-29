import type { Metadata } from 'next';
import ToolSeoSection from '@/components/ToolSeoSection';
import { TOOLS_SEO_DATA } from '@/lib/toolsSeoData';

export const metadata: Metadata = {
  title: 'Audio Cutter Online Free – Trim MP3 & Songs | ToolsforTools',
  description:
    'Cut MP3 and other supported audio files online for free. Select start and end times, preview your clip, and download it easily. No signup required.',
  alternates: {
    canonical: 'https://toolsfortools.in/tools/audio-trimmer',
  },
  openGraph: {
    title: 'Audio Cutter Online Free – Trim MP3 & Songs | ToolsforTools',
    description:
      'Cut MP3 and other supported audio files online for free. Select start and end times, preview your clip, and download it easily. No signup required.',
    url: 'https://toolsfortools.in/tools/audio-trimmer',
    siteName: 'ToolsforTools',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Audio Cutter Online Free – Trim MP3 & Songs | ToolsforTools',
    description:
      'Cut MP3 and other supported audio files online for free. Select start and end times, preview your clip, and download it easily. No signup required.',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  const seoData = TOOLS_SEO_DATA['audio-trimmer'];
  return (
    <>
      {children}
      {seoData && <ToolSeoSection data={seoData} />}
    </>
  );
}
