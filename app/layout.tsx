import type { Metadata } from 'next';
import './globals.css';
import styles from './layout.module.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PrivacyTrustModal from '@/components/PrivacyTrustModal';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://toolsfortools.in';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Free Online PDF, Image & Utility Tools | ToolsforTools',
    template: '%s | ToolsforTools',
  },
  description:
    'Free online PDF, image, video and calculator tools. Merge PDFs, compress images to target KB sizes and more, with privacy-focused browser processing.',
  authors: [{ name: 'ToolsforTools Team' }],
  alternates: {
    canonical: '/',
  },
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon.png', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
    apple: '/apple-icon.png',
  },
  openGraph: {
    siteName: 'ToolsforTools',
    type: 'website',
    locale: 'en_US',
    url: siteUrl,
    title: 'Free Online PDF, Image & Utility Tools | ToolsforTools',
    description:
      'Free online PDF, image, video and calculator tools. 100% private in-browser processing.',
    images: [{ url: '/logo-light.png', width: 1504, height: 704, alt: 'ToolsforTools' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Online PDF, Image & Utility Tools | ToolsforTools',
    description:
      'Free online PDF, image, video and calculator tools. 100% private in-browser processing.',
    images: ['/logo-light.png'],
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Anti-FOUC Dark Mode Initializer */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var saved = localStorage.getItem('tft_theme');
                  var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  if (saved === 'dark' || (!saved && prefersDark)) {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                } catch(e) {}
              })();
            `,
          }}
        />
      </head>
      <body className={styles.body}>
        <Navbar />
        <main className={styles.main}>
          {children}
        </main>
        <Footer />
        <PrivacyTrustModal />
      </body>
    </html>
  );
}
