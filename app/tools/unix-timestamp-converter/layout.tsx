import type { Metadata } from 'next';
import ToolSeoSection from '@/components/ToolSeoSection';
import { TOOLS_SEO_DATA } from '@/lib/toolsSeoData';

export const metadata: Metadata = {
  title: 'Unix Timestamp Converter — Epoch to Human Readable Date & Time',
  description: 'Convert Unix epoch timestamps to human-readable dates in UTC and local timezones, or generate timestamps from dates.',
  alternates: {
    canonical: 'https://toolsfortools.in/tools/unix-timestamp-converter',
  },
  openGraph: {
    title: 'Unix Timestamp Converter — Epoch to Human Readable Date & Time | ToolsforTools',
    description: 'Convert Unix epoch timestamps to human-readable dates in UTC and local timezones, or generate timestamps from dates.',
    url: 'https://toolsfortools.in/tools/unix-timestamp-converter',
    siteName: 'ToolsforTools',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Unix Timestamp Converter — Epoch to Human Readable Date & Time | ToolsforTools',
    description: 'Convert Unix epoch timestamps to human-readable dates in UTC and local timezones, or generate timestamps from dates.',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  const seoData = TOOLS_SEO_DATA['unix-timestamp-converter'];
  return (
    <>
      {children}
      {seoData && <ToolSeoSection data={seoData} />}
    </>
  );
}
