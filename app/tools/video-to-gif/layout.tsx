import type { Metadata } from 'next';
import ToolSeoSection from '@/components/ToolSeoSection';
import { TOOLS_SEO_DATA } from '@/lib/toolsSeoData';

export const metadata: Metadata = {
  title: 'Video to GIF Converter — Create Animated Looping GIFs Online',
  description: 'Convert MP4, WebM, and MOV videos into high-quality, looping animated GIF files and frame sequences with custom FPS. 100% free and client-side.',
  alternates: {
    canonical: 'https://toolsfortools.in/tools/video-to-gif',
  },
  openGraph: {
    title: 'Video to GIF Converter — Create Animated Looping GIFs Online | ToolsforTools',
    description: 'Convert MP4, WebM, and MOV videos into high-quality, looping animated GIF files and frame sequences with custom FPS. 100% free and client-side.',
    url: 'https://toolsfortools.in/tools/video-to-gif',
    siteName: 'ToolsforTools',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Video to GIF Converter — Create Animated Looping GIFs Online | ToolsforTools',
    description: 'Convert MP4, WebM, and MOV videos into high-quality, looping animated GIF files and frame sequences with custom FPS. 100% free and client-side.',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  const seoData = TOOLS_SEO_DATA['video-to-gif'];
  return (
    <>
      {children}
      {seoData && <ToolSeoSection data={seoData} />}
    </>
  );
}
