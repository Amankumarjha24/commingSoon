import type { Metadata } from 'next';
import ToolSeoSection from '@/components/ToolSeoSection';
import { TOOLS_SEO_DATA } from '@/lib/toolsSeoData';

export const metadata: Metadata = {
  title: 'Trim Video Online Free — Cut Video Clips Without Watermark',
  description: 'Trim video online free. Cut and crop video segments with millisecond precision without watermarks, quality loss, or server uploads.',
  alternates: {
    canonical: 'https://toolsfortools.in/tools/trim-video',
  },
  openGraph: {
    title: 'Trim Video Online Free — Cut Video Clips Without Watermark | ToolsforTools',
    description: 'Trim video online free. Cut and crop video segments with millisecond precision without watermarks, quality loss, or server uploads.',
    url: 'https://toolsfortools.in/tools/trim-video',
    siteName: 'ToolsforTools',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Trim Video Online Free — Cut Video Clips Without Watermark | ToolsforTools',
    description: 'Trim video online free. Cut and crop video segments with millisecond precision without watermarks, quality loss, or server uploads.',
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
