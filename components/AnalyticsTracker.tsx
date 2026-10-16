'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function AnalyticsTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname) return;

    let toolName = 'Home Page';
    if (pathname.includes('image-compressor')) toolName = 'Target KB Compressor';
    else if (pathname.includes('photopea-editor')) toolName = 'Photopea Studio';
    else if (pathname.includes('merge-pdf')) toolName = 'Merge PDF';
    else if (pathname.includes('compress-pdf')) toolName = 'Compress PDF';
    else if (pathname.includes('sip-calculator')) toolName = 'SIP Calculator';
    else if (pathname.includes('qr-generator')) toolName = 'QR Generator';
    else if (pathname.includes('image-converter')) toolName = 'Image Converter';
    else if (pathname.includes('image-resizer')) toolName = 'Image Resizer';
    else if (pathname.includes('word-counter')) toolName = 'Word Counter';
    else if (pathname === '/about') toolName = 'About Us';
    else if (pathname === '/contact') toolName = 'Contact';

    const track = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
        await fetch(`${apiUrl}/api/analytics/track`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            tool: toolName,
            path: pathname,
            action: 'page_view',
          }),
        });
      } catch (err) {
        // Silent fail
      }
    };
    
    track();
  }, [pathname]);

  return null;
}
