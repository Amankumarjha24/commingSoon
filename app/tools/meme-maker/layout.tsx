import type { Metadata } from 'next';
import ToolSeoSection from '@/components/ToolSeoSection';
import { TOOLS_SEO_DATA } from '@/lib/toolsSeoData';

export const metadata: Metadata = {
  title: 'Meme Maker Online Free — Create Custom Memes with Captions',
  description: 'Free online meme maker and generator. Create custom memes with top and bottom text captions, viral templates, customizable fonts, and instant downloads.',
  alternates: {
    canonical: 'https://toolsfortools.in/tools/meme-maker',
  },
  openGraph: {
    title: 'Meme Maker Online Free — Create Custom Memes with Captions | ToolsforTools',
    description: 'Free online meme maker and generator. Create custom memes with top and bottom text captions, viral templates, customizable fonts, and instant downloads.',
    url: 'https://toolsfortools.in/tools/meme-maker',
    siteName: 'ToolsforTools',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Meme Maker Online Free — Create Custom Memes with Captions | ToolsforTools',
    description: 'Free online meme maker and generator. Create custom memes with top and bottom text captions, viral templates, customizable fonts, and instant downloads.',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  const seoData = TOOLS_SEO_DATA['meme-maker'];
  return (
    <>
      {children}
      {seoData && <ToolSeoSection data={seoData} />}
    </>
  );
}
