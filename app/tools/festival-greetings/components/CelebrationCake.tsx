"use client";

import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { sound } from '../utils/audio';
import { Sparkles, Wind, RotateCcw } from 'lucide-react';
import styles from './CelebrationCake.module.css';

interface CelebrationCakeProps {
  recipientName: string;
  age?: string;
  onBlownOut?: () => void;
}

export const CelebrationCake: React.FC<CelebrationCakeProps> = ({
  recipientName,
  age,
  onBlownOut,
}) => {
  const [candlesLit, setCandlesLit] = useState(true);
  const [wishMade, setWishMade] = useState(false);

  const handleBlowCandles = () => {
    if (!candlesLit) return;
    setCandlesLit(false);
    setWishMade(true);

    sound.playBlowCandle();
    setTimeout(() => {
      sound.playTada();
      // Confetti fountain
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.65 },
        colors: ['#ff477e', '#ffd166', '#06d6a0', '#118ab2', '#ff9f1c'],
      });
      if (onBlownOut) onBlownOut();
    }, 450);
  };

  const handleRelight = () => {
    sound.playPop(520);
    setCandlesLit(true);
    setWishMade(false);
  };

  return (
    <div className={styles.container}>
      {/* Wish banner */}
      <div className={styles.bannerContainer}>
        {wishMade ? (
          <div className={styles.wishMadeBadge}>
            ✨ Wish made! May it come true, {recipientName}! ✨
          </div>
        ) : (
          <div className={styles.makeWishText}>
            <Sparkles className={styles.sparklesIcon} />
            Make a secret wish and blow the candles!
          </div>
        )}
      </div>

      {/* SVG Cartoon Cake */}
      <div
        onClick={candlesLit ? handleBlowCandles : undefined}
        className={styles.cakeContainer}
      >
        <svg viewBox="0 0 240 220" className={styles.cakeSvg}>
          {/* Cake Stand Base */}
          <ellipse cx="120" cy="205" rx="80" ry="12" fill="#334155" />
          <ellipse cx="120" cy="202" rx="76" ry="9" fill="#64748b" />
          <path d="M 110 185 L 110 200 L 130 200 L 130 185 Z" fill="#94a3b8" />
          <ellipse cx="120" cy="186" rx="90" ry="12" fill="#cbd5e1" />

          {/* Bottom Cake Layer */}
          <path
            d="M 45 140 C 45 130 195 130 195 140 L 195 180 C 195 195 45 195 45 180 Z"
            fill="#ec4899"
          />
          {/* Bottom Layer Frosting Drips */}
          <path
            d="M 45 140 
               Q 60 162 75 142 
               Q 90 165 105 143 
               Q 120 168 135 142 
               Q 150 164 165 143 
               Q 180 162 195 140 
               L 195 135 C 195 125 45 125 45 135 Z"
            fill="#fbcfe8"
          />

          {/* Rainbow Sprinkles on Bottom Tier */}
          <circle cx="70" cy="165" r="2.5" fill="#fde047" />
          <circle cx="100" cy="172" r="2.5" fill="#38bdf8" />
          <circle cx="130" cy="168" r="2.5" fill="#a7f3d0" />
          <circle cx="160" cy="174" r="2.5" fill="#f43f5e" />
          <circle cx="175" cy="160" r="2.5" fill="#fde047" />

          {/* Top Cake Layer */}
          <path
            d="M 68 95 C 68 85 172 85 172 95 L 172 135 C 172 145 68 145 68 135 Z"
            fill="#8b5cf6"
          />
          {/* Top Tier Frosting Drips */}
          <path
            d="M 68 95 
               Q 85 115 100 97 
               Q 115 118 130 96 
               Q 145 114 160 97 
               Q 170 110 172 95 
               L 172 90 C 172 80 68 80 68 90 Z"
            fill="#ddd6fe"
          />

          {/* Top Tier Sprinkles */}
          <circle cx="85" cy="120" r="2" fill="#fbbf24" />
          <circle cx="115" cy="125" r="2" fill="#f472b6" />
          <circle cx="145" cy="122" r="2" fill="#34d399" />

          {/* Decorative Cherries on Top Rim */}
          <circle cx="75" cy="85" r="5" fill="#ef4444" />
          <circle cx="120" cy="82" r="5" fill="#ef4444" />
          <circle cx="165" cy="85" r="5" fill="#ef4444" />

          {/* Center Age Number Badge or Star */}
          {age ? (
            <g>
              <circle cx="120" cy="132" r="14" fill="#fbbf24" stroke="#ffffff" strokeWidth="2" />
              <text
                x="120"
                y="137"
                textAnchor="middle"
                fill="#831843"
                fontFamily="Fredoka, sans-serif"
                fontSize="13"
                fontWeight="bold"
              >
                {age}
              </text>
            </g>
          ) : (
            <g>
              <polygon
                points="120,122 123,129 130,129 124,133 126,140 120,136 114,140 116,133 110,129 117,129"
                fill="#fbbf24"
              />
            </g>
          )}

          {/* Candles (3 striped candles) */}
          {/* Candle 1 (Left) */}
          <rect x="92" y="55" width="7" height="30" rx="3" fill="#38bdf8" />
          <line x1="93" y1="62" x2="98" y2="65" stroke="#ffffff" strokeWidth="2" />
          <line x1="93" y1="72" x2="98" y2="75" stroke="#ffffff" strokeWidth="2" />
          <line x1="95.5" y1="55" x2="95.5" y2="50" stroke="#475569" strokeWidth="1.5" />

          {/* Candle 2 (Center - taller) */}
          <rect x="116.5" y="48" width="7" height="36" rx="3" fill="#f43f5e" />
          <line x1="117.5" y1="55" x2="122.5" y2="58" stroke="#ffffff" strokeWidth="2" />
          <line x1="117.5" y1="65" x2="122.5" y2="68" stroke="#ffffff" strokeWidth="2" />
          <line x1="120" y1="48" x2="120" y2="42" stroke="#475569" strokeWidth="1.5" />

          {/* Candle 3 (Right) */}
          <rect x="141" y="55" width="7" height="30" rx="3" fill="#a7f3d0" />
          <line x1="142" y1="62" x2="147" y2="65" stroke="#ffffff" strokeWidth="2" />
          <line x1="142" y1="72" x2="147" y2="75" stroke="#ffffff" strokeWidth="2" />
          <line x1="144.5" y1="55" x2="144.5" y2="50" stroke="#475569" strokeWidth="1.5" />

          {/* Candle Flames or Smoke */}
          {candlesLit ? (
            <g className={styles.flameGlow}>
              {/* Flame 1 */}
              <ellipse cx="95.5" cy="42" rx="4.5" ry="8" fill="#fbbf24" />
              <ellipse cx="95.5" cy="43" rx="2.5" ry="5" fill="#f97316" />
              <circle cx="95.5" cy="44" r="1.5" fill="#ffffff" />

              {/* Flame 2 */}
              <ellipse cx="120" cy="34" rx="5.5" ry="9" fill="#fbbf24" />
              <ellipse cx="120" cy="35" rx="3" ry="6" fill="#f97316" />
              <circle cx="120" cy="36" r="1.8" fill="#ffffff" />

              {/* Flame 3 */}
              <ellipse cx="144.5" cy="42" rx="4.5" ry="8" fill="#fbbf24" />
              <ellipse cx="144.5" cy="43" rx="2.5" ry="5" fill="#f97316" />
              <circle cx="144.5" cy="44" r="1.5" fill="#ffffff" />
            </g>
          ) : (
            <g className={styles.smokeFadeIn}>
              {/* Smoke puffs drifting up */}
              <path d="M 95.5 48 Q 92 40 98 32 Q 102 24 95 18" stroke="#cbd5e1" strokeWidth="2" fill="none" strokeLinecap="round" />
              <path d="M 120 40 Q 124 32 118 24 Q 114 16 122 10" stroke="#cbd5e1" strokeWidth="2.5" fill="none" strokeLinecap="round" />
              <path d="M 144.5 48 Q 148 40 142 32 Q 140 24 146 18" stroke="#cbd5e1" strokeWidth="2" fill="none" strokeLinecap="round" />
            </g>
          )}
        </svg>
      </div>

      {/* Action Button */}
      <div className={styles.buttonContainer}>
        {candlesLit ? (
          <button
            onClick={handleBlowCandles}
            className={styles.blowButton}
          >
            <Wind className={styles.windIcon} />
            Blow Candles! 🎂💨
          </button>
        ) : (
          <button
            onClick={handleRelight}
            className={styles.relightButton}
          >
            <RotateCcw className={styles.relightIcon} />
            Light Candles Again 🔥
          </button>
        )}
      </div>
    </div>
  );
};
