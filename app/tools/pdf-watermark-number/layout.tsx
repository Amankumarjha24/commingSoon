import type { Metadata } from 'next';
import ToolSeoSection from '@/components/ToolSeoSection';
import { TOOLS_SEO_DATA } from '@/lib/toolsSeoData';

export const metadata: Metadata = {
  title: 'Add Watermark & Page Numbers to PDF Online Free',
  description: 'Add watermark to PDF online free and insert Bates page numbers. Customize text opacity, rotation, and font with zero cloud upload.',
  alternates: {
    canonical: 'https://toolsfortools.in/tools/pdf-watermark-number',
  },
  openGraph: {
    title: 'Add Watermark & Page Numbers to PDF Online Free | ToolsforTools',
    description: 'Add watermark to PDF online free and insert Bates page numbers. Customize text opacity, rotation, and font with zero cloud upload.',
    url: 'https://toolsfortools.in/tools/pdf-watermark-number',
    siteName: 'ToolsforTools',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Add Watermark & Page Numbers to PDF Online Free | ToolsforTools',
    description: 'Add watermark to PDF online free and insert Bates page numbers. Customize text opacity, rotation, and font with zero cloud upload.',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  const seoData = TOOLS_SEO_DATA['pdf-watermark-number'];
  return (
    <>
      {children}
      {seoData && <ToolSeoSection data={seoData} />}
    </>
  );
}
