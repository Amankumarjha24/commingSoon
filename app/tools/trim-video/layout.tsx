import type { Metadata } from 'next';
import ToolSeoSection from '@/components/ToolSeoSection';
import { TOOLS_SEO_DATA } from '@/lib/toolsSeoData';

export const metadata: Metadata = {
  title: 'Video Trimmer Online — Cut & Trim Video Clips with Millisecond Precision',
  description: 'Trim and cut video segments with frame-by-frame accuracy. Export clean clips without watermarks or file size limits.',
  alternates: {
    canonical: 'https://toolsfortools.in/tools/trim-video',
  },
  openGraph: {
    title: 'Video Trimmer Online — Cut & Trim Video Clips with Millisecond Precision | ToolsforTools',
    description: 'Trim and cut video segments with frame-by-frame accuracy. Export clean clips without watermarks or file size limits.',
    url: 'https://toolsfortools.in/tools/trim-video',
    siteName: 'ToolsforTools',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Video Trimmer Online — Cut & Trim Video Clips with Millisecond Precision | ToolsforTools',
    description: 'Trim and cut video segments with frame-by-frame accuracy. Export clean clips without watermarks or file size limits.',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  const seoData = TOOLS_SEO_DATA['trim-video'];
  return (
    <>
      {children}
      {seoData && <ToolSeoSection data={seoData} />}
    </>
  );
}
