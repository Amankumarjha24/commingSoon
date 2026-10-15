"use client";

import React, { useState } from 'react';
import { CartoonCharacter } from '../types';
import { sound } from '../utils/audio';
import styles from './CartoonCharacters.module.css';

interface CartoonCharacterProps {
  character: CartoonCharacter;
  size?: 'sm' | 'md' | 'lg';
  interactive?: boolean;
  celebrating?: boolean;
  speechText?: string;
  onClick?: () => void;
}

export const CartoonCharacterDisplay: React.FC<CartoonCharacterProps> = ({
  character,
  size = 'md',
  interactive = true,
  celebrating = false,
  speechText,
  onClick,
}) => {
  const [isWiggling, setIsWiggling] = useState(false);
  const [bubbleText, setBubbleText] = useState<string | null>(speechText || null);

  const sizeClasses = {
    sm: styles.sizeSm,
    md: styles.sizeMd,
    lg: styles.sizeLg,
  };

  const phrases: Record<CartoonCharacter, string[]> = {
    bear: [
      "Let's eat big cake! 🎂",
      "Happy Birthday superstar! ⭐",
      "Bear hugs incoming! 🐻💛",
      "Make a giant wish! ✨",
    ],
    dino: [
      "Rawr means Happy Birthday! 🦖",
      "You are DINO-mite! 💥",
      "Best party ever! 🎈",
      "Stomp stomp hooray! 🥳",
    ],
    unicorn: [
      "Sprinkles of magic! 🦄✨",
      "May all your dreams come true! 🌈",
      "Sparkle bright today! 💖",
      "You are magical! 🌟",
    ],
    bunny: [
      "Hop hop hurray! 🐰",
      "Carrots and cupcakes for you! 🥕🧁",
      "Sending lots of fluffy love! 🌸",
      "Have the sweetest day ever! 💕",
    ],
  };

  const handleCharacterTap = () => {
    sound.playBoing();
    setIsWiggling(true);
    setTimeout(() => setIsWiggling(false), 800);

    const list = phrases[character];
    const randomPhrase = list[Math.floor(Math.random() * list.length)];
    setBubbleText(randomPhrase);

    if (onClick) onClick();
  };

  return (
    <div className={styles.container}>
      {/* Cartoon Speech Bubble */}
      {(bubbleText || speechText) && (
        <div className={styles.speechBubble}>
          {bubbleText || speechText}
          <div className={styles.triangleOuter} />
          <div className={styles.triangleInner} />
        </div>
      )}

      {/* SVG Cartoon Mascot */}
      <div
        onClick={interactive ? handleCharacterTap : undefined}
        className={`${styles.characterWrapper} ${sizeClasses[size]} ${
          interactive ? styles.interactive : ''
        } ${isWiggling || celebrating ? styles.bounce : styles.float}`}
      >
        {character === 'bear' && (
          <svg viewBox="0 0 200 200" className={styles.svgIcon}>
            {/* Bear Ears */}
            <circle cx="55" cy="65" r="28" fill="#d97706" />
            <circle cx="55" cy="65" r="16" fill="#fcd34d" />
            <circle cx="145" cy="65" r="28" fill="#d97706" />
            <circle cx="145" cy="65" r="16" fill="#fcd34d" />
            {/* Party Cone Hat */}
            <polygon points="100,20 80,75 120,75" fill="#ec4899" />
            <circle cx="100" cy="18" r="8" fill="#fbbf24" />
            {/* Stripes on Hat */}
            <line x1="88" y1="52" x2="112" y2="52" stroke="#fcd34d" strokeWidth="4" strokeLinecap="round" />
            <line x1="93" y1="36" x2="107" y2="36" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" />
            {/* Bear Head */}
            <circle cx="100" cy="115" r="62" fill="#b45309" />
            {/* Cheeks */}
            <circle cx="65" cy="125" r="12" fill="#f87171" opacity="0.6" />
            <circle cx="135" cy="125" r="12" fill="#f87171" opacity="0.6" />
            {/* Snout */}
            <ellipse cx="100" cy="130" rx="26" ry="20" fill="#fde68a" />
            <ellipse cx="100" cy="122" rx="10" ry="7" fill="#451a03" />
            <path d="M 100 128 Q 100 138 92 140" stroke="#451a03" strokeWidth="3" fill="none" strokeLinecap="round" />
            <path d="M 100 128 Q 100 138 108 140" stroke="#451a03" strokeWidth="3" fill="none" strokeLinecap="round" />
            {/* Big Sparkly Eyes */}
            <circle cx="78" cy="105" r="8" fill="#1f2937" />
            <circle cx="75" cy="102" r="3" fill="#ffffff" />
            <circle cx="122" cy="105" r="8" fill="#1f2937" />
            <circle cx="119" cy="102" r="3" fill="#ffffff" />
            {/* Waving Paw */}
            <circle cx="160" cy="150" r="16" fill="#d97706" className={styles.spinSlow} />
          </svg>
        )}

        {character === 'dino' && (
          <svg viewBox="0 0 200 200" className={styles.svgIcon}>
            {/* Dino Spikes */}
            <polygon points="65,70 50,55 70,55" fill="#fbbf24" />
            <polygon points="55,95 38,82 58,82" fill="#fbbf24" />
            <polygon points="48,125 30,115 50,115" fill="#fbbf24" />
            {/* Dino Body & Head */}
            <path
              d="M 60 140 C 60 85 90 60 135 60 C 165 60 180 80 175 105 C 170 125 150 130 140 130 C 130 160 110 170 80 170 C 65 170 60 155 60 140 Z"
              fill="#10b981"
            />
            {/* Dino Belly */}
            <path
              d="M 90 120 C 100 115 130 120 130 140 C 130 160 110 165 90 165 Z"
              fill="#a7f3d0"
            />
            {/* Party Hat */}
            <polygon points="145,25 130,62 165,62" fill="#8b5cf6" />
            <circle cx="145" cy="22" r="7" fill="#f43f5e" />
            <circle cx="140" cy="45" r="3" fill="#ffffff" />
            <circle cx="152" cy="52" r="3" fill="#fde047" />
            {/* Cheerful Eye */}
            <circle cx="148" cy="85" r="9" fill="#0f172a" />
            <circle cx="145" cy="82" r="3.5" fill="#ffffff" />
            {/* Blush */}
            <ellipse cx="140" cy="98" rx="8" ry="5" fill="#f43f5e" opacity="0.6" />
            {/* Happy Smile & Teeth */}
            <path d="M 160 105 Q 150 118 138 108" stroke="#064e3b" strokeWidth="3" fill="none" strokeLinecap="round" />
            <polygon points="148,106 152,112 155,106" fill="#ffffff" />
            {/* Tiny Party Streamer in hand */}
            <ellipse cx="115" cy="135" rx="10" ry="7" fill="#059669" />
          </svg>
        )}

        {character === 'unicorn' && (
          <svg viewBox="0 0 200 200" className={styles.svgIcon}>
            {/* Golden Twinkling Horn */}
            <polygon points="100,15 86,65 114,65" fill="#fbbf24" />
            <line x1="93" y1="30" x2="107" y2="35" stroke="#f59e0b" strokeWidth="2" />
            <line x1="90" y1="45" x2="110" y2="50" stroke="#f59e0b" strokeWidth="2" />
            <circle cx="100" cy="14" r="5" fill="#fffbeb" className={styles.ping} />
            {/* Ears */}
            <polygon points="68,55 58,25 82,45" fill="#fbcfe8" />
            <polygon points="132,55 142,25 118,45" fill="#fbcfe8" />
            {/* Rainbow Mane */}
            <path d="M 60 70 Q 40 90 55 120 Q 45 140 65 150" stroke="#ec4899" strokeWidth="10" fill="none" strokeLinecap="round" />
            <path d="M 70 65 Q 50 85 65 115" stroke="#8b5cf6" strokeWidth="8" fill="none" strokeLinecap="round" />
            <path d="M 80 60 Q 60 80 75 105" stroke="#38bdf8" strokeWidth="6" fill="none" strokeLinecap="round" />
            {/* Head */}
            <ellipse cx="100" cy="105" rx="46" ry="42" fill="#ffffff" />
            <ellipse cx="100" cy="125" rx="30" ry="20" fill="#fdf2f8" />
            {/* Cute Nostrils */}
            <circle cx="94" cy="125" r="2.5" fill="#f472b6" />
            <circle cx="106" cy="125" r="2.5" fill="#f472b6" />
            {/* Blushing Cheeks */}
            <ellipse cx="72" cy="112" rx="9" ry="6" fill="#f43f5e" opacity="0.4" />
            <ellipse cx="128" cy="112" rx="9" ry="6" fill="#f43f5e" opacity="0.4" />
            {/* Happy Closed Sleeping/Smiling Eyes with Lashes */}
            <path d="M 76 96 Q 84 104 92 96" stroke="#4c1d95" strokeWidth="3" fill="none" strokeLinecap="round" />
            <line x1="84" y1="102" x2="84" y2="107" stroke="#4c1d95" strokeWidth="2" strokeLinecap="round" />
            <path d="M 108 96 Q 116 104 124 96" stroke="#4c1d95" strokeWidth="3" fill="none" strokeLinecap="round" />
            <line x1="116" y1="102" x2="116" y2="107" stroke="#4c1d95" strokeWidth="2" strokeLinecap="round" />
          </svg>
        )}

        {character === 'bunny' && (
          <svg viewBox="0 0 200 200" className={styles.svgIcon}>
            {/* Long Floppy Ears */}
            <ellipse cx="70" cy="45" rx="14" ry="40" fill="#ffffff" transform="rotate(-15 70 45)" />
            <ellipse cx="70" cy="45" rx="8" ry="30" fill="#fbcfe8" transform="rotate(-15 70 45)" />
            <ellipse cx="130" cy="45" rx="14" ry="40" fill="#ffffff" transform="rotate(15 130 45)" />
            <ellipse cx="130" cy="45" rx="8" ry="30" fill="#fbcfe8" transform="rotate(15 130 45)" />
            {/* Red Strawberry Party Bow on left ear */}
            <circle cx="68" cy="80" r="10" fill="#ef4444" />
            <polygon points="56,75 56,85 68,80" fill="#ef4444" />
            <polygon points="80,75 80,85 68,80" fill="#ef4444" />
            <circle cx="68" cy="80" r="4" fill="#fbbf24" />
            {/* Bunny Head */}
            <ellipse cx="100" cy="115" rx="50" ry="44" fill="#ffffff" />
            {/* Cheeks */}
            <circle cx="68" cy="120" r="10" fill="#f43f5e" opacity="0.45" />
            <circle cx="132" cy="120" r="10" fill="#f43f5e" opacity="0.45" />
            {/* Eyes */}
            <ellipse cx="80" cy="105" rx="7" ry="9" fill="#1e1b4b" />
            <circle cx="78" cy="102" r="3" fill="#ffffff" />
            <ellipse cx="120" cy="105" rx="7" ry="9" fill="#1e1b4b" />
            <circle cx="118" cy="102" r="3" fill="#ffffff" />
            {/* Nose & Mouth */}
            <polygon points="96,118 104,118 100,123" fill="#f472b6" />
            <path d="M 100 123 Q 95 130 90 128" stroke="#831843" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            <path d="M 100 123 Q 105 130 110 128" stroke="#831843" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            {/* Whiskers */}
            <line x1="55" y1="118" x2="35" y2="114" stroke="#d1d5db" strokeWidth="2" strokeLinecap="round" />
            <line x1="55" y1="124" x2="35" y2="128" stroke="#d1d5db" strokeWidth="2" strokeLinecap="round" />
            <line x1="145" y1="118" x2="165" y2="114" stroke="#d1d5db" strokeWidth="2" strokeLinecap="round" />
            <line x1="145" y1="124" x2="165" y2="128" stroke="#d1d5db" strokeWidth="2" strokeLinecap="round" />
            {/* Holding Cupcake */}
            <ellipse cx="100" cy="155" rx="14" ry="12" fill="#fbbf24" />
            <circle cx="100" cy="146" r="5" fill="#ef4444" />
          </svg>
        )}
      </div>

      {interactive && (
        <span className={styles.tapText}>
          Tap me! ✨
        </span>
      )}
    </div>
  );
};
