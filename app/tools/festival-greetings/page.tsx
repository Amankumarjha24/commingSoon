"use client";

import React, { useState, useEffect } from 'react';
import { BirthdayWish } from './types';
import { AddDetailsForm } from './components/AddDetailsForm';
import { ShareModal } from './components/ShareModal';
import { RecipientExperience } from './components/RecipientExperience';
import { DownloadModal } from './components/MobileFrameAndDownloadModal';
import { sound } from './utils/audio';
import {
  Sparkles,
  Smartphone,
  Download,
  PlusCircle,
  Gift,
  Eye,
  ArrowLeft,
  PartyPopper,
} from 'lucide-react';

import styles from './page.module.css';

export default function App() {
  const [currentWish, setCurrentWish] = useState<BirthdayWish | null>(null);
  const [view, setView] = useState<'create' | 'share' | 'recipient' | 'preview'>('create');
  const [isPhoneFrame, setIsPhoneFrame] = useState(false);
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [isLoadingWish, setIsLoadingWish] = useState(false);

  // Check URL parameters on mount to see if opened from a shared WhatsApp link
  useEffect(() => {
    const parseUrl = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const wishId = urlParams.get('w');
      const paramD = urlParams.get('d');
      const hash = window.location.hash;

      // Helper to decode Base64 URL payload
      const decodePayload = (encodedStr: string): BirthdayWish | null => {
        try {
          const rawJson = decodeURIComponent(escape(atob(decodeURIComponent(encodedStr))));
          const parsed = JSON.parse(rawJson);
          return {
            id: wishId || 'shared-wish',
            recipientName: parsed.r || 'Friend',
            senderName: parsed.s || 'Someone special',
            age: parsed.a,
            occasion: parsed.o || 'Birthday',
            message: parsed.m || 'Happy Birthday!',
            character: parsed.c || 'bear',
            theme: parsed.t || 'candy',
            surpriseType: parsed.st || 'cake',
            voucherText: parsed.v,
            musicTheme: parsed.mt || 'cheerful',
            createdAt: parsed.exp ? parsed.exp - 24 * 60 * 60 * 1000 : Date.now(),
            expiresAt: parsed.exp || Date.now() + 24 * 60 * 60 * 1000,
          };
        } catch (e) {
          console.warn('Failed to parse payload:', e);
          return null;
        }
      };

      // 1. Instant Client-Side Decode from URL hash or query param (Zero wait time!)
      let clientWish: BirthdayWish | null = null;
      if (hash && hash.includes('d=')) {
        const encodedStr = hash.split('d=')[1];
        if (encodedStr) {
          clientWish = decodePayload(encodedStr);
        }
      } else if (paramD) {
        clientWish = decodePayload(paramD);
      }

      if (clientWish) {
        setCurrentWish(clientWish);
        setView('recipient');
        // If it was an offline/local ID, we are already 100% loaded!
        if (!wishId || wishId.startsWith('local-')) {
          return;
        }
      }

      // 2. Try fetching from server API if wishId is present
      if (wishId && !wishId.startsWith('local-')) {
        if (!clientWish) {
          setIsLoadingWish(true);
        }
        try {
          const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://toolsfortoolsbackend.onrender.com';
          const res = await fetch(`${apiUrl}/api/greetings/${wishId}`, {
            signal: AbortSignal.timeout(8000),
          });
          if (res.ok) {
            const data = await res.json();
            if (data.wish) {
              setCurrentWish(data.wish);
              setView('recipient');
              return;
            }
          }
        } catch (err) {
          console.warn('Could not fetch from server:', err);
        } finally {
          setIsLoadingWish(false);
        }
      }
    };

    parseUrl();
  }, []);

  const handleWishCreated = (wish: BirthdayWish) => {
    setCurrentWish(wish);
    setView('share');
  };

  const handlePreviewWish = (draftWish: BirthdayWish) => {
    setCurrentWish(draftWish);
    setView('preview');
  };

  const loadDemoWish = () => {
    sound.playPop(520);
    const demo: BirthdayWish = {
      id: 'demo-sample',
      recipientName: 'Alex',
      senderName: 'Maya & The Crew',
      age: '21',
      message:
        'HAPPY BIRTHDAY ALEX! 🚀 May your day be packed with giant smiles, delicious cake, wild laughter, and memories you will cherish forever! You are pure sunshine! 🎂✨',
      character: 'dino',
      theme: 'rainbow',
      surpriseType: 'cake',
      voucherText: 'All-You-Can-Eat Pizza Party + Free Hugs Anytime!',
      musicTheme: 'cheerful',
      createdAt: Date.now(),
      expiresAt: Date.now() + 24 * 60 * 60 * 1000,
    };
    setCurrentWish(demo);
    setView('recipient');
  };

  return (
    <div className={styles.container}>
      {/* Background Cartoon Glow Accents */}
      <div className={styles.bgAccents}>
        <div className={styles.accent1} />
        <div className={styles.accent2} />
        <div className={styles.accent3} />
      </div>

      {/* Top Navbar */}
      <header className={styles.header}>
        {/* Brand */}
        <button
          onClick={() => {
            sound.playPop(480);
            setView('create');
          }}
          className={styles.brandButton}
        >
          <div className={styles.brandIconWrapper}>
            <div className={styles.brandIconInner}>
              🎂
            </div>
          </div>
          <div>
            <div className={styles.brandTitle}>
              <span>Birthday Spark 3D</span>
              <Sparkles className={styles.sparkleIcon} />
            </div>
            <div className={styles.brandSubtitle}>
              24-Hour WhatsApp Surprise
            </div>
          </div>
        </button>

        {/* Action Buttons */}
        <div className={styles.headerActions}>
          {/* Quick Demo Button */}
          {view === 'create' && (
            <button
              onClick={loadDemoWish}
              className={`${styles.actionBtn} ${styles.demoBtn}`}
              title="See a live example of the 3D unboxing experience"
            >
              <Gift className={styles.demoBtnIcon} />
              <span className={styles.btnTextHiddenSm}>Try Demo</span> Surprise
            </button>
          )}

          {/* New Wish button when in other views */}
          {view !== 'create' && (
            <button
              onClick={() => {
                sound.playPop(520);
                setView('create');
              }}
              className={`${styles.actionBtn} ${styles.newWishBtn}`}
            >
              <PlusCircle className={styles.newWishBtnIcon} />
              <span className={styles.btnTextHiddenSm}>New</span> Wish
            </button>
          )}

          {/* Phone Frame Simulator Toggle */}
          <button
            onClick={() => {
              sound.playPop(450);
              setIsPhoneFrame(!isPhoneFrame);
            }}
            className={`${styles.phoneToggleBtn} ${isPhoneFrame ? styles.phoneToggleBtnActive : ''}`}
            title="Toggle Smartphone Native App Simulator Frame"
          >
            <Smartphone className={styles.phoneToggleIcon} />
            <span className={styles.phoneToggleText}>{isPhoneFrame ? 'Full View' : 'App Mode'}</span>
          </button>

          {/* Download & Mobile App Link */}
          <button
            onClick={() => {
              sound.playPop(550);
              setShowDownloadModal(true);
            }}
            className={`${styles.downloadBtn} btn-cartoon-3d`}
          >
            <Download className={styles.downloadBtnIcon} />
            <span>Download App</span>
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className={styles.main}>
        {/* Preview Mode Banner */}
        {view === 'preview' && (
          <div className={styles.previewBanner}>
            <span className={styles.previewBannerText}>
              <Eye className={styles.previewBannerIcon} /> Preview Mode: Testing how the recipient experiences this!
            </span>
            <button
              onClick={() => setView('create')}
              className={styles.returnBtn}
            >
              <ArrowLeft className={styles.returnBtnIcon} /> Return to Editor
            </button>
          </div>
        )}

        {/* Smartphone Simulator Frame Wrapper */}
        <div className={`${styles.frameWrapper} ${isPhoneFrame ? styles.framePhone : styles.frameStandard}`}>
          {/* Phone Speaker & Dynamic Island if Phone Frame */}
          {isPhoneFrame && (
            <div className={styles.phoneNotchWrapper}>
              <div className={styles.phoneNotch}>
                <div className={styles.phoneCamera} />
                <div className={styles.phoneSensor} />
              </div>
            </div>
          )}

          {/* View Router */}
          <div className={styles.viewRouter}>
            {isLoadingWish && (
              <div className={styles.loadingState}>
                <Sparkles className={styles.loadingIcon} />
                Fetching your 3D Birthday Surprise...
              </div>
            )}

            {!isLoadingWish && view === 'create' && (
              <AddDetailsForm
                onWishCreated={handleWishCreated}
                onPreviewWish={handlePreviewWish}
              />
            )}

            {!isLoadingWish && view === 'share' && currentWish && (
              <ShareModal
                wish={currentWish}
                onOpenExperience={() => setView('recipient')}
                onBackToEdit={() => setView('create')}
              />
            )}

            {!isLoadingWish && (view === 'recipient' || view === 'preview') && currentWish && (
              <RecipientExperience
                wish={currentWish}
                onRecreate={() => setView('create')}
              />
            )}
          </div>

          {/* Phone Bottom Home Bar if Phone Frame */}
          {isPhoneFrame && (
            <div className={styles.phoneHomeBarWrapper}>
              <div className={styles.phoneHomeBar} />
            </div>
          )}
        </div>
      </main>

      {/* Download & Mobile App Modal */}
      <DownloadModal
        isOpen={showDownloadModal}
        onClose={() => setShowDownloadModal(false)}
      />

      {/* Minimal Footer */}
      <footer className={styles.footer}>
        Crafted with 3D Three.js & Confetti • Modern Animated 24h Birthday Surprise
      </footer>
    </div>
  );
}
