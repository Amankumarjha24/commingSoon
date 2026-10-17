import type { Metadata } from 'next';
import ToolSeoSection from '@/components/ToolSeoSection';
import { TOOLS_SEO_DATA } from '@/lib/toolsSeoData';

export const metadata: Metadata = {
  title: 'Customised 3D Birthday Wishes & Festival Greetings Creator with Music',
  description: 'Create unique customised 3D birthday wishes and animated festival greetings (Diwali, Eid, Holi) with 3D gift box unboxing, music, and instant shareable links.',
  alternates: {
    canonical: 'https://toolsfortools.in/tools/festival-greetings',
  },
  openGraph: {
    title: 'Customised 3D Birthday Wishes & Festival Greetings Creator with Music | ToolsforTools',
    description: 'Create unique customised 3D birthday wishes and animated festival greetings (Diwali, Eid, Holi) with 3D gift box unboxing, music, and instant shareable links.',
    url: 'https://toolsfortools.in/tools/festival-greetings',
    siteName: 'ToolsforTools',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Customised 3D Birthday Wishes & Festival Greetings Creator with Music | ToolsforTools',
    description: 'Create unique customised 3D birthday wishes and animated festival greetings (Diwali, Eid, Holi) with 3D gift box unboxing, music, and instant shareable links.',
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
