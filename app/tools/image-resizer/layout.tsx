import type { Metadata } from 'next';
import ToolSeoSection from '@/components/ToolSeoSection';
import { TOOLS_SEO_DATA } from '@/lib/toolsSeoData';

export const metadata: Metadata = {
  title: 'Image Resizer Online Free — Resize Photos by Dimensions & Pixels',
  description: 'Resize image online free. Adjust width, height, aspect ratio, and pixels for passport photos, exam applications, and social media without quality loss.',
  alternates: {
    canonical: 'https://toolsfortools.in/tools/image-resizer',
  },
  openGraph: {
    title: 'Image Resizer Online Free — Resize Photos by Dimensions & Pixels | ToolsforTools',
    description: 'Resize image online free. Adjust width, height, aspect ratio, and pixels for passport photos, exam applications, and social media without quality loss.',
    url: 'https://toolsfortools.in/tools/image-resizer',
    siteName: 'ToolsforTools',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Image Resizer Online Free — Resize Photos by Dimensions & Pixels | ToolsforTools',
    description: 'Resize image online free. Adjust width, height, aspect ratio, and pixels for passport photos, exam applications, and social media without quality loss.',
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
