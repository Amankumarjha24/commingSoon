import type { Metadata } from 'next';
import ToolSeoSection from '@/components/ToolSeoSection';
import { TOOLS_SEO_DATA } from '@/lib/toolsSeoData';

export const metadata: Metadata = {
  title: 'Combine Images Online — Side-by-Side & Grid Photo Collage Maker',
  description: 'Combine images online free. Merge photos side by side, vertically, or create grid photo collages with customizable spacing and high-res export.',
  alternates: {
    canonical: 'https://toolsfortools.in/tools/combine-images-collage',
  },
  openGraph: {
    title: 'Combine Images Online — Side-by-Side & Grid Photo Collage Maker | ToolsforTools',
    description: 'Combine images online free. Merge photos side by side, vertically, or create grid photo collages with customizable spacing and high-res export.',
    url: 'https://toolsfortools.in/tools/combine-images-collage',
    siteName: 'ToolsforTools',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Combine Images Online — Side-by-Side & Grid Photo Collage Maker | ToolsforTools',
    description: 'Combine images online free. Merge photos side by side, vertically, or create grid photo collages with customizable spacing and high-res export.',
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
