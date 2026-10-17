import type { Metadata } from 'next';
import ToolSeoSection from '@/components/ToolSeoSection';
import { TOOLS_SEO_DATA } from '@/lib/toolsSeoData';

export const metadata: Metadata = {
  title: 'Profile Picture Maker Online — Round Avatar & Border Ring Studio',
  description: 'Profile picture maker online free. Create circular avatars with colorful gradient border rings and badges for WhatsApp, Instagram, and LinkedIn.',
  alternates: {
    canonical: 'https://toolsfortools.in/tools/profile-photo-maker',
  },
  openGraph: {
    title: 'Profile Picture Maker Online — Round Avatar & Border Ring Studio | ToolsforTools',
    description: 'Profile picture maker online free. Create circular avatars with colorful gradient border rings and badges for WhatsApp, Instagram, and LinkedIn.',
    url: 'https://toolsfortools.in/tools/profile-photo-maker',
    siteName: 'ToolsforTools',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Profile Picture Maker Online — Round Avatar & Border Ring Studio | ToolsforTools',
    description: 'Profile picture maker online free. Create circular avatars with colorful gradient border rings and badges for WhatsApp, Instagram, and LinkedIn.',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  const seoData = TOOLS_SEO_DATA['profile-photo-maker'];
  return (
    <>
      {children}
      {seoData && <ToolSeoSection data={seoData} />}
    </>
  );
}
