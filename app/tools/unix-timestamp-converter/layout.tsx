import type { Metadata } from 'next';
import ToolSeoSection from '@/components/ToolSeoSection';
import { TOOLS_SEO_DATA } from '@/lib/toolsSeoData';

export const metadata: Metadata = {
  title: 'Unix Timestamp Converter — Epoch to Human Date & Time Converter',
  description: 'Unix timestamp converter online. Convert epoch time to human-readable dates and convert date/time to Unix timestamp in UTC and local timezone.',
  alternates: {
    canonical: 'https://toolsfortools.in/tools/unix-timestamp-converter',
  },
  openGraph: {
    title: 'Unix Timestamp Converter — Epoch to Human Date & Time Converter | ToolsforTools',
    description: 'Unix timestamp converter online. Convert epoch time to human-readable dates and convert date/time to Unix timestamp in UTC and local timezone.',
    url: 'https://toolsfortools.in/tools/unix-timestamp-converter',
    siteName: 'ToolsforTools',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Unix Timestamp Converter — Epoch to Human Date & Time Converter | ToolsforTools',
    description: 'Unix timestamp converter online. Convert epoch time to human-readable dates and convert date/time to Unix timestamp in UTC and local timezone.',
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
