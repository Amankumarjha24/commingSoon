import type { Metadata } from 'next';
import ToolSeoSection from '@/components/ToolSeoSection';
import { TOOLS_SEO_DATA } from '@/lib/toolsSeoData';

export const metadata: Metadata = {
  title: 'Video to GIF Converter Online — Convert MP4 to Animated GIF Free',
  description: 'Convert video to GIF online free. Turn MP4, WebM, and MOV clips into high-quality looping animated GIFs with custom framerate and dimensions.',
  alternates: {
    canonical: 'https://toolsfortools.in/tools/video-to-gif',
  },
  openGraph: {
    title: 'Video to GIF Converter Online — Convert MP4 to Animated GIF Free | ToolsforTools',
    description: 'Convert video to GIF online free. Turn MP4, WebM, and MOV clips into high-quality looping animated GIFs with custom framerate and dimensions.',
    url: 'https://toolsfortools.in/tools/video-to-gif',
    siteName: 'ToolsforTools',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Video to GIF Converter Online — Convert MP4 to Animated GIF Free | ToolsforTools',
    description: 'Convert video to GIF online free. Turn MP4, WebM, and MOV clips into high-quality looping animated GIFs with custom framerate and dimensions.',
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
