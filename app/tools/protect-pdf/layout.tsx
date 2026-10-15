import type { Metadata } from 'next';
import ToolSeoSection from '@/components/ToolSeoSection';
import { TOOLS_SEO_DATA } from '@/lib/toolsSeoData';

export const metadata: Metadata = {
  title: 'Protect PDF with Password — Free AES-256 PDF Encryption',
  description: 'Lock and password-protect your sensitive PDF documents with military-grade AES-256 encryption directly in your browser. Zero cloud uploads.',
  alternates: {
    canonical: 'https://toolsfortools.in/tools/protect-pdf',
  },
  openGraph: {
    title: 'Protect PDF with Password — Free AES-256 PDF Encryption | ToolsforTools',
    description: 'Lock and password-protect your sensitive PDF documents with military-grade AES-256 encryption directly in your browser. Zero cloud uploads.',
    url: 'https://toolsfortools.in/tools/protect-pdf',
    siteName: 'ToolsforTools',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Protect PDF with Password — Free AES-256 PDF Encryption | ToolsforTools',
    description: 'Lock and password-protect your sensitive PDF documents with military-grade AES-256 encryption directly in your browser. Zero cloud uploads.',
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
