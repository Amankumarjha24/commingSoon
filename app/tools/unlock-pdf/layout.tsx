import type { Metadata } from 'next';
import ToolSeoSection from '@/components/ToolSeoSection';
import { TOOLS_SEO_DATA } from '@/lib/toolsSeoData';

export const metadata: Metadata = {
  title: 'Unlock PDF Online Free — Remove PDF Password & Restrictions',
  description: 'Unlock PDF online free. Remove known passwords and permission restrictions from PDF files instantly in your browser with 100% security.',
  alternates: {
    canonical: 'https://toolsfortools.in/tools/unlock-pdf',
  },
  openGraph: {
    title: 'Unlock PDF Online Free — Remove PDF Password & Restrictions | ToolsforTools',
    description: 'Unlock PDF online free. Remove known passwords and permission restrictions from PDF files instantly in your browser with 100% security.',
    url: 'https://toolsfortools.in/tools/unlock-pdf',
    siteName: 'ToolsforTools',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Unlock PDF Online Free — Remove PDF Password & Restrictions | ToolsforTools',
    description: 'Unlock PDF online free. Remove known passwords and permission restrictions from PDF files instantly in your browser with 100% security.',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  const seoData = TOOLS_SEO_DATA['unlock-pdf'];
  return (
    <>
      {children}
      {seoData && <ToolSeoSection data={seoData} />}
    </>
  );
}
