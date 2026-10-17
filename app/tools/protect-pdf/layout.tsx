import type { Metadata } from 'next';
import ToolSeoSection from '@/components/ToolSeoSection';
import { TOOLS_SEO_DATA } from '@/lib/toolsSeoData';

export const metadata: Metadata = {
  title: 'Password Protect PDF Online — Encrypt PDF with Password Free',
  description: 'Password protect PDF online free. Encrypt your sensitive PDF documents with secure AES password encryption directly in your browser.',
  alternates: {
    canonical: 'https://toolsfortools.in/tools/protect-pdf',
  },
  openGraph: {
    title: 'Password Protect PDF Online — Encrypt PDF with Password Free | ToolsforTools',
    description: 'Password protect PDF online free. Encrypt your sensitive PDF documents with secure AES password encryption directly in your browser.',
    url: 'https://toolsfortools.in/tools/protect-pdf',
    siteName: 'ToolsforTools',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Password Protect PDF Online — Encrypt PDF with Password Free | ToolsforTools',
    description: 'Password protect PDF online free. Encrypt your sensitive PDF documents with secure AES password encryption directly in your browser.',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  const seoData = TOOLS_SEO_DATA['protect-pdf'];
  return (
    <>
      {children}
      {seoData && <ToolSeoSection data={seoData} />}
    </>
  );
}
