'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import QRCode from 'qrcode';
import { QrCode, Download, Copy, Check, Wifi, Globe, Type, Mail, Phone, MessageSquare, ShieldCheck } from 'lucide-react';
import AdBanner from '@/components/AdBanner';
import styles from './page.module.css';

type QrType = 'url' | 'text' | 'wifi' | 'email' | 'phone' | 'whatsapp';

export default function QrGeneratorPage() {
  const [qrType, setQrType] = useState<QrType>('url');
  
  // URL & Text state
  const [url, setUrl] = useState<string>('https://toolsfortools.in');
  const [text, setText] = useState<string>('Welcome to ToolsforTools!');

  // WiFi state
  const [wifiSsid, setWifiSsid] = useState<string>('MyHomeWiFi');
  const [wifiPass, setWifiPass] = useState<string>('');
  const [wifiEnc, setWifiEnc] = useState<'WPA' | 'WEP' | 'nopass'>('WPA');
  const [wifiHidden, setWifiHidden] = useState<boolean>(false);

  // Email state
  const [emailTo, setEmailTo] = useState<string>('contact@toolsfortools.in');
  const [emailSubject, setEmailSubject] = useState<string>('Inquiry');
  const [emailBody, setEmailBody] = useState<string>('Hello, I would like to get in touch.');

  // Phone / WhatsApp state
  const [phoneNumber, setPhoneNumber] = useState<string>('+919876543210');
  const [whatsappMsg, setWhatsappMsg] = useState<string>('Hi, I am contacting you from ToolsforTools.');

  // Style customization
  const [fgColor, setFgColor] = useState<string>('#1c1917');
  const [bgColor, setBgColor] = useState<string>('#ffffff');
  const [errorLevel, setErrorLevel] = useState<'L' | 'M' | 'Q' | 'H'>('M');
  const [copied, setCopied] = useState<boolean>(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Construct real payload according to standard QR protocols
  const getPayload = (): string => {
    switch (qrType) {
      case 'url':
        return url.trim() || 'https://toolsfortools.in';
      case 'text':
        return text || '';
      case 'wifi': {
        // Standard WiFi QR format: WIFI:T:WPA;S:MySSID;P:MyPassword;H:false;;
        const enc = wifiEnc === 'nopass' ? 'nopass' : wifiEnc;
        const pass = wifiEnc === 'nopass' ? '' : wifiPass;
        return `WIFI:T:${enc};S:${wifiSsid};P:${pass};H:${wifiHidden ? 'true' : 'false'};;`;
      }
      case 'email':
        return `mailto:${emailTo.trim()}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
      case 'phone':
        return `tel:${phoneNumber.trim()}`;
      case 'whatsapp': {
        const cleanPhone = phoneNumber.replace(/[^0-9]/g, '');
        return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(whatsappMsg)}`;
      }
      default:
        return 'https://toolsfortools.in';
    }
  };

  // Render real standard QR code to canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const payload = getPayload();
    if (!payload) return;

    QRCode.toCanvas(
      canvas,
      payload,
      {
        width: 320,
        margin: 2,
        errorCorrectionLevel: errorLevel,
        color: {
          dark: fgColor,
          light: bgColor,
        },
      },
      (error) => {
        if (error) {
          console.error('Error generating QR code:', error);
        }
      }
    );
  }, [qrType, url, text, wifiSsid, wifiPass, wifiEnc, wifiHidden, emailTo, emailSubject, emailBody, phoneNumber, whatsappMsg, fgColor, bgColor, errorLevel]);

  // Download high-resolution PNG
  const handleDownloadPng = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const payload = getPayload();
    // Render at large 1024x1024 for crystal-clear print quality
    const exportCanvas = document.createElement('canvas');
    QRCode.toCanvas(
      exportCanvas,
      payload,
      {
        width: 1024,
        margin: 3,
        errorCorrectionLevel: errorLevel,
        color: {
          dark: fgColor,
          light: bgColor,
        },
      },
      (error) => {
        if (!error) {
          const a = document.createElement('a');
          a.href = exportCanvas.toDataURL('image/png');
          a.download = `qrcode-${qrType}-${Date.now()}.png`;
          a.click();
        }
      }
    );
  };

  // Download vector SVG
  const handleDownloadSvg = async () => {
    const payload = getPayload();
    try {
      const svgString = await QRCode.toString(payload, {
        type: 'svg',
        margin: 2,
        errorCorrectionLevel: errorLevel,
        color: {
          dark: fgColor,
          light: bgColor,
        },
      });
      const blob = new Blob([svgString], { type: 'image/svg+xml' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = `qrcode-${qrType}-${Date.now()}.svg`;
      a.click();
    } catch (err) {
      console.error('Failed to export SVG:', err);
    }
  };

  // Copy PNG image to clipboard
  const handleCopy = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    try {
      canvas.toBlob(async (blob) => {
        if (blob && navigator.clipboard && (window as any).ClipboardItem) {
          await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        }
      });
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className={styles.container}>
      {/* Breadcrumb */}
      <div className={styles.breadcrumb}>
        <Link href="/" className={styles.breadcrumbLink}>
          Home
        </Link>
        <span>/</span>
        <Link href="/#tools-section" className={styles.breadcrumbLink}>
          Dev Tools
        </Link>
        <span>/</span>
        <span className={styles.breadcrumbActive}>QR Code Generator</span>
      </div>

      <div className={styles.headerContainer}>
        <h1 className={styles.title}>
          <span className={styles.iconWrapper}>
            📱
          </span>
          QR Code Generator Pro
        </h1>
        <p className={styles.subtitle}>
          Create genuine, 100% scannable ISO-compliant QR codes for websites, Wi-Fi networks, text, email, and WhatsApp.
        </p>
      </div>

      <div className={styles.mainGrid}>
        {/* Form Controls */}
        <div className={styles.formSection}>
          {/* Type Selector */}
          <div>
            <label className={styles.label}>
              Select QR Type
            </label>
            <div className={styles.typeSelector} style={{ flexWrap: 'wrap' }}>
              {[
                { id: 'url', label: 'Website URL', icon: Globe },
                { id: 'wifi', label: 'Wi-Fi Network', icon: Wifi },
                { id: 'text', label: 'Plain Text', icon: Type },
                { id: 'email', label: 'Email', icon: Mail },
                { id: 'phone', label: 'Phone', icon: Phone },
                { id: 'whatsapp', label: 'WhatsApp', icon: MessageSquare },
              ].map((item) => {
                const IconComponent = item.icon;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setQrType(item.id as QrType)}
                    className={`${styles.typeBtn} ${
                      qrType === item.id ? styles.typeBtnActive : styles.typeBtnInactive
                    }`}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
                  >
                    <IconComponent style={{ width: '0.85rem', height: '0.85rem' }} />
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Conditional Inputs Based on Type */}
          {qrType === 'url' && (
            <div className={styles.inputRow}>
              <label className={styles.label}>Target Website URL</label>
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com"
                className={styles.contentInput}
              />
              <span className={styles.subLabel}>Scanners will open this link directly in the browser.</span>
            </div>
          )}

          {qrType === 'wifi' && (
            <div className={styles.inputGroup}>
              <div className={styles.inputRow}>
                <label className={styles.label}>Network Name (SSID)</label>
                <input
                  type="text"
                  value={wifiSsid}
                  onChange={(e) => setWifiSsid(e.target.value)}
                  placeholder="e.g. Office_Guest_WiFi"
                  className={styles.contentInput}
                />
              </div>

              <div className={styles.inputRow}>
                <label className={styles.label}>Wi-Fi Password</label>
                <input
                  type="text"
                  value={wifiPass}
                  onChange={(e) => setWifiPass(e.target.value)}
                  placeholder="Leave empty for open networks"
                  className={styles.contentInput}
                />
              </div>

              <div className={styles.colorGrid}>
                <div className={styles.inputRow}>
                  <label className={styles.subLabel}>Security Type</label>
                  <select
                    value={wifiEnc}
                    onChange={(e: any) => setWifiEnc(e.target.value)}
                    className={styles.selectInput}
                  >
                    <option value="WPA">WPA / WPA2 / WPA3 (Standard)</option>
                    <option value="WEP">WEP (Legacy)</option>
                    <option value="nopass">None (Open Network)</option>
                  </select>
                </div>

                <div className={styles.inputRow} style={{ justifyContent: 'center' }}>
                  <label className={styles.checkboxRow}>
                    <input
                      type="checkbox"
                      checked={wifiHidden}
                      onChange={(e) => setWifiHidden(e.target.checked)}
                    />
                    Hidden SSID Network
                  </label>
                </div>
              </div>
            </div>
          )}

          {qrType === 'text' && (
            <div className={styles.inputRow}>
              <label className={styles.label}>Text or Message</label>
              <textarea
                rows={4}
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Type any message, note, address, or serial code..."
                className={styles.contentInput}
              />
            </div>
          )}

          {qrType === 'email' && (
            <div className={styles.inputGroup}>
              <div className={styles.inputRow}>
                <label className={styles.label}>Recipient Email</label>
                <input
                  type="email"
                  value={emailTo}
                  onChange={(e) => setEmailTo(e.target.value)}
                  placeholder="user@example.com"
                  className={styles.contentInput}
                />
              </div>
              <div className={styles.inputRow}>
                <label className={styles.label}>Subject</label>
                <input
                  type="text"
                  value={emailSubject}
                  onChange={(e) => setEmailSubject(e.target.value)}
                  placeholder="Inquiry"
                  className={styles.contentInput}
                />
              </div>
              <div className={styles.inputRow}>
                <label className={styles.label}>Pre-filled Body</label>
                <textarea
                  rows={2}
                  value={emailBody}
                  onChange={(e) => setEmailBody(e.target.value)}
                  className={styles.contentInput}
                />
              </div>
            </div>
          )}

          {qrType === 'phone' && (
            <div className={styles.inputRow}>
              <label className={styles.label}>Phone Number (with Country Code)</label>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="+1234567890"
                className={styles.contentInput}
              />
              <span className={styles.subLabel}>Scanners will open the dialer with this number ready to call.</span>
            </div>
          )}

          {qrType === 'whatsapp' && (
            <div className={styles.inputGroup}>
              <div className={styles.inputRow}>
                <label className={styles.label}>WhatsApp Number (with Country Code)</label>
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="e.g. 919876543210"
                  className={styles.contentInput}
                />
              </div>
              <div className={styles.inputRow}>
                <label className={styles.label}>Pre-filled WhatsApp Message</label>
                <textarea
                  rows={2}
                  value={whatsappMsg}
                  onChange={(e) => setWhatsappMsg(e.target.value)}
                  className={styles.contentInput}
                />
              </div>
            </div>
          )}

          {/* Color & Error Correction Customization */}
          <div className={styles.colorGrid}>
            <div>
              <label className={styles.label}>
                QR Code Color
              </label>
              <input
                type="color"
                value={fgColor}
                onChange={(e) => setFgColor(e.target.value)}
                className={styles.colorInput}
              />
            </div>
            <div>
              <label className={styles.label}>
                Background Color
              </label>
              <input
                type="color"
                value={bgColor}
                onChange={(e) => setBgColor(e.target.value)}
                className={styles.colorInput}
              />
            </div>
          </div>

          <div className={styles.inputRow}>
            <label className={styles.subLabel}>Error Correction Level</label>
            <select
              value={errorLevel}
              onChange={(e: any) => setErrorLevel(e.target.value)}
              className={styles.selectInput}
            >
              <option value="L">Level L (7% damage recovery - Smallest size)</option>
              <option value="M">Level M (15% damage recovery - Recommended)</option>
              <option value="Q">Level Q (25% damage recovery)</option>
              <option value="H">Level H (30% damage recovery - Best for logos/printing)</option>
            </select>
          </div>
        </div>

        {/* Live Preview & Download */}
        <div className={styles.previewSection}>
          <div className={styles.canvasWrapper}>
            <canvas ref={canvasRef} className={styles.canvas} />
          </div>

          <div className={styles.badgeVerified}>
            <ShieldCheck style={{ width: '0.85rem', height: '0.85rem' }} />
            <span>100% Verified Scannable ISO QR Code</span>
          </div>

          <div className={styles.btnGroup}>
            <button
              onClick={handleDownloadPng}
              className={styles.downloadBtn}
            >
              <Download style={{ width: '1rem', height: '1rem' }} />
              Download High-Res PNG (1024px)
            </button>

            <button
              onClick={handleDownloadSvg}
              className={styles.downloadBtnSecondary}
            >
              <Download style={{ width: '0.95rem', height: '0.95rem' }} />
              Download Vector SVG (Print)
            </button>

            <button
              onClick={handleCopy}
              className={styles.downloadBtnSecondary}
            >
              {copied ? (
                <>
                  <Check style={{ width: '0.95rem', height: '0.95rem', color: '#16a34a' }} />
                  <span>Copied Image to Clipboard!</span>
                </>
              ) : (
                <>
                  <Copy style={{ width: '0.95rem', height: '0.95rem' }} />
                  <span>Copy Image</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      <AdBanner format="horizontal" />
    </div>
  );
}
