import type { Metadata } from 'next';
import ToolSeoSection from '@/components/ToolSeoSection';
import { TOOLS_SEO_DATA } from '@/lib/toolsSeoData';

export const metadata: Metadata = {
  title: 'Lorem Ipsum Generator — Custom Dummy Placeholder Text Generator',
  description: 'Free online Lorem Ipsum generator. Generate custom dummy placeholder text in paragraphs, sentences, or words for web design and mockups.',
  alternates: {
    canonical: 'https://toolsfortools.in/tools/lorem-ipsum-generator',
  },
  openGraph: {
    title: 'Lorem Ipsum Generator — Custom Dummy Placeholder Text Generator | ToolsforTools',
    description: 'Free online Lorem Ipsum generator. Generate custom dummy placeholder text in paragraphs, sentences, or words for web design and mockups.',
    url: 'https://toolsfortools.in/tools/lorem-ipsum-generator',
    siteName: 'ToolsforTools',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Lorem Ipsum Generator — Custom Dummy Placeholder Text Generator | ToolsforTools',
    description: 'Free online Lorem Ipsum generator. Generate custom dummy placeholder text in paragraphs, sentences, or words for web design and mockups.',
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
