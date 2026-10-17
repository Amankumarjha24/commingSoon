import type { Metadata } from 'next';
import ToolSeoSection from '@/components/ToolSeoSection';
import { TOOLS_SEO_DATA } from '@/lib/toolsSeoData';

export const metadata: Metadata = {
  title: 'Word Counter Online — Character Count, Sentence & Reading Time Analyzer',
  description: 'Free online word counter and character counter. Calculate words, characters, sentences, paragraphs, and estimated reading time in real time.',
  alternates: {
    canonical: 'https://toolsfortools.in/tools/word-counter',
  },
  openGraph: {
    title: 'Word Counter Online — Character Count, Sentence & Reading Time Analyzer | ToolsforTools',
    description: 'Free online word counter and character counter. Calculate words, characters, sentences, paragraphs, and estimated reading time in real time.',
    url: 'https://toolsfortools.in/tools/word-counter',
    siteName: 'ToolsforTools',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Word Counter Online — Character Count, Sentence & Reading Time Analyzer | ToolsforTools',
    description: 'Free online word counter and character counter. Calculate words, characters, sentences, paragraphs, and estimated reading time in real time.',
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
