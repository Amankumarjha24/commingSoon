import type { Metadata } from 'next';
import ToolSeoSection from '@/components/ToolSeoSection';
import { TOOLS_SEO_DATA } from '@/lib/toolsSeoData';

export const metadata: Metadata = {
  title: 'JSON to CSV Converter Online — JSON, CSV, XML & YAML Formatter',
  description: 'Free online data format converter. Convert JSON to CSV, CSV to JSON, XML to JSON, and YAML with automatic syntax validation and instant download.',
  alternates: {
    canonical: 'https://toolsfortools.in/tools/data-format-converter',
  },
  openGraph: {
    title: 'JSON to CSV Converter Online — JSON, CSV, XML & YAML Formatter | ToolsforTools',
    description: 'Free online data format converter. Convert JSON to CSV, CSV to JSON, XML to JSON, and YAML with automatic syntax validation and instant download.',
    url: 'https://toolsfortools.in/tools/data-format-converter',
    siteName: 'ToolsforTools',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'JSON to CSV Converter Online — JSON, CSV, XML & YAML Formatter | ToolsforTools',
    description: 'Free online data format converter. Convert JSON to CSV, CSV to JSON, XML to JSON, and YAML with automatic syntax validation and instant download.',
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
