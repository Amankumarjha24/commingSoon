import type { Metadata } from 'next';
import ToolSeoSection from '@/components/ToolSeoSection';
import { TOOLS_SEO_DATA } from '@/lib/toolsSeoData';

export const metadata: Metadata = {
  title: 'Image Compressor to 20KB, 50KB, 100KB — Reduce JPG Size Online Free',
  description: 'Free online image compressor to 20KB, 50KB, and 100KB. Reduce photo and picture size in KB for UPSC, SSC exam portals and online forms without losing quality.',
  alternates: {
    canonical: 'https://toolsfortools.in/tools/image-compressor',
  },
  openGraph: {
    title: 'Image Compressor to 20KB, 50KB, 100KB — Reduce JPG Size Online Free | ToolsforTools',
    description: 'Free online image compressor to 20KB, 50KB, and 100KB. Reduce photo and picture size in KB for UPSC, SSC exam portals and online forms without losing quality.',
    url: 'https://toolsfortools.in/tools/image-compressor',
    siteName: 'ToolsforTools',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Image Compressor to 20KB, 50KB, 100KB — Reduce JPG Size Online Free | ToolsforTools',
    description: 'Free online image compressor to 20KB, 50KB, and 100KB. Reduce photo and picture size in KB for UPSC, SSC exam portals and online forms without losing quality.',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  const seoData = TOOLS_SEO_DATA['image-compressor'];
  return (
    <>
      {children}
      {seoData && <ToolSeoSection data={seoData} />}
    </>
  );
}
