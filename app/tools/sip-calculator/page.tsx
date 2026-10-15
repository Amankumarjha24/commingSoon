'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import AdBanner from '@/components/AdBanner';
import styles from './page.module.css';

export default function SipCalculatorPage() {
  const [monthlyInvestment, setMonthlyInvestment] = useState<number>(10000);
  const [annualRate, setAnnualRate] = useState<number>(12);
  const [years, setYears] = useState<number>(15);

  // Calculations:
  // Formula: M = P * [ ( (1 + i)^n - 1 ) / i ] * (1 + i)
  const i = annualRate / 12 / 100;
  const n = years * 12;
  const totalInvested = monthlyInvestment * n;
  const futureValue =
    monthlyInvestment * ((Math.pow(1 + i, n) - 1) / i) * (1 + i);
  const totalReturns = futureValue - totalInvested;

  // Format INR Currency
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(Math.round(val));
  };

  // Generate milestone data for SVG visualization
  const points = [];
  const totalSteps = 10;
  for (let step = 0; step <= totalSteps; step++) {
    const yr = (years / totalSteps) * step;
    const months = yr * 12;
    const fVal =
      months === 0
        ? 0
        : monthlyInvestment * ((Math.pow(1 + i, months) - 1) / i) * (1 + i);
    points.push({ yr: Math.round(yr), fVal });
  }

  // Normalize points for SVG path
  const svgWidth = 500;
  const svgHeight = 200;
  const maxVal = futureValue || 1;
  const pathD = points
    .map((p, index) => {
      const x = (index / totalSteps) * svgWidth;
      const y = svgHeight - (p.fVal / maxVal) * (svgHeight - 20);
      return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
    })
    .join(' ');

  return (
    <div className={styles.container}>
      {/* Breadcrumb */}
      <div className={styles.breadcrumb}>
        <Link href="/" className={styles.breadcrumbLink}>
          Home
        </Link>
        <span>/</span>
        <Link href="/#tools-section" className={styles.breadcrumbLink}>
          Finance Tools
        </Link>
        <span>/</span>
        <span className={styles.breadcrumbActive}>SIP Calculator</span>
      </div>

      {/* Header */}
      <div className={styles.header}>
        <h1 className={styles.title}>
          <span className={styles.iconWrap}>
            📈
          </span>
          SIP Wealth & Compound Return Calculator
        </h1>
        <p className={styles.subtitle}>
          Calculate the power of compounding for Systematic Investment Plans (SIP) in mutual funds, index funds, and equity portfolios.
        </p>
      </div>

      <div className={styles.gridContainer}>
        {/* Left Form Column */}
        <div className={styles.leftCol}>
          {/* Monthly Investment */}
          <div>
            <div className={styles.inputHeader}>
              <label className={styles.inputLabel}>
                Monthly Investment
              </label>
              <div className={styles.inputValue}>
                ₹{monthlyInvestment.toLocaleString('en-IN')}
              </div>
            </div>
            <input
              type="range"
              min={500}
              max={150000}
              step={500}
              value={monthlyInvestment}
              onChange={(e) => setMonthlyInvestment(Number(e.target.value))}
              className={styles.rangeInput}
            />
            <div className={styles.rangeLabels}>
              <span>₹500</span>
              <span>₹1,50,000</span>
            </div>
          </div>

          {/* Expected Return Rate */}
          <div>
            <div className={styles.inputHeader}>
              <label className={styles.inputLabel}>
                Expected Annual Return Rate (CAGR)
              </label>
              <div className={styles.inputValue}>
                {annualRate}%
              </div>
            </div>
            <input
              type="range"
              min={1}
              max={30}
              step={0.5}
              value={annualRate}
              onChange={(e) => setAnnualRate(Number(e.target.value))}
              className={styles.rangeInput}
            />
            <div className={styles.rangeLabels}>
              <span>1%</span>
              <span>30%</span>
            </div>
          </div>

          {/* Time Horizon (Years) */}
          <div>
            <div className={styles.inputHeader}>
              <label className={styles.inputLabel}>
                Time Horizon
              </label>
              <div className={styles.inputValue}>
                {years} Years
              </div>
            </div>
            <input
              type="range"
              min={1}
              max={40}
              step={1}
              value={years}
              onChange={(e) => setYears(Number(e.target.value))}
              className={styles.rangeInput}
            />
            <div className={styles.rangeLabels}>
              <span>1 Yr</span>
              <span>40 Yrs</span>
            </div>
          </div>

          {/* Growth Curve SVG Visualization */}
          <div className={styles.chartSection}>
            <div className={styles.chartTitle}>
              Wealth Accumulation Trajectory
            </div>
            <div className={styles.chartContainer}>
              <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className={styles.svgChart}>
                <defs>
                  <linearGradient id="curveGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#f97316" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#f97316" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                <path
                  d={`${pathD} L ${svgWidth} ${svgHeight} L 0 ${svgHeight} Z`}
                  fill="url(#curveGradient)"
                />
                <path d={pathD} fill="none" stroke="#f97316" strokeWidth="3" strokeLinecap="round" />
              </svg>
            </div>
          </div>
        </div>

        {/* Right Summary Column */}
        <div className={styles.rightCol}>
          <div className={styles.summaryCard}>
            <h3 className={styles.summaryTitle}>
              Maturity Breakdown
            </h3>

            <div>
              <div className={styles.summaryLabel}>Total Invested Amount</div>
              <div className={styles.summaryValue}>
                {formatCurrency(totalInvested)}
              </div>
            </div>

            <div>
              <div className={styles.summaryLabel}>Estimated Returns (Wealth Gain)</div>
              <div className={styles.summaryValueGreen}>
                +{formatCurrency(totalReturns)}
              </div>
            </div>

            <div className={styles.totalSection}>
              <div className={styles.summaryLabel}>Expected Total Maturity Value</div>
              <div className={styles.totalValue}>
                {formatCurrency(futureValue)}
              </div>
            </div>

            {/* Proportion Bar */}
            <div className={styles.barSection}>
              <div className={styles.barContainer}>
                <div
                  style={{ width: `${(totalInvested / futureValue) * 100}%` }}
                  className={styles.barInvested}
                  title="Invested Amount"
                />
                <div
                  style={{ width: `${(totalReturns / futureValue) * 100}%` }}
                  className={styles.barReturns}
                  title="Estimated Gain"
                />
              </div>
              <div className={styles.barLabels}>
                <span className={styles.barLabelItem}>
                  <span className={styles.dotInvested} /> Invested (
                  {Math.round((totalInvested / futureValue) * 100)}%)
                </span>
                <span className={styles.barLabelItem}>
                  <span className={styles.dotReturns} /> Returns (
                  {Math.round((totalReturns / futureValue) * 100)}%)
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <AdBanner format="horizontal" />
    </div>
  );
}