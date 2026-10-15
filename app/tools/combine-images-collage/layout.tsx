import type { Metadata } from 'next';
import ToolSeoSection from '@/components/ToolSeoSection';
import { TOOLS_SEO_DATA } from '@/lib/toolsSeoData';

export const metadata: Metadata = {
  title: 'Combine Images & Collage Maker — Merge Photos Side by Side',
  description: 'Combine multiple photos horizontally, vertically, or in grid collages with adjustable spacing and high-resolution export.',
  alternates: {
    canonical: 'https://toolsfortools.in/tools/combine-images-collage',
  },
  openGraph: {
    title: 'Combine Images & Collage Maker — Merge Photos Side by Side | ToolsforTools',
    description: 'Combine multiple photos horizontally, vertically, or in grid collages with adjustable spacing and high-resolution export.',
    url: 'https://toolsfortools.in/tools/combine-images-collage',
    siteName: 'ToolsforTools',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Combine Images & Collage Maker — Merge Photos Side by Side | ToolsforTools',
    description: 'Combine multiple photos horizontally, vertically, or in grid collages with adjustable spacing and high-resolution export.',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  const seoData = TOOLS_SEO_DATA['combine-images-collage'];
  return (
    <>
      {children}
      {seoData && <ToolSeoSection data={seoData} />}
    </>
  );
}
