import type { Metadata } from 'next';
import ToolSeoSection from '@/components/ToolSeoSection';
import { TOOLS_SEO_DATA } from '@/lib/toolsSeoData';

export const metadata: Metadata = {
  title: 'Video to Audio Extractor — Convert Video to MP3 & WAV Online',
  description: 'Extract crystal-clear audio tracks and background music from video files into lossless WAV or MP3 formats in your browser.',
  alternates: {
    canonical: 'https://toolsfortools.in/tools/video-to-audio-extractor',
  },
  openGraph: {
    title: 'Video to Audio Extractor — Convert Video to MP3 & WAV Online | ToolsforTools',
    description: 'Extract crystal-clear audio tracks and background music from video files into lossless WAV or MP3 formats in your browser.',
    url: 'https://toolsfortools.in/tools/video-to-audio-extractor',
    siteName: 'ToolsforTools',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Video to Audio Extractor — Convert Video to MP3 & WAV Online | ToolsforTools',
    description: 'Extract crystal-clear audio tracks and background music from video files into lossless WAV or MP3 formats in your browser.',
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
