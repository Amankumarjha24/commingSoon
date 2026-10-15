"use client";

import React, { useState, useEffect } from 'react';
import { BirthdayWish } from '../types';
import { ThreeGiftBox } from './ThreeGiftBox';
import { CartoonCharacterDisplay } from './CartoonCharacters';
import { CelebrationCake } from './CelebrationCake';
import { sound } from '../utils/audio';
import {
  Sparkles,
  Volume2,
  VolumeX,
  Clock,
  Send,
  Ticket,
  Heart,
  Music,
  PartyPopper,
  ArrowRight,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import styles from './RecipientExperience.module.css';

interface RecipientExperienceProps {
  wish: BirthdayWish;
  onRecreate?: () => void;
}

export const RecipientExperience: React.FC<RecipientExperienceProps> = ({
  wish,
  onRecreate,
}) => {
  const [phase, setPhase] = useState<'envelope' | '3d-box' | 'revealed'>('envelope');
  const [isMuted, setIsMuted] = useState(sound.getMuted());
  const [isUnboxing, setIsUnboxing] = useState(false);
  const [isExpired, setIsExpired] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ hours: 23, minutes: 59, seconds: 59 });
  const [cakeBlown, setCakeBlown] = useState(false);

  // Check 24-hour expiration
  useEffect(() => {
    const checkExpiration = () => {
      const now = Date.now();
      const remainingMs = wish.expiresAt - now;
      if (remainingMs <= 0) {
        setIsExpired(true);
      } else {
        const hours = Math.floor(remainingMs / (1000 * 60 * 60));
        const minutes = Math.floor((remainingMs % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((remainingMs % (1000 * 60)) / 1000);
        setTimeLeft({ hours, minutes, seconds });
      }
    };

    checkExpiration();
    const timer = setInterval(checkExpiration, 1000);
    return () => clearInterval(timer);
  }, [wish.expiresAt]);

  useEffect(() => {
    return () => {
      if (sound.stopMelody) {
        sound.stopMelody();
      }
    };
  }, []);

  const toggleSound = () => {
    const muted = sound.toggleMute();
    setIsMuted(muted);
    if (!muted) {
      sound.playPop(520);
      if (phase === 'revealed') {
        sound.playBirthdaySong(wish.musicTheme);
      }
    }
  };

  const triggerMassiveConfetti = () => {
    sound.playConfettiWhoosh();
    // 1. Left cannon
    confetti({
      particleCount: 70,
      angle: 60,
      spread: 60,
      origin: { x: 0, y: 0.7 },
      colors: ['#ff477e', '#ffd166', '#06d6a0', '#118ab2', '#8338ec'],
    });

    // 2. Right cannon
    confetti({
      particleCount: 70,
      angle: 120,
      spread: 60,
      origin: { x: 1, y: 0.7 },
      colors: ['#ff477e', '#ffd166', '#06d6a0', '#118ab2', '#8338ec'],
    });

    // 3. Central glitter blast
    setTimeout(() => {
      confetti({
        particleCount: 90,
        spread: 100,
        origin: { y: 0.5 },
        shapes: ['star', 'circle'],
        colors: ['#ffd700', '#ff007f', '#00f0ff', '#39ff14'],
      });
    }, 250);
  };

  const handleStartUnboxing = () => {
    if (isUnboxing) return;
    setIsUnboxing(true);
    sound.playBoing();

    // Trigger Three.js box lid launch and audio fanfare
    setTimeout(() => {
      triggerMassiveConfetti();
      sound.playTada();
      sound.playBirthdaySong(wish.musicTheme);

      // Smooth page transition to revealed celebration stage
      setTimeout(() => {
        setPhase('revealed');
      }, 1000);
    }, 600);
  };

  // Reply to sender via WhatsApp
  const handleReplyWhatsApp = () => {
    sound.playPop(550);
    const text = encodeURIComponent(
      `🎉 Thank you so much for the incredible 3D birthday surprise, ${wish.senderName}! I loved it so much! ❤️🎂✨`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  // If expired screen
  if (isExpired) {
    return (
      <div className={styles.expiredContainer}>
        <div className={styles.expiredCard}>
          <div className={styles.expiredIcon}>
            ⏳
          </div>
          <h2 className={styles.expiredTitle}>
            Party Link Expired!
          </h2>
          <p className={styles.expiredText}>
            This birthday surprise parcel was valid for 24 hours and the party clock has run out!
          </p>
          <div className={styles.expiredAction}>
            <button
              onClick={onRecreate}
              className={styles.expiredBtn}
            >
              Create a Fresh Birthday Surprise 🎁
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.mainContainer}>
      {/* Top Header Utility Bar */}
      <div className={styles.headerBar}>
        {/* 24h Expiration Badge */}
        <div className={styles.timerBadge}>
          <Clock className={styles.iconPulse} />
          <span>Active for: </span>
          <span className={styles.timerText}>
            {String(timeLeft.hours).padStart(2, '0')}:{String(timeLeft.minutes).padStart(2, '0')}:{String(timeLeft.seconds).padStart(2, '0')}
          </span>
        </div>

        {/* Sound Toggle */}
        <button
          onClick={toggleSound}
          className={styles.soundBtn}
          title={isMuted ? 'Unmute Birthday Tunes' : 'Mute Sound'}
        >
          {isMuted ? <VolumeX className={styles.iconMuted} /> : <Volume2 className={styles.iconUnmuted} />}
        </button>
      </div>

      {/* PHASE 1: Mystery Cartoon Invitation Envelope */}
      {phase === 'envelope' && (
        <div className={styles.phaseContainer}>
          {/* Cartoon Envelope Graphic */}
          <div className={styles.envelopeGraphic} onClick={() => { sound.playPop(520); setPhase('3d-box'); }}>
            <div className={styles.envelopeBody}>
              <div className={styles.envelopeHeader}>
                <span className={styles.envelopeIcon}>💌</span>
                <span className={styles.envelopeTag}>
                  SPECIAL DELIVERY
                </span>
              </div>

              <div className={styles.envelopeContent}>
                <div className={styles.envelopeTo}>To the Birthday Star:</div>
                <div className={styles.envelopeName}>
                  {wish.recipientName} {wish.age ? `(${wish.age})` : ''} 🎉
                </div>
                <div className={styles.envelopeFrom}>
                  With love from <span className={styles.envelopeSender}>{wish.senderName}</span>
                </div>
              </div>

              <div className={styles.envelopeFooter}>
                <span>✨ 3D Magic Parcel</span>
                <span className={styles.envelopeOpen}>Open <ArrowRight className={styles.iconArrow} /></span>
              </div>
            </div>

            {/* Pulsing seal */}
            <div className={styles.seal}>
              🎁
            </div>
          </div>

          {/* Mascot invitation preview */}
          <div className={styles.mascotPreview}>
            <CartoonCharacterDisplay
              character={wish.character}
              size="md"
              interactive={true}
              speechText={`Hey ${wish.recipientName}! Open your surprise! 🎈`}
            />
          </div>

          {/* Bouncy Call to Action Button */}
          <button
            onClick={() => {
              sound.playPop(520);
              setPhase('3d-box');
            }}
            className={styles.enterBtn}
          >
            <Sparkles className={styles.iconSparkles} />
            ENTER THE 3D SURPRISE! ✨
          </button>
        </div>
      )}

      {/* PHASE 2: Interactive 3D Three.js Gift Box & The Animated Button */}
      {phase === '3d-box' && (
        <div className={styles.phaseContainer}>
          {/* Header instructions */}
          <div className={styles.stageHeader}>
            <span className={styles.stageTag}>
              Interactive 3D Stage
            </span>
            <h2 className={styles.stageTitle}>
              {wish.recipientName}'s Birthday Box 🎈
            </h2>
            <p className={styles.stageDesc}>
              Drag to rotate box in 3D, or smash the button to unbox!
            </p>
          </div>

          {/* Three.js 3D Gift Box Stage */}
          <div className={styles.boxContainer}>
            <ThreeGiftBox
              theme={wish.theme}
              isOpened={isUnboxing}
              onBoxClick={handleStartUnboxing}
              interactive={!isUnboxing}
            />

            {/* Mascot cheering beside the box */}
            <div className={styles.boxMascot}>
              <CartoonCharacterDisplay
                character={wish.character}
                size="sm"
                interactive={true}
                celebrating={isUnboxing}
                speechText={isUnboxing ? "WHOOOSH! 🚀" : "Tap the box! 🎁"}
              />
            </div>
          </div>

          {/* THE BEST ANIMATED & BEST LOOKING BUTTON */}
          <div className={styles.unboxingBtnContainer}>
            <button
              onClick={handleStartUnboxing}
              disabled={isUnboxing}
              className={`${styles.unboxingBtn} ${
                isUnboxing
                  ? styles.unboxingBtnActive
                  : styles.unboxingBtnIdle
              }`}
            >
              {/* Shimmer light sweep */}
              {!isUnboxing && <div className={styles.shimmer} />}

              <div className={styles.btnContent}>
                <span className={styles.btnSparkle}>✨</span>
                <span>{isUnboxing ? 'UNBOXING MAGIC...' : '🎁 TAP TO UNBOX YOUR GIFT! 🎁'}</span>
                <span className={styles.btnSparkle}>✨</span>
              </div>

              <div className={styles.btnSubtext}>
                tap box or button • sound & confetti prepared
              </div>
            </button>
          </div>
        </div>
      )}

      {/* PHASE 3: The Grand Revealed Stage */}
      {phase === 'revealed' && (
        <div className={styles.phaseContainer}>
          {/* Big Celebration Title */}
          <div className={styles.revealedTitleBox}>
            <div className={styles.revealedBadge}>
              <PartyPopper className={styles.iconArrow} />
              HAPPY BIRTHDAY {wish.recipientName.toUpperCase()}!
            </div>
            <h1 className={styles.revealedTitle}>
              Hooray! Make a Wish! 🎂🌟
            </h1>
          </div>

          {/* Mascot in Celebration Mode */}
          <div className={styles.revealedMascot}>
            <CartoonCharacterDisplay
              character={wish.character}
              size="md"
              interactive={true}
              celebrating={true}
              speechText={`Happy Birthday ${wish.recipientName}! 🥳`}
            />
          </div>

          {/* Interactive Birthday Surprise Card */}
          <div className={styles.surpriseCard}>
            {/* Surprise Variant 1: Interactive Cake with blowable candles */}
            {wish.surpriseType === 'cake' && (
              <CelebrationCake
                recipientName={wish.recipientName}
                age={wish.age}
                onBlownOut={() => setCakeBlown(true)}
              />
            )}

            {/* Surprise Variant 2: Custom Gift Voucher */}
            {wish.surpriseType === 'voucher' && (
              <div className={styles.voucherBox}>
                <div className={styles.voucherIcon}>🎟️</div>
                <div className={styles.voucherBadge}>
                  <Ticket className={styles.iconArrow} /> OFFICIAL BIRTHDAY VOUCHER
                </div>
                <div className={styles.voucherText}>
                  "{wish.voucherText || 'Unlimited Birthday Hugs & Sweet Treats!'}"
                </div>
                <div className={styles.voucherDesc}>
                  Guaranteed & redeemable anytime with <span style={{fontWeight: 700, color: 'white'}}>{wish.senderName}</span>!
                </div>
              </div>
            )}

            {/* Surprise Variant 3: Secret Heart Letter */}
            {wish.surpriseType === 'letter' && (
              <div className={styles.letterBox}>
                <div className={styles.letterIconBox}>
                  <Heart style={{width: '1.5rem', height: '1.5rem', fill: '#fb7185', animation: 'pulse 2s infinite'}} />
                </div>
                <div className={styles.letterTitle}>
                  Golden Heart Letter
                </div>
                <div className={styles.letterText}>
                  "May your smile stay as radiant as the stars, and your heart be filled with love every single day!"
                </div>
              </div>
            )}

            {/* Surprise Variant 4: Music Serenade */}
            {wish.surpriseType === 'melody' && (
              <div className={styles.melodyBox}>
                <div className={styles.melodyIconBox}>
                  <Music style={{width: '1.5rem', height: '1.5rem', animation: 'spinSlow 3s linear infinite'}} />
                </div>
                <div className={styles.melodyTitle}>
                  Synthesized Birthday Serenade Playing 🎶
                </div>
                <div className={styles.melodyBars}>
                  {[12, 24, 18, 28, 14, 22, 16].map((h, i) => (
                    <div
                      key={i}
                      style={{ height: `${h}px` }}
                      className={styles.melodyBar}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Personal Heartfelt Message From Sender */}
            <div className={styles.messageBox}>
              <div className={styles.messageHeader}>
                <span>Personal Note from {wish.senderName}:</span>
                <span className={styles.messageTag}>❤️ Just for you</span>
              </div>
              <p className={styles.messageContent}>
                "{wish.message}"
              </p>
            </div>

            {/* Confetti blast button */}
            <div className={styles.actionsBox}>
              <button
                onClick={triggerMassiveConfetti}
                className={styles.confettiBtn}
              >
                <PartyPopper style={{width: '1rem', height: '1rem', color: '#fcd34d'}} />
                More Confetti! 🎊
              </button>

              <button
                onClick={handleReplyWhatsApp}
                className={styles.replyBtn}
              >
                <Send style={{width: '1rem', height: '1rem'}} />
                Reply "Thank You! ❤️"
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer Branding */}
      <div className={styles.footer}>
        Birthday Surprise 3D • 24-Hour Magical Wishing Engine ✨
      </div>
    </div>
  );
};