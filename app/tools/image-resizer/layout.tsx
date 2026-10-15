import type { Metadata } from 'next';
import ToolSeoSection from '@/components/ToolSeoSection';
import { TOOLS_SEO_DATA } from '@/lib/toolsSeoData';

export const metadata: Metadata = {
  title: 'Image Resizer Online — Resize Photos by Pixels or Percentage',
  description: 'Resize images to any custom width and height with aspect ratio lock. Batch image resizing with zero quality degradation.',
  alternates: {
    canonical: 'https://toolsfortools.in/tools/image-resizer',
  },
  openGraph: {
    title: 'Image Resizer Online — Resize Photos by Pixels or Percentage | ToolsforTools',
    description: 'Resize images to any custom width and height with aspect ratio lock. Batch image resizing with zero quality degradation.',
    url: 'https://toolsfortools.in/tools/image-resizer',
    siteName: 'ToolsforTools',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Image Resizer Online — Resize Photos by Pixels or Percentage | ToolsforTools',
    description: 'Resize images to any custom width and height with aspect ratio lock. Batch image resizing with zero quality degradation.',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  const seoData = TOOLS_SEO_DATA['image-resizer'];
  return (
    <>
      {children}
      {seoData && <ToolSeoSection data={seoData} />}
    </>
  );
}
