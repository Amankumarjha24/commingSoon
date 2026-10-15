import type { Metadata } from 'next';
import ToolSeoSection from '@/components/ToolSeoSection';
import { TOOLS_SEO_DATA } from '@/lib/toolsSeoData';

export const metadata: Metadata = {
  title: '3D Birthday & Festival Surprise Wisher — 3D Gift Box & Music',
  description: 'Create interactive 3D birthday & festival greeting surprises (Diwali, Eid, Christmas, Holi) with 3D gift box unboxing, synth music, confetti, and short link sharing.',
  alternates: {
    canonical: 'https://toolsfortools.in/tools/festival-greetings',
  },
  openGraph: {
    title: '3D Birthday & Festival Surprise Wisher — 3D Gift Box & Music | ToolsforTools',
    description: 'Create interactive 3D birthday & festival greeting surprises (Diwali, Eid, Christmas, Holi) with 3D gift box unboxing, synth music, confetti, and short link sharing.',
    url: 'https://toolsfortools.in/tools/festival-greetings',
    siteName: 'ToolsforTools',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: '3D Birthday & Festival Surprise Wisher — 3D Gift Box & Music | ToolsforTools',
    description: 'Create interactive 3D birthday & festival greeting surprises (Diwali, Eid, Christmas, Holi) with 3D gift box unboxing, synth music, confetti, and short link sharing.',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  const seoData = TOOLS_SEO_DATA['festival-greetings'];
  return (
    <>
      {children}
      {seoData && <ToolSeoSection data={seoData} />}
    </>
  );
}
