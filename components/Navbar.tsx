'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './Navbar.module.css';

export default function Navbar() {
  const [isDark, setIsDark] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    // Check local storage or system preference
    const savedTheme = localStorage.getItem('tft_theme');
    if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark');
      setIsDark(true);
    } else {
      document.documentElement.classList.remove('dark');
      setIsDark(false);
    }

    // PWA Install Prompt Listener
    const handleBeforeInstall = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
  }, []);

  const toggleTheme = () => {
    if (isDark) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('tft_theme', 'light');
      setIsDark(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('tft_theme', 'dark');
      setIsDark(true);
    }
  };

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setDeferredPrompt(null);
      }
    } else {
      alert('PWA is ready. On mobile, tap "Share" -> "Add to Home Screen" to install.');
    }
  };

  const openPrivacyModal = () => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('open-privacy-modal'));
    }
  };

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        {/* Brand Logo with automatic Dark/Light switching */}
        <Link href="/" className={styles.brandLink} aria-label="ToolsforTools Home">
          <img
            src="/logo-light.png"
            alt="ToolsforTools"
            className={styles.logoLight}
            width={168}
            height={52}
          />
          <img
            src="/logo-dark.png"
            alt="ToolsforTools"
            className={styles.logoDark}
            width={168}
            height={52}
          />
        </Link>

        {/* Desktop Navigation Links */}
        <nav className={styles.desktopNav}>
          <Link
            href="/"
            className={styles.navLinkActive}
          >
            All Tools
          </Link>
          <a
            href="/#tools-section"
            className={styles.navLink}
          >
            Photo & Image
          </a>
          <a
            href="/#tools-section"
            className={styles.navLink}
          >
            PDF Tools
          </a>
          <a
            href="/#tools-section"
            className={styles.navLink}
          >
            Finance & SIP
          </a>
          <a
            href="/#tools-section"
            className={styles.navLink}
          >
            Dev & Text
          </a>
          <Link
            href="/blog"
            className={styles.navLink}
          >
            Blog
          </Link>
        </nav>

        {/* Right Actions: Privacy First + Theme Toggle + PWA Install */}
        <div className={styles.rightActions}>
          <button
            onClick={openPrivacyModal}
            className={styles.privacyBtn}
            title="Privacy First — How it works"
          >
            <span className={styles.privacyShield}>🛡️</span>
            <span className={styles.privacyText}>Privacy First</span>
          </button>

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle Theme"
            className={styles.themeToggle}
          >
            {isDark ? (
              <svg className={styles.themeIconDark} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="5" strokeWidth="2" />
                <path strokeWidth="2" d="M12 1v2m0 18v2M4.22 4.22l1.42 1.42m12.72 12.72l1.42 1.42M1 12h2m18 0h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
              </svg>
            ) : (
              <svg className={styles.themeIconLight} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
              </svg>
            )}
          </button>

          {/* PWA Install Button */}
          <button
            onClick={handleInstallClick}
            className={styles.installButton}
          >
            <svg className={styles.installIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Install App
          </button>

          {/* Mobile menu trigger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={styles.mobileMenuTrigger}
            aria-label="Toggle Navigation Menu"
          >
            <svg className={styles.menuIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className={styles.mobileDrawer}>
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className={styles.mobileNavLinkActive}
          >
            All Tools
          </Link>
          <a
            href="/#tools-section"
            onClick={() => setMobileMenuOpen(false)}
            className={styles.mobileNavLink}
          >
            Photo & Image Tools
          </a>
          <a
            href="/#tools-section"
            onClick={() => setMobileMenuOpen(false)}
            className={styles.mobileNavLink}
          >
            PDF Tools
          </a>
          <a
            href="/#tools-section"
            onClick={() => setMobileMenuOpen(false)}
            className={styles.mobileNavLink}
          >
            SIP & Finance
          </a>
          <a
            href="/#tools-section"
            onClick={() => setMobileMenuOpen(false)}
            className={styles.mobileNavLink}
          >
            Dev & Text
          </a>
          <Link
            href="/blog"
            onClick={() => setMobileMenuOpen(false)}
            className={styles.mobileNavLink}
          >
            📰 Tech Blog & Guides
          </Link>
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              openPrivacyModal();
            }}
            className={styles.mobilePrivacyBtn}
          >
            🛡️ Privacy First — How it works
          </button>
          <button
            onClick={handleInstallClick}
            className={styles.mobileInstallButton}
          >
            <svg className={styles.installIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Add to Home Screen
          </button>
        </div>
      )}
    </header>
  );
}
