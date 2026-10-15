import type { Metadata } from 'next';
import ToolSeoSection from '@/components/ToolSeoSection';
import { TOOLS_SEO_DATA } from '@/lib/toolsSeoData';

export const metadata: Metadata = {
  title: 'Data Format Converter — Bi-directional JSON, YAML, XML & CSV',
  description: 'Convert seamlessly between JSON, YAML, XML, and CSV data formats with automatic syntax validation and beautification.',
  alternates: {
    canonical: 'https://toolsfortools.in/tools/data-format-converter',
  },
  openGraph: {
    title: 'Data Format Converter — Bi-directional JSON, YAML, XML & CSV | ToolsforTools',
    description: 'Convert seamlessly between JSON, YAML, XML, and CSV data formats with automatic syntax validation and beautification.',
    url: 'https://toolsfortools.in/tools/data-format-converter',
    siteName: 'ToolsforTools',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Data Format Converter — Bi-directional JSON, YAML, XML & CSV | ToolsforTools',
    description: 'Convert seamlessly between JSON, YAML, XML, and CSV data formats with automatic syntax validation and beautification.',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  const seoData = TOOLS_SEO_DATA['data-format-converter'];
  return (
    <>
      {children}
      {seoData && <ToolSeoSection data={seoData} />}
    </>
  );
}
