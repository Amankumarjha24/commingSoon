import type { Metadata } from 'next';
import ToolSeoSection from '@/components/ToolSeoSection';
import { TOOLS_SEO_DATA } from '@/lib/toolsSeoData';

export const metadata: Metadata = {
  title: 'QR Code Generator Pro — Free Scannable Wi-Fi & URL QR Codes',
  description: 'Generate 100% scannable, high-resolution QR codes for websites, Wi-Fi networks, text, and WhatsApp. Export print-ready PNG and vector SVG.',
  alternates: {
    canonical: 'https://toolsfortools.in/tools/qr-generator',
  },
  openGraph: {
    title: 'QR Code Generator Pro — Free Scannable Wi-Fi & URL QR Codes | ToolsforTools',
    description: 'Generate 100% scannable, high-resolution QR codes for websites, Wi-Fi networks, text, and WhatsApp. Export print-ready PNG and vector SVG.',
    url: 'https://toolsfortools.in/tools/qr-generator',
    siteName: 'ToolsforTools',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'QR Code Generator Pro — Free Scannable Wi-Fi & URL QR Codes | ToolsforTools',
    description: 'Generate 100% scannable, high-resolution QR codes for websites, Wi-Fi networks, text, and WhatsApp. Export print-ready PNG and vector SVG.',
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
