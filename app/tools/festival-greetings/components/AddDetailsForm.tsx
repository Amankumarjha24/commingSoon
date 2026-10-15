"use client";

import React, { useState } from 'react';
import { BirthdayWish, BoxTheme, CartoonCharacter, SurpriseType, MusicTheme } from '../types';
import { CartoonCharacterDisplay } from './CartoonCharacters';
import { sound } from '../utils/audio';
import { Sparkles, Gift, Heart, Music, Cake, Ticket, Send, Wand2, Eye } from 'lucide-react';
import confetti from 'canvas-confetti';
import styles from './AddDetailsForm.module.css';

interface AddDetailsFormProps {
  onWishCreated: (wish: BirthdayWish) => void;
  onPreviewWish: (wishDraft: BirthdayWish) => void;
}

export const AddDetailsForm: React.FC<AddDetailsFormProps> = ({
  onWishCreated,
  onPreviewWish,
}) => {
  const [recipientName, setRecipientName] = useState('');
  const [senderName, setSenderName] = useState('');
  const [age, setAge] = useState('');
  const [occasion, setOccasion] = useState('Birthday');
  const [message, setMessage] = useState(
    'Wishing you the happiest, most magical celebration ever! May your day be packed with giant smiles, sweet surprises, and all your favorite things! 🎉'
  );
  const [character, setCharacter] = useState<CartoonCharacter>('bear');
  const [theme, setTheme] = useState<BoxTheme>('candy');
  const [surpriseType, setSurpriseType] = useState<SurpriseType>('cake');
  const [voucherText, setVoucherText] = useState('One Full Day of Pampering & All-You-Can-Eat Dessert! 🍦');
  const [musicTheme, setMusicTheme] = useState<MusicTheme>('cheerful');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const occasions = ['Birthday', 'Diwali', 'Eid', 'Christmas', 'Holi'];

  const characterOptions: Array<{ id: CartoonCharacter; name: string; emoji: string; desc: string }> = [
    { id: 'bear', name: 'Bumble Bear', emoji: '🐻', desc: 'Warm hugs & party hats' },
    { id: 'dino', name: 'Pip the Dino', emoji: '🦖', desc: 'Rawr-some high energy' },
    { id: 'unicorn', name: 'Sparky Unicorn', emoji: '🦄', desc: 'Glitter & pure magic' },
    { id: 'bunny', name: 'Mochi Bunny', emoji: '🐰', desc: 'Sweet treats & love' },
  ];

  const themeOptions: Array<{ id: BoxTheme; name: string; styleClass: string }> = [
    { id: 'candy', name: 'Sweet Candy', styleClass: styles.themeCandy },
    { id: 'gold', name: 'Royal Gold', styleClass: styles.themeGold },
    { id: 'cosmic', name: 'Cosmic Galaxy', styleClass: styles.themeCosmic },
    { id: 'neon', name: 'Neon Electric', styleClass: styles.themeNeon },
    { id: 'rainbow', name: 'Rainbow Fiesta', styleClass: styles.themeRainbow },
  ];

  const surpriseOptions: Array<{ id: SurpriseType; name: string; icon: React.ReactNode; desc: string }> = [
    { id: 'cake', name: 'Interactive Cake', icon: <Cake className={styles.surpriseIconColorCake} />, desc: 'Real blowable candles & smoke!' },
    { id: 'voucher', name: 'Gift Coupon', icon: <Ticket className={styles.surpriseIconColorVoucher} />, desc: 'Custom treat voucher card' },
    { id: 'letter', name: 'Secret Heart Letter', icon: <Heart className={styles.surpriseIconColorLetter} />, desc: 'Personal golden note' },
    { id: 'melody', name: 'Music Serenade', icon: <Music className={styles.surpriseIconColorMelody} />, desc: '8-bit background tune' },
  ];

  const quickMessages = [
    { label: '🌟 Epic Adventures', text: 'Another amazing milestone! May this time bring wild adventures, big laughs, and unstoppable happiness! 🚀🎈' },
    { label: '🎂 Sweet & Warm', text: `Happy ${occasion} to one of the most wonderful people on this planet! Hope your day is as sweet as you are! 🍰💖` },
    { label: '🥳 Party Legend', text: `Time to crank up the music and celebrate the absolute legend that you are! Happy ${occasion} superstar! 🎸🎊` },
    { label: '✨ Dream Big', text: 'May every wish granted! Keep shining bright, superstar! 💫✨' },
  ];

  const getDraftWish = (): BirthdayWish & { occasion?: string } => {
    const now = Date.now();
    return {
      id: 'preview-draft',
      recipientName: recipientName.trim() || 'Superstar',
      senderName: senderName.trim() || 'Your Friend',
      age: age.trim() || undefined,
      occasion,
      message,
      character,
      theme,
      surpriseType,
      voucherText,
      musicTheme,
      createdAt: now,
      expiresAt: now + 24 * 60 * 60 * 1000,
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipientName.trim()) {
      sound.playBoing();
      setErrorMessage(`Please provide the person's name!`);
      return;
    }

    setErrorMessage('');
    setIsSubmitting(true);
    sound.playPop(520);

    const payload = {
      recipientName: recipientName.trim(),
      senderName: senderName.trim() || 'A Secret Well-Wisher',
      age: age.trim() || undefined,
      occasion,
      message: message.trim(),
      character,
      theme,
      surpriseType,
      voucherText: voucherText.trim(),
      musicTheme,
    };

    try {
      const response = await fetch('http://localhost:5000/api/greetings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('Failed to create wish on server');
      }

      const data = await response.json();
      sound.playTada();
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#ff477e', '#ffd166', '#06d6a0', '#118ab2', '#8338ec'],
      });

      onWishCreated(data.wish);
    } catch (err: any) {
      console.warn('Server error, falling back to local client state:', err);
      const now = Date.now();
      const localWish: BirthdayWish & { occasion?: string } = {
        id: `local-${Date.now().toString(36)}`,
        recipientName: payload.recipientName,
        senderName: payload.senderName,
        age: payload.age,
        occasion: payload.occasion,
        message: payload.message,
        character: payload.character,
        theme: payload.theme,
        surpriseType: payload.surpriseType,
        voucherText: payload.voucherText,
        musicTheme: payload.musicTheme,
        createdAt: now,
        expiresAt: now + 24 * 60 * 60 * 1000,
      };
      sound.playTada();
      onWishCreated(localWish as BirthdayWish);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.heroBanner}>
        <div className={styles.heroBadge}>
          <Sparkles className={styles.heroIcon} />
          24-Hour Magical Creator
        </div>
        <h1 className={styles.heroTitle}>
          Craft a 3D Surprise! 🎁✨
        </h1>
        <p className={styles.heroSubtitle}>
          Add their details, pick a dancing mascot & 3D gift box, then get a magical WhatsApp web link valid for 24 hours!
        </p>
      </div>

      <form onSubmit={handleSubmit} className={styles.formCard}>
        {errorMessage && (
          <div className={styles.errorBanner}>
            ⚠️ {errorMessage}
          </div>
        )}

        {/* Section 1: Occasion */}
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <span className={styles.stepNumber}>1</span>
            What's the Occasion?
          </div>
          <select 
            value={occasion} 
            onChange={(e) => setOccasion(e.target.value)}
            className={styles.select}
          >
            {occasions.map(occ => (
              <option key={occ} value={occ}>{occ}</option>
            ))}
          </select>
        </div>

        {/* Section 2: Star & Sender Info */}
        <div className={styles.sectionBorder}>
          <div className={styles.sectionHeader}>
            <span className={styles.stepNumber}>2</span>
            Who is this celebration for?
          </div>

          <div className={styles.twoCols}>
            <div>
              <label className={styles.label}>
                Person's Name <span className={styles.requiredMark}>*</span>
              </label>
              <input
                type="text"
                required
                value={recipientName}
                onChange={(e) => setRecipientName(e.target.value)}
                placeholder="e.g. Leo, Maya, Sarah"
                className={styles.input}
              />
            </div>

            <div>
              <label className={styles.label}>
                Age / Milestone (Optional)
              </label>
              <input
                type="text"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                placeholder="e.g. 18, 25, Forever Young"
                className={styles.input}
              />
            </div>
          </div>

          <div>
            <label className={styles.label}>
              Your Name / Sender (From)
            </label>
            <input
              type="text"
              value={senderName}
              onChange={(e) => setSenderName(e.target.value)}
              placeholder="e.g. Maya & Friends, Mom & Dad, Alex"
              className={styles.input}
            />
          </div>
        </div>

        {/* Section 3: Cartoon Mascot Companion */}
        <div className={styles.sectionBorder}>
          <div className={styles.headerSpace}>
            <div className={styles.sectionHeader}>
              <span className={styles.stepNumber}>3</span>
              Pick a Cartoon Party Companion
            </div>
            <span className={styles.hintText}>Tap to test sound!</span>
          </div>

          <div className={styles.characterGrid}>
            {characterOptions.map((opt) => {
              const isSelected = character === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => {
                    sound.playBoing();
                    setCharacter(opt.id);
                  }}
                  className={isSelected ? styles.charBtnSelected : styles.charBtn}
                >
                  <div className={styles.charImg}>
                    <CartoonCharacterDisplay character={opt.id} size="sm" interactive={false} />
                  </div>
                  <span className={styles.charName}>{opt.name}</span>
                  <span className={styles.charDesc}>{opt.desc}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Section 4: 3D Gift Box Theme */}
        <div className={styles.sectionBorder}>
          <div className={styles.sectionHeader}>
            <span className={styles.stepNumber}>4</span>
            Choose 3D Three.js Gift Box Style
          </div>

          <div className={styles.themeGrid}>
            {themeOptions.map((t) => {
              const isSelected = theme === t.id;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => {
                    sound.playPop(480);
                    setTheme(t.id);
                  }}
                  className={`${isSelected ? styles.themeBtnSelected : styles.themeBtn} ${isSelected ? t.styleClass : ''}`}
                >
                  <Gift className={styles.themeIcon} />
                  {t.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Section 5: What is inside the gift? */}
        <div className={styles.sectionBorder}>
          <div className={styles.sectionHeader}>
            <span className={styles.stepNumber}>5</span>
            Surprise Inside the Box
          </div>

          <div className={styles.surpriseGrid}>
            {surpriseOptions.map((s) => {
              const isSelected = surpriseType === s.id;
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => {
                    sound.playPop(440);
                    setSurpriseType(s.id);
                  }}
                  className={isSelected ? styles.surpriseBtnSelected : styles.surpriseBtn}
                >
                  <div className={styles.surpriseIconWrap}>{s.icon}</div>
                  <span className={styles.surpriseName}>{s.name}</span>
                  <span className={styles.surpriseDesc}>{s.desc}</span>
                </button>
              );
            })}
          </div>

          {surpriseType === 'voucher' && (
            <div className={styles.voucherWrap}>
              <label className={styles.labelPink}>
                Custom Voucher Privilege / Promise:
              </label>
              <input
                type="text"
                value={voucherText}
                onChange={(e) => setVoucherText(e.target.value)}
                placeholder="e.g. Free Movie & Popcorn on Me!"
                className={styles.inputSmall}
              />
            </div>
          )}
        </div>

        {/* Section 6: Heartfelt Message */}
        <div className={styles.sectionBorder}>
          <div className={styles.headerSpace}>
            <div className={styles.sectionHeader}>
              <span className={styles.stepNumber}>6</span>
              Personal {occasion} Wish
            </div>
          </div>

          <div className={styles.inspirationWrap}>
            {quickMessages.map((qm, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  sound.playPop(560);
                  setMessage(qm.text);
                }}
                className={styles.inspirationBtn}
              >
                {qm.label}
              </button>
            ))}
          </div>

          <textarea
            rows={3}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className={styles.textarea}
          />
        </div>

        {/* Section 7: Music melody style */}
        <div className={styles.sectionBorder}>
          <div className={styles.sectionHeaderSmall}>
            <Music className={styles.musicIcon} />
            Background Melody Style:
          </div>
          <div className={styles.musicRow}>
            {[
              { id: 'cheerful', label: 'Bouncy Synth' },
              { id: 'musicbox', label: 'Music Box' },
              { id: 'party', label: 'Party Horn' },
            ].map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => {
                  sound.playPop(500);
                  setMusicTheme(m.id as MusicTheme);
                  sound.playBirthdaySong(m.id as MusicTheme);
                  setTimeout(() => sound.stopMelody(), 1400); 
                }}
                className={musicTheme === m.id ? styles.musicBtnSelected : styles.musicBtn}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>

        {/* Bottom Actions */}
        <div className={styles.actionsWrap}>
          <button
            type="button"
            onClick={() => onPreviewWish(getDraftWish() as BirthdayWish)}
            className={styles.previewBtn}
          >
            <Eye className={styles.previewIcon} />
            Preview 3D Experience
          </button>

          <button
            type="submit"
            disabled={isSubmitting}
            className={styles.submitBtn}
          >
            {isSubmitting ? (
              <>
                <Wand2 className={styles.spinIcon} />
                Conjuring Magic...
              </>
            ) : (
              <>
                <Send className={styles.submitIcon} />
                Generate 24h WhatsApp Magic Link 🪄
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
