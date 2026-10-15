import type { Metadata } from 'next';
import ToolSeoSection from '@/components/ToolSeoSection';
import { TOOLS_SEO_DATA } from '@/lib/toolsSeoData';

export const metadata: Metadata = {
  title: 'Govt Form Photo & Signature Studio — UPSC, SSC & Exam Resizer',
  description: 'Crop passport photos (3.5x4.5cm) & signatures for UPSC, SSC, IBPS, police exams. Clean white backgrounds, exact KB targets, and printable 4x6 / A4 sheet layouts.',
  alternates: {
    canonical: 'https://toolsfortools.in/tools/govt-photo-signature-studio',
  },
  openGraph: {
    title: 'Govt Form Photo & Signature Studio — UPSC, SSC & Exam Resizer | ToolsforTools',
    description: 'Crop passport photos (3.5x4.5cm) & signatures for UPSC, SSC, IBPS, police exams. Clean white backgrounds, exact KB targets, and printable 4x6 / A4 sheet layouts.',
    url: 'https://toolsfortools.in/tools/govt-photo-signature-studio',
    siteName: 'ToolsforTools',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Govt Form Photo & Signature Studio — UPSC, SSC & Exam Resizer | ToolsforTools',
    description: 'Crop passport photos (3.5x4.5cm) & signatures for UPSC, SSC, IBPS, police exams. Clean white backgrounds, exact KB targets, and printable 4x6 / A4 sheet layouts.',
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
