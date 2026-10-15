'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles, ArrowRight, Gift, Music } from 'lucide-react';
import styles from './FestivalPromoBanner.module.css';

export default function FestivalPromoBanner() {
  return (
    <div className={styles.bannerWrapper}>
      <Link href="/tools/festival-greetings" style={{ textDecoration: 'none' }}>
        <div className={styles.bannerCard}>
          {/* Left Content */}
          <div className={styles.leftContent}>
            <div className={styles.giftIconBox}>
              🎁
            </div>

            <div className={styles.textGroup}>
              <div className={styles.badgeRow}>
                <span className={styles.trendingBadge}>
                  <Sparkles style={{ width: '0.75rem', height: '0.75rem' }} />
                  Featured Viral Tool
                </span>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#ec4899' }}>
                  ★ 3D Gift Unboxing & Music
                </span>
              </div>

              <h2 className={styles.bannerTitle}>
                Create Interactive 3D Birthday & Festival Surprise Greetings
              </h2>

              <p className={styles.bannerDesc}>
                Surprise your loved ones with a 3D animated gift box, synthesised melodies & celebratory confetti. Generate a shareable WhatsApp short link in seconds!
              </p>

              <div className={styles.occasionsList}>
                <span className={styles.occasionChip}>🎂 Birthday</span>
                <span className={styles.occasionChip}>🪔 Diwali</span>
                <span className={styles.occasionChip}>🌙 Eid Mubarak</span>
                <span className={styles.occasionChip}>🎄 Christmas</span>
                <span className={styles.occasionChip}>🌈 Holi</span>
              </div>
            </div>
          </div>

          {/* Right CTA */}
          <div className={styles.rightCta}>
            <div className={styles.ctaBtn}>
              <span>Create Wish Now</span>
              <ArrowRight style={{ width: '1.1rem', height: '1.1rem' }} />
            </div>
            <span className={styles.ctaSubText}>
              Free • Instant Short Link • No App Needed
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
}
