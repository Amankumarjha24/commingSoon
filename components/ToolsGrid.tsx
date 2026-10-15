'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { TOOLS, CATEGORIES, ToolCategory } from '@/lib/toolsRegistry';
import styles from './ToolsGrid.module.css';

export default function ToolsGrid() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredTools = TOOLS.filter((tool) => {
    const matchesCategory = selectedCategory === 'all' || tool.category === selectedCategory;
    const matchesSearch =
      tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.shortDesc.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <section id="tools-section" className={styles.section}>
      {/* Section Header */}
      <div className={styles.header}>
        <div>
          <div className={styles.subtitle}>
            Utility Suite
          </div>
          <h2 className={styles.title}>
            Curated Tools for Everyone
          </h2>
          <p className={styles.desc}>
            Choose a category or search for what you need. Zero setup, zero signup, 100% free.
          </p>
        </div>

        {/* Live Search Input */}
        <div className={styles.searchWrapper}>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tools (e.g. compress, pdf, sip)..."
            className={styles.searchInput}
          />
          <svg
            className={styles.searchIcon}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {/* Category Pills Navigation */}
      <div className={styles.categoriesNav}>
        {CATEGORIES.map((cat) => {
          const isActive = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`${styles.categoryBtn} ${isActive ? styles.categoryBtnActive : styles.categoryBtnInactive}`}
            >
              <span>{cat.icon}</span>
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tools Cards Grid */}
      {filteredTools.length === 0 ? (
        <div className={styles.noToolsContainer}>
          <div className={styles.noToolsIcon}>🔍</div>
          <h3 className={styles.noToolsTitle}>No tools found</h3>
          <p className={styles.noToolsDesc}>
            Try searching for something else or switch the category filter.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
            }}
            className={styles.resetBtn}
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className={styles.grid}>
          {filteredTools.map((tool) => (
            <Link
              key={tool.slug}
              href={`/tools/${tool.slug}`}
              className={styles.card}
            >
              <div>
                {/* Top Row: Icon + Badge */}
                <div className={styles.cardTopRow}>
                  {/* Note: tool.bgColor (e.g. 'bg-orange-500' or similar) from registry might still inject a tailwind class. 
                      Since we're stripping Tailwind classes, if tool.bgColor uses Tailwind, we should either map it or allow it. 
                      Assuming tool.bgColor is mapped via inline styles or we use a global class fallback for dark mode in module.css */}
                  <div
                    className={`${styles.cardIconWrapper} ${tool.bgColor}`}
                  >
                    {tool.icon}
                  </div>
                  {tool.badge && (
                    <span
                      className={`${styles.badge} ${
                        tool.badge === 'pro'
                          ? styles.badgePro
                          : tool.badge === 'trending'
                          ? styles.badgeTrending
                          : tool.badge === 'popular'
                          ? styles.badgePopular
                          : styles.badgeDefault
                      }`}
                    >
                      {tool.badge}
                    </span>
                  )}
                </div>

                {/* Title */}
                <h3 className={styles.cardTitle}>
                  {tool.name}
                </h3>

                {/* Description */}
                <p className={styles.cardDesc}>
                  {tool.description}
                </p>
              </div>

              {/* Bottom Row: Category indicator + Arrow Action */}
              <div className={styles.cardBottomRow}>
                <span className={styles.cardCategory}>
                  {tool.category}
                </span>
                <span className={styles.cardAction}>
                  Launch Tool <span className={styles.cardArrow}>→</span>
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
