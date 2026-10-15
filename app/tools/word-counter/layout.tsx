import type { Metadata } from 'next';
import ToolSeoSection from '@/components/ToolSeoSection';
import { TOOLS_SEO_DATA } from '@/lib/toolsSeoData';

export const metadata: Metadata = {
  title: 'Word Counter Pro — Count Words, Characters & Reading Time',
  description: 'Accurate real-time word counter, character counter, sentence counter, reading time estimator, and keyword density analyzer.',
  alternates: {
    canonical: 'https://toolsfortools.in/tools/word-counter',
  },
  openGraph: {
    title: 'Word Counter Pro — Count Words, Characters & Reading Time | ToolsforTools',
    description: 'Accurate real-time word counter, character counter, sentence counter, reading time estimator, and keyword density analyzer.',
    url: 'https://toolsfortools.in/tools/word-counter',
    siteName: 'ToolsforTools',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Word Counter Pro — Count Words, Characters & Reading Time | ToolsforTools',
    description: 'Accurate real-time word counter, character counter, sentence counter, reading time estimator, and keyword density analyzer.',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  const seoData = TOOLS_SEO_DATA['word-counter'];
  return (
    <>
      {children}
      {seoData && <ToolSeoSection data={seoData} />}
    </>
  );
}
