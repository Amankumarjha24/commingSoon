import type { Metadata } from 'next';
import ToolSeoSection from '@/components/ToolSeoSection';
import { TOOLS_SEO_DATA } from '@/lib/toolsSeoData';

export const metadata: Metadata = {
  title: 'Lorem Ipsum Generator — Dummy Placeholder Text for Designers',
  description: 'Generate custom paragraphs, sentences, words, and list items of classic Lorem Ipsum placeholder text for UI layouts and wireframes.',
  alternates: {
    canonical: 'https://toolsfortools.in/tools/lorem-ipsum-generator',
  },
  openGraph: {
    title: 'Lorem Ipsum Generator — Dummy Placeholder Text for Designers | ToolsforTools',
    description: 'Generate custom paragraphs, sentences, words, and list items of classic Lorem Ipsum placeholder text for UI layouts and wireframes.',
    url: 'https://toolsfortools.in/tools/lorem-ipsum-generator',
    siteName: 'ToolsforTools',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Lorem Ipsum Generator — Dummy Placeholder Text for Designers | ToolsforTools',
    description: 'Generate custom paragraphs, sentences, words, and list items of classic Lorem Ipsum placeholder text for UI layouts and wireframes.',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  const seoData = TOOLS_SEO_DATA['lorem-ipsum-generator'];
  return (
    <>
      {children}
      {seoData && <ToolSeoSection data={seoData} />}
    </>
  );
}
