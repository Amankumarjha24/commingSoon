import type { Metadata } from 'next';
import ToolSeoSection from '@/components/ToolSeoSection';
import { TOOLS_SEO_DATA } from '@/lib/toolsSeoData';

export const metadata: Metadata = {
  title: 'Organize PDF Pages Online — Reorder, Rotate & Remove Pages Free',
  description: 'Organize PDF pages online free. Reorder, rotate 90/180 degrees, and remove pages from PDF files visually in your browser with zero server uploads.',
  alternates: {
    canonical: 'https://toolsfortools.in/tools/organize-pdf',
  },
  openGraph: {
    title: 'Organize PDF Pages Online — Reorder, Rotate & Remove Pages Free | ToolsforTools',
    description: 'Organize PDF pages online free. Reorder, rotate 90/180 degrees, and remove pages from PDF files visually in your browser with zero server uploads.',
    url: 'https://toolsfortools.in/tools/organize-pdf',
    siteName: 'ToolsforTools',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Organize PDF Pages Online — Reorder, Rotate & Remove Pages Free | ToolsforTools',
    description: 'Organize PDF pages online free. Reorder, rotate 90/180 degrees, and remove pages from PDF files visually in your browser with zero server uploads.',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  const seoData = TOOLS_SEO_DATA['organize-pdf'];
  return (
    <>
      {children}
      {seoData && <ToolSeoSection data={seoData} />}
    </>
  );
}
