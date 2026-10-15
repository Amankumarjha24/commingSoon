import type { Metadata } from 'next';
import ToolSeoSection from '@/components/ToolSeoSection';
import { TOOLS_SEO_DATA } from '@/lib/toolsSeoData';

export const metadata: Metadata = {
  title: 'Organize PDF Pages — Reorder, Rotate & Delete Pages Visually',
  description: 'Visual drag-and-drop PDF page organizer. Reorder, rotate 90/180 degrees, and delete unwanted pages instantly in your browser.',
  alternates: {
    canonical: 'https://toolsfortools.in/tools/organize-pdf',
  },
  openGraph: {
    title: 'Organize PDF Pages — Reorder, Rotate & Delete Pages Visually | ToolsforTools',
    description: 'Visual drag-and-drop PDF page organizer. Reorder, rotate 90/180 degrees, and delete unwanted pages instantly in your browser.',
    url: 'https://toolsfortools.in/tools/organize-pdf',
    siteName: 'ToolsforTools',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Organize PDF Pages — Reorder, Rotate & Delete Pages Visually | ToolsforTools',
    description: 'Visual drag-and-drop PDF page organizer. Reorder, rotate 90/180 degrees, and delete unwanted pages instantly in your browser.',
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
