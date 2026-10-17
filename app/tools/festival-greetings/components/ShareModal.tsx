"use client";

import React, { useState, useEffect } from 'react';
import { BirthdayWish } from '../types';
import { sound } from '../utils/audio';
import { Share2, Copy, Check, Clock, ExternalLink, QrCode, Sparkles, ArrowLeft } from 'lucide-react';
import confetti from 'canvas-confetti';
import styles from './ShareModal.module.css';

interface ShareModalProps {
  wish: BirthdayWish;
  onOpenExperience: () => void;
  onBackToEdit: () => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  wish,
  onOpenExperience,
  onBackToEdit,
}) => {
  const [copied, setCopied] = useState(false);
  const [timeLeft, setTimeLeft] = useState<{ hours: number; minutes: number; seconds: number }>({
    hours: 23,
    minutes: 59,
    seconds: 59,
  });
  const [showQr, setShowQr] = useState(false);

  // Helper to safely encode wish data into URL hash as universal offline/instant fallback
  const encodeWishPayload = (w: BirthdayWish): string => {
    const payload = {
      r: w.recipientName,
      s: w.senderName,
      a: w.age,
      o: w.occasion || 'Birthday',
      m: w.message,
      c: w.character,
      t: w.theme,
      st: w.surpriseType,
      v: w.voucherText,
      mt: w.musicTheme,
      exp: w.expiresAt || Date.now() + 24 * 60 * 60 * 1000,
    };
    try {
      const jsonStr = JSON.stringify(payload);
      return encodeURIComponent(btoa(unescape(encodeURIComponent(jsonStr))));
    } catch {
      return '';
    }
  };

  // Construct absolute shareable URL with SHORTLINK + HASH PAYLOAD format
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
  const hashPayload = encodeWishPayload(wish);
  const shareUrl = `${baseUrl}/tools/festival-greetings?w=${wish.id}${hashPayload ? `#d=${hashPayload}` : ''}`;

  const occasionTitle = wish.occasion || 'Birthday';
  const greetingEmoji =
    wish.occasion === 'Diwali' ? '🪔✨' :
    wish.occasion === 'Eid' ? '🌙✨' :
    wish.occasion === 'Christmas' ? '🎄🎅' :
    wish.occasion === 'Holi' ? '🎨🎉' : '🎂🎈';

  // WhatsApp formatted message
  const whatsappMessage = encodeURIComponent(
    `${greetingEmoji} Surprise! A special 3D ${occasionTitle} Gift has been crafted just for you, ${wish.recipientName}! ✨\n\n` +
    `🎁 Open your 3D gift box before it expires in 24 hours:\n` +
    `${shareUrl}\n\n` +
    `With love from ${wish.senderName} ❤️`
  );

  const whatsappUrl = `https://api.whatsapp.com/send?text=${whatsappMessage}`;

  // 24h Countdown Timer calculation
  useEffect(() => {
    const updateCountdown = () => {
      const now = Date.now();
      const remainingMs = Math.max(0, wish.expiresAt - now);

      const hours = Math.floor(remainingMs / (1000 * 60 * 60));
      const minutes = Math.floor((remainingMs % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((remainingMs % (1000 * 60)) / 1000);

      setTimeLeft({ hours, minutes, seconds });
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [wish.expiresAt]);

  const handleCopy = () => {
    sound.playPop(600);
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);

    confetti({
      particleCount: 30,
      spread: 45,
      origin: { y: 0.7 },
    });
  };

  const handleWhatsAppClick = () => {
    sound.playPop(520);
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className={styles.container}>
      <div className={styles.modal}>
        {/* Celebration Header */}
        <div className={styles.headerIconContainer}>
          <div className={styles.giftIconOuter}>
            <div className={styles.giftIconInner}>
              🎁
            </div>
          </div>
          <Sparkles className={styles.sparklesIcon} />
        </div>

        <div>
          <h2 className={styles.title}>
            Magic Birthday Gift is Ready! 🎉
          </h2>
          <p className={styles.subtitle}>
            Share this link with <span className={styles.recipientName}>{wish.recipientName}</span> on WhatsApp!
          </p>
        </div>

        {/* 24-Hour Expiration Live Ticker */}
        <div className={styles.countdownContainer}>
          <Clock className={styles.clockIcon} />
          <div className={styles.countdownText}>
            <span className={styles.validFor}>Valid for 24 hours: </span>
            <span className={styles.timeText}>
              {String(timeLeft.hours).padStart(2, '0')}:{String(timeLeft.minutes).padStart(2, '0')}:{String(timeLeft.seconds).padStart(2, '0')}
            </span>
          </div>
        </div>

        {/* Primary WhatsApp Action Button */}
        <button
          onClick={handleWhatsAppClick}
          className={styles.whatsappBtn}
        >
          <Share2 className={styles.shareIcon} />
          Share directly to WhatsApp 💬
        </button>

        {/* Copy Link Input Box */}
        <div className={styles.copyBoxWrapper}>
          <label className={styles.copyLabel}>
            Or copy magic web link:
          </label>
          <div className={styles.copyInputContainer}>
            <input
              type="text"
              readOnly
              value={shareUrl}
              className={styles.copyInput}
            />
            <button
              onClick={handleCopy}
              className={`${styles.copyBtn} ${copied ? styles.copyBtnCopied : styles.copyBtnNormal}`}
            >
              {copied ? (
                <>
                  <Check className={styles.copyBtnIcon} />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className={styles.copyBtnIcon} />
                  Copy Link
                </>
              )}
            </button>
          </div>
        </div>

        {/* Secondary Actions */}
        <div className={styles.secondaryActions}>
          <button
            onClick={() => setShowQr(!showQr)}
            className={styles.qrBtn}
          >
            <QrCode className={styles.qrIcon} />
            {showQr ? 'Hide QR Code' : 'Scan on Mobile QR'}
          </button>

          <button
            onClick={onOpenExperience}
            className={styles.openBtn}
          >
            <ExternalLink className={styles.btnIcon} />
            Open As Recipient 👀
          </button>
        </div>

        {/* QR Code generator box */}
        {showQr && (
          <div className={styles.qrContainer}>
            <img
              src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(shareUrl)}`}
              alt="Scan QR Code to open on phone"
              className={styles.qrImage}
              loading="lazy"
            />
            <p className={styles.qrText}>
              Scan with camera to open on phone 📱
            </p>
          </div>
        )}

        {/* Back to Edit */}
        <div className={styles.backContainer}>
          <button
            onClick={onBackToEdit}
            className={styles.backBtn}
          >
            <ArrowLeft className={styles.backIcon} />
            Edit details or create another surprise
          </button>
        </div>
      </div>
    </div>
  );
};
