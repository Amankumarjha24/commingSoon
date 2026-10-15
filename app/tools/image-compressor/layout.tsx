import type { Metadata } from 'next';
import ToolSeoSection from '@/components/ToolSeoSection';
import { TOOLS_SEO_DATA } from '@/lib/toolsSeoData';

export const metadata: Metadata = {
  title: 'Target KB Image Compressor — Compress Photos to Exact 20KB, 50KB, 100KB',
  description: 'Compress photos and signatures to exact target KB sizes (20KB, 50KB, 100KB) for government job applications and portal uploads.',
  alternates: {
    canonical: 'https://toolsfortools.in/tools/image-compressor',
  },
  openGraph: {
    title: 'Target KB Image Compressor — Compress Photos to Exact 20KB, 50KB, 100KB | ToolsforTools',
    description: 'Compress photos and signatures to exact target KB sizes (20KB, 50KB, 100KB) for government job applications and portal uploads.',
    url: 'https://toolsfortools.in/tools/image-compressor',
    siteName: 'ToolsforTools',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Target KB Image Compressor — Compress Photos to Exact 20KB, 50KB, 100KB | ToolsforTools',
    description: 'Compress photos and signatures to exact target KB sizes (20KB, 50KB, 100KB) for government job applications and portal uploads.',
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
