import type { Metadata } from 'next';
import ToolSeoSection from '@/components/ToolSeoSection';
import { TOOLS_SEO_DATA } from '@/lib/toolsSeoData';

export const metadata: Metadata = {
  title: 'Passport Size Photo Maker Online & UPSC Photo Resizer (3.5x4.5cm, 20KB)',
  description: 'Create passport size photos online and resize photo and signature for UPSC, SSC, IBPS exams. Exact 20KB/50KB compressor, 3.5x4.5cm crop, and clean white background.',
  alternates: {
    canonical: 'https://toolsfortools.in/tools/govt-photo-signature-studio',
  },
  openGraph: {
    title: 'Passport Size Photo Maker Online & UPSC Photo Resizer (3.5x4.5cm, 20KB) | ToolsforTools',
    description: 'Create passport size photos online and resize photo and signature for UPSC, SSC, IBPS exams. Exact 20KB/50KB compressor, 3.5x4.5cm crop, and clean white background.',
    url: 'https://toolsfortools.in/tools/govt-photo-signature-studio',
    siteName: 'ToolsforTools',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Passport Size Photo Maker Online & UPSC Photo Resizer (3.5x4.5cm, 20KB) | ToolsforTools',
    description: 'Create passport size photos online and resize photo and signature for UPSC, SSC, IBPS exams. Exact 20KB/50KB compressor, 3.5x4.5cm crop, and clean white background.',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  const seoData = TOOLS_SEO_DATA['govt-photo-signature-studio'];
  return (
    <>
      {children}
      {seoData && <ToolSeoSection data={seoData} />}
    </>
  );
}
