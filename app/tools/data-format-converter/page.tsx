'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { RefreshCw, Copy, Download, CheckCircle, ArrowRight } from 'lucide-react';
import AdBanner from '@/components/AdBanner';
import styles from './page.module.css';

const SAMPLE_JSON = `[
  { "id": 1, "name": "Aman Sharma", "role": "Fullstack Developer", "city": "Delhi" },
  { "id": 2, "name": "Sarah Connor", "role": "Cyber Security Lead", "city": "Los Angeles" },
  { "id": 3, "name": "Raj Patel", "role": "UI/UX Designer", "city": "Mumbai" }
]`;

export default function DataFormatConverterPage() {
  const [fromFormat, setFromFormat] = useState<'json' | 'csv' | 'xml'>('json');
  const [toFormat, setToFormat] = useState<'json' | 'csv' | 'xml'>('csv');
  const [inputData, setInputData] = useState<string>(SAMPLE_JSON);
  const [outputData, setOutputData] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');

  const jsonToCsv = (jsonStr: string) => {
    const arr = JSON.parse(jsonStr);
    if (!Array.isArray(arr) || arr.length === 0) throw new Error('JSON must be an array of objects');
    const headers = Array.from(new Set(arr.flatMap((obj) => Object.keys(obj))));
    const csvRows = [headers.join(',')];
    arr.forEach((obj) => {
      const row = headers.map((h) => {
        const val = obj[h] !== undefined ? String(obj[h]) : '';
        return val.includes(',') || val.includes('"') ? `"${val.replace(/"/g, '""')}"` : val;
      });
      csvRows.push(row.join(','));
    });
    return csvRows.join('\n');
  };

  const csvToJson = (csvStr: string) => {
    const lines = csvStr.trim().split('\n');
    if (lines.length < 2) throw new Error('CSV must have a header row and at least 1 data row');
    const headers = lines[0].split(',').map((h) => h.trim().replace(/^"|"$/g, ''));
    const result = lines.slice(1).map((line) => {
      const vals = line.split(',').map((v) => v.trim().replace(/^"|"$/g, ''));
      const obj: any = {};
      headers.forEach((h, i) => {
        obj[h] = vals[i] || '';
      });
      return obj;
    });
    return JSON.stringify(result, null, 2);
  };

  const jsonToXml = (jsonStr: string) => {
    const data = JSON.parse(jsonStr);
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n<root>\n';
    if (Array.isArray(data)) {
      data.forEach((item) => {
        xml += '  <item>\n';
        Object.entries(item).forEach(([k, v]) => {
          xml += `    <${k}>${v}</${k}>\n`;
        });
        xml += '  </item>\n';
      });
    } else {
      Object.entries(data).forEach(([k, v]) => {
        xml += `  <${k}>${v}</${k}>\n`;
      });
    }
    xml += '</root>';
    return xml;
  };

  const convert = () => {
    setErrorMsg('');
    try {
      if (!inputData.trim()) {
        setOutputData('');
        return;
      }

      if (fromFormat === 'json' && toFormat === 'csv') {
        setOutputData(jsonToCsv(inputData));
      } else if (fromFormat === 'csv' && toFormat === 'json') {
        setOutputData(csvToJson(inputData));
      } else if (fromFormat === 'json' && toFormat === 'xml') {
        setOutputData(jsonToXml(inputData));
      } else if (fromFormat === 'csv' && toFormat === 'xml') {
        const tempJson = csvToJson(inputData);
        setOutputData(jsonToXml(tempJson));
      } else {
        setOutputData(inputData);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Error converting data format');
    }
  };

  useEffect(() => {
    convert();
  }, [inputData, fromFormat, toFormat]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(outputData);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadFile = () => {
    const blob = new Blob([outputData], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `converted-data.${toFormat}`;
    link.click();
  };

  return (
    <div className={styles.container}>
      <div className={styles.breadcrumb}>
        <Link href="/" className={styles.breadcrumbLink}>Home</Link>
        <span>/</span>
        <Link href="/?category=dev#tools-section" className={styles.breadcrumbLink}>Dev & Text</Link>
        <span>/</span>
        <span className={styles.breadcrumbActive}>Data Format Converter</span>
      </div>

      <div className={styles.headerContainer}>
        <h1 className={styles.title}>
          <span className={styles.iconWrapper}>🔄</span>
          JSON ↔ CSV ↔ XML Format Converter
        </h1>
        <p className={styles.subtitle}>
          Bidirectional data format conversion. Convert JSON to CSV, CSV to JSON, or XML with instant in-browser formatting.
        </p>
      </div>

      <div className={styles.card}>
        <div className={styles.topBar}>
          <div className={styles.formatSelector}>
            <select
              value={fromFormat}
              onChange={(e) => setFromFormat(e.target.value as any)}
              className={styles.selectInput}
            >
              <option value="json">JSON</option>
              <option value="csv">CSV</option>
            </select>
            <ArrowRight style={{ width: '1rem', height: '1rem', color: '#78716c' }} />
            <select
              value={toFormat}
              onChange={(e) => setToFormat(e.target.value as any)}
              className={styles.selectInput}
            >
              <option value="csv">CSV</option>
              <option value="json">JSON</option>
              <option value="xml">XML</option>
            </select>
          </div>

          <button
            onClick={() => setInputData(SAMPLE_JSON)}
            className={styles.sampleBtn}
          >
            Load Sample JSON
          </button>
        </div>

        {errorMsg && (
          <div style={{ padding: '0.75rem', borderRadius: '0.65rem', backgroundColor: '#fef2f2', color: '#b91c1c', fontSize: '0.8125rem', fontWeight: 600 }}>
            {errorMsg}
          </div>
        )}

        <div className={styles.editorGrid}>
          <div className={styles.editorBox}>
            <div className={styles.editorHeader}>
              <span>INPUT ({fromFormat.toUpperCase()})</span>
              <button
                onClick={() => setInputData('')}
                style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '0.75rem' }}
              >
                Clear
              </button>
            </div>
            <textarea
              value={inputData}
              onChange={(e) => setInputData(e.target.value)}
              placeholder="Paste input data here..."
              className={styles.textarea}
            />
          </div>

          <div className={styles.editorBox}>
            <div className={styles.editorHeader}>
              <span>OUTPUT ({toFormat.toUpperCase()})</span>
              <span>{outputData.length} chars</span>
            </div>
            <textarea
              readOnly
              value={outputData}
              placeholder="Converted output will appear here..."
              className={styles.textarea}
            />
          </div>
        </div>

        <div className={styles.actionRow}>
          <button onClick={copyToClipboard} className={`${styles.actionBtn} ${styles.copyBtn}`}>
            {copied ? <CheckCircle style={{ width: '1rem', height: '1rem', color: '#16a34a' }} /> : <Copy style={{ width: '1rem', height: '1rem' }} />}
            <span>{copied ? 'Copied!' : 'Copy to Clipboard'}</span>
          </button>
          <button onClick={downloadFile} className={`${styles.actionBtn} ${styles.downloadBtn}`}>
            <Download style={{ width: '1rem', height: '1rem' }} />
            <span>Download .{toFormat.toUpperCase()}</span>
          </button>
        </div>
      </div>

      <AdBanner format="horizontal" />
    </div>
  );
}
