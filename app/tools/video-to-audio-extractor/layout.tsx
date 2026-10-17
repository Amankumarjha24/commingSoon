import type { Metadata } from 'next';
import ToolSeoSection from '@/components/ToolSeoSection';
import { TOOLS_SEO_DATA } from '@/lib/toolsSeoData';

export const metadata: Metadata = {
  title: 'Video to Audio Converter Online Free — Extract MP3 & WAV from Video',
  description: 'Convert video to audio online for free. Extract high-quality MP3 or WAV audio from MP4, WebM, and MOV videos locally in your browser with zero watermark.',
  alternates: {
    canonical: 'https://toolsfortools.in/tools/video-to-audio-extractor',
  },
  openGraph: {
    title: 'Video to Audio Converter Online Free — Extract MP3 & WAV from Video | ToolsforTools',
    description: 'Convert video to audio online for free. Extract high-quality MP3 or WAV audio from MP4, WebM, and MOV videos locally in your browser with zero watermark.',
    url: 'https://toolsfortools.in/tools/video-to-audio-extractor',
    siteName: 'ToolsforTools',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Video to Audio Converter Online Free — Extract MP3 & WAV from Video | ToolsforTools',
    description: 'Convert video to audio online for free. Extract high-quality MP3 or WAV audio from MP4, WebM, and MOV videos locally in your browser with zero watermark.',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  const seoData = TOOLS_SEO_DATA['video-to-audio-extractor'];
  return (
    <>
      {children}
      {seoData && <ToolSeoSection data={seoData} />}
    </>
  );
}
