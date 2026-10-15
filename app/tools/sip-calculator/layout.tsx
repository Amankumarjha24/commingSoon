import type { Metadata } from 'next';
import ToolSeoSection from '@/components/ToolSeoSection';
import { TOOLS_SEO_DATA } from '@/lib/toolsSeoData';

export const metadata: Metadata = {
  title: 'SIP Wealth Calculator — Mutual Fund Compound Returns Planner',
  description: 'Calculate compound returns on SIP investments. Visualize growth curves, see month-by-month breakdown, and plan your mutual fund wealth.',
  alternates: {
    canonical: 'https://toolsfortools.in/tools/sip-calculator',
  },
  openGraph: {
    title: 'SIP Wealth Calculator — Mutual Fund Compound Returns Planner | ToolsforTools',
    description: 'Calculate compound returns on SIP investments. Visualize growth curves, see month-by-month breakdown, and plan your mutual fund wealth.',
    url: 'https://toolsfortools.in/tools/sip-calculator',
    siteName: 'ToolsforTools',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SIP Wealth Calculator — Mutual Fund Compound Returns Planner | ToolsforTools',
    description: 'Calculate compound returns on SIP investments. Visualize growth curves, see month-by-month breakdown, and plan your mutual fund wealth.',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  const seoData = TOOLS_SEO_DATA['sip-calculator'];
  return (
    <>
      {children}
      {seoData && <ToolSeoSection data={seoData} />}
    </>
  );
}
