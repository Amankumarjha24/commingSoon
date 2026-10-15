import type { Metadata } from 'next';
import ToolSeoSection from '@/components/ToolSeoSection';
import { TOOLS_SEO_DATA } from '@/lib/toolsSeoData';

export const metadata: Metadata = {
  title: 'Online Meme Maker & Generator — Custom Top & Bottom Captions',
  description: 'Create hilarious viral memes with classic top & bottom text captions, customizable fonts, outline strokes, and photo uploads.',
  alternates: {
    canonical: 'https://toolsfortools.in/tools/meme-maker',
  },
  openGraph: {
    title: 'Online Meme Maker & Generator — Custom Top & Bottom Captions | ToolsforTools',
    description: 'Create hilarious viral memes with classic top & bottom text captions, customizable fonts, outline strokes, and photo uploads.',
    url: 'https://toolsfortools.in/tools/meme-maker',
    siteName: 'ToolsforTools',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Online Meme Maker & Generator — Custom Top & Bottom Captions | ToolsforTools',
    description: 'Create hilarious viral memes with classic top & bottom text captions, customizable fonts, outline strokes, and photo uploads.',
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
