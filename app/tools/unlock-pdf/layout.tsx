import type { Metadata } from 'next';
import ToolSeoSection from '@/components/ToolSeoSection';
import { TOOLS_SEO_DATA } from '@/lib/toolsSeoData';

export const metadata: Metadata = {
  title: 'Unlock PDF Online — Remove PDF Passwords & Restrictions',
  description: 'Instantly decrypt password-protected PDFs and strip permission restrictions in your browser. 100% private and secure.',
  alternates: {
    canonical: 'https://toolsfortools.in/tools/unlock-pdf',
  },
  openGraph: {
    title: 'Unlock PDF Online — Remove PDF Passwords & Restrictions | ToolsforTools',
    description: 'Instantly decrypt password-protected PDFs and strip permission restrictions in your browser. 100% private and secure.',
    url: 'https://toolsfortools.in/tools/unlock-pdf',
    siteName: 'ToolsforTools',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Unlock PDF Online — Remove PDF Passwords & Restrictions | ToolsforTools',
    description: 'Instantly decrypt password-protected PDFs and strip permission restrictions in your browser. 100% private and secure.',
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
