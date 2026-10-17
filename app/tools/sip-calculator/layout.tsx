import type { Metadata } from 'next';
import ToolSeoSection from '@/components/ToolSeoSection';
import { TOOLS_SEO_DATA } from '@/lib/toolsSeoData';

export const metadata: Metadata = {
  title: 'SIP Calculator Online — Mutual Fund Return & Step-Up SIP Wealth Planner',
  description: 'Calculate returns on your monthly SIP mutual fund investments with compounding growth charts, inflation adjustment, and step-up SIP wealth projections.',
  alternates: {
    canonical: 'https://toolsfortools.in/tools/sip-calculator',
  },
  openGraph: {
    title: 'SIP Calculator Online — Mutual Fund Return & Step-Up SIP Wealth Planner | ToolsforTools',
    description: 'Calculate returns on your monthly SIP mutual fund investments with compounding growth charts, inflation adjustment, and step-up SIP wealth projections.',
    url: 'https://toolsfortools.in/tools/sip-calculator',
    siteName: 'ToolsforTools',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SIP Calculator Online — Mutual Fund Return & Step-Up SIP Wealth Planner | ToolsforTools',
    description: 'Calculate returns on your monthly SIP mutual fund investments with compounding growth charts, inflation adjustment, and step-up SIP wealth projections.',
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
