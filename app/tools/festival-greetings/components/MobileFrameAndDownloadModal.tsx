"use client";
import React, { useState, useEffect } from 'react';
import { Smartphone, Download, Check, X, ShieldCheck } from 'lucide-react';
import { sound } from '../utils/audio';
import styles from './MobileFrameAndDownloadModal.module.css';

interface DownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DownloadModal: React.FC<DownloadModalProps> = ({ isOpen, onClose }) => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  }, []);

  if (!isOpen) return null;

  const handleInstallPWA = async () => {
    sound.playPop(550);
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setInstalled(true);
      }
      setDeferredPrompt(null);
    } else {
      // Show guide
      alert(
        "📱 To install as a native-feeling mobile app:\n\n" +
        "• On Android / Chrome: Tap the three dots (⋮) -> 'Add to Home screen' or 'Install app'.\n" +
        "• On iOS / Safari: Tap the Share button (⎋) -> 'Add to Home Screen'.\n\n" +
        "It will launch full-screen with no browser address bar, exactly like a native app!"
      );
    }
  };

  const handleDownloadCodeZip = () => {
    sound.playPop(520);
    // Guide on exporting
    alert(
      "📦 Download & React Native Export Guide:\n\n" +
      "1. You can download the complete project files using the 'Export to ZIP' or 'Push to GitHub' buttons in the Google AI Studio project settings menu!\n" +
      "2. To wrap as an Android APK / iOS app, you can use React Native / Expo (`npx create-expo-app`) or Capacitor (`npx cap add android`).\n" +
      "3. All animations, Three.js 3D depth, and sound synthesizers are 100% modular and cross-platform ready!"
    );
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        {/* Close Button */}
        <button
          onClick={onClose}
          className={styles.closeButton}
        >
          <X className={styles.iconSmall} />
        </button>

        {/* Modal Header */}
        <div className={styles.header}>
          <div className={styles.iconGradientBorder}>
            <div className={styles.iconInner}>
              <Smartphone className={styles.iconMedium} />
            </div>
          </div>
          <div>
            <h3 className={styles.headerTitle}>
              Download & Mobile App Setup 📱
            </h3>
            <p className={styles.headerSubtitle}>
              Run as a standalone native app on Android & iOS
            </p>
          </div>
        </div>

        {/* Option 1: 1-Click Install PWA */}
        <div className={`${styles.optionCard} ${styles.optionCardPink}`}>
          <div className={styles.optionHeader}>
            <div>
              <div className={styles.optionTitle}>
                <span className={styles.optionNumberPink}>1</span>
                Direct Mobile App Install (Android / iOS)
              </div>
              <p className={styles.optionDesc}>
                Installs directly to your home screen with zero browser bars, full-screen native animations, and offline capability.
              </p>
            </div>
          </div>

          <button
            onClick={handleInstallPWA}
            className={styles.primaryBtn}
          >
            {installed ? (
              <>
                <Check className={`${styles.iconMini} ${styles.textEmerald300}`} />
                App Installed on Device!
              </>
            ) : (
              <>
                <Download className={styles.iconMini} />
                Install Mobile App Now 📲
              </>
            )}
          </button>
        </div>

        {/* Option 2: Export Source Code / React Native */}
        <div className={`${styles.optionCard} ${styles.optionCardPurple}`}>
          <div className={styles.optionTitle}>
            <span className={styles.optionNumberPurple}>2</span>
            Download Project Source Code (ZIP / React Native)
          </div>
          <p className={styles.optionDesc}>
            Export the complete code bundle to compile with React Native / Expo, Capacitor, or run on local development.
          </p>

          <button
            onClick={handleDownloadCodeZip}
            className={styles.secondaryBtn}
          >
            <Download className={`${styles.iconMini} ${styles.textAmber300}`} />
            Download Source / React Native Instructions
          </button>
        </div>

        {/* Feature Highlights */}
        <div className={styles.featuresGrid}>
          <div className={styles.featureItem}>
            <ShieldCheck className={`${styles.iconMini} ${styles.textEmerald400} ${styles.shrink0}`} />
            <span>24h Expiration Engine</span>
          </div>
          <div className={styles.featureItem}>
            <ShieldCheck className={`${styles.iconMini} ${styles.textPink400} ${styles.shrink0}`} />
            <span>Three.js 3D Graphics</span>
          </div>
          <div className={styles.featureItem}>
            <ShieldCheck className={`${styles.iconMini} ${styles.textAmber400} ${styles.shrink0}`} />
            <span>Direct WhatsApp Sharing</span>
          </div>
          <div className={styles.featureItem}>
            <ShieldCheck className={`${styles.iconMini} ${styles.textPurple400} ${styles.shrink0}`} />
            <span>Web Audio Synthesizer</span>
          </div>
        </div>
      </div>
    </div>
  );
};
