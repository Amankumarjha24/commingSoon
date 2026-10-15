import React from 'react';
import styles from './loading.module.css';

export default function Loading() {
  return (
    <div className={styles.loadingContainer} aria-label="Loading ToolsforTools">
      <div className={styles.logoWrapper}>
        <img
          src="/logo-light.png"
          alt="ToolsforTools Loading"
          className={styles.logoLight}
          width={220}
          height={103}
        />
        <img
          src="/logo-dark.png"
          alt="ToolsforTools Loading"
          className={styles.logoDark}
          width={220}
          height={103}
        />
      </div>

      <div className={styles.spinnerRow}>
        <div className={styles.spinner} />
        <span className={styles.loadingText}>Loading utility...</span>
      </div>
    </div>
  );
}
