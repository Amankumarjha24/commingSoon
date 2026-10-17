import type { Metadata } from 'next';
import ToolSeoSection from '@/components/ToolSeoSection';
import { TOOLS_SEO_DATA } from '@/lib/toolsSeoData';

export const metadata: Metadata = {
  title: 'QR Code Generator Free — Create Custom QR Codes for URLs & Wi-Fi',
  description: 'Free online QR code generator. Create custom scannable QR codes for website URLs, Wi-Fi passwords, text, and WhatsApp with high-res PNG and SVG export.',
  alternates: {
    canonical: 'https://toolsfortools.in/tools/qr-generator',
  },
  openGraph: {
    title: 'QR Code Generator Free — Create Custom QR Codes for URLs & Wi-Fi | ToolsforTools',
    description: 'Free online QR code generator. Create custom scannable QR codes for website URLs, Wi-Fi passwords, text, and WhatsApp with high-res PNG and SVG export.',
    url: 'https://toolsfortools.in/tools/qr-generator',
    siteName: 'ToolsforTools',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'QR Code Generator Free — Create Custom QR Codes for URLs & Wi-Fi | ToolsforTools',
    description: 'Free online QR code generator. Create custom scannable QR codes for website URLs, Wi-Fi passwords, text, and WhatsApp with high-res PNG and SVG export.',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  const seoData = TOOLS_SEO_DATA['qr-generator'];
  return (
    <>
      {children}
      {seoData && <ToolSeoSection data={seoData} />}
    </>
  );
}
