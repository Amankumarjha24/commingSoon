/**
 * Video GeoTag Engine
 * Fast, pure TypeScript client-side ISO BMFF (MP4 & QuickTime MOV) GPS metadata injector, parser, and verifier.
 *
 * Implements:
 * 1. ISO 6709 Coordinate formatting and parsing (+DD.DDDD+DDD.DDDD+AAA.AA/)
 * 2. QuickTime User Data '©xyz' Location Atom (moov.udta.©xyz)
 * 3. QuickTime ItemList metadata scanning (com.apple.quicktime.location.ISO6709)
 * 4. Stco & Co64 chunk offset rewriting across all tracks when moov expands or contracts
 * 5. Zero re-encoding: video & audio streams in 'mdat' remain 100% bit-for-bit lossless
 */

export interface VideoFormatInfo {
  format: string;
  majorBrand: string;
  isSupported: boolean;
  error?: string;
}

export interface VideoGPSMetadata {
  latitude: number;
  longitude: number;
  altitude: number | null;
  rawISO6709: string;
  source: string;
}

export interface GeotagVerification {
  verified: boolean;
  coordinates?: {
    latitude: number;
    longitude: number;
    altitude: number | null;
  };
  mapsUrl?: string;
  error?: string;
}

export class VideoGeotagEngine {
  /**
   * Format decimal latitude, longitude, and optional altitude into standard ISO 6709 string.
   * Format: ±DD.DDDDDD±DDD.DDDDDD±AAA.AA/
   * e.g., +28.613939+077.209021+216.00/
   */
  static formatISO6709(lat: number, lng: number, altitude?: number | null): string {
    if (isNaN(lat) || lat < -90 || lat > 90) {
      throw new Error('Latitude must be between -90 and +90 degrees.');
    }
    if (isNaN(lng) || lng < -180 || lng > 180) {
      throw new Error('Longitude must be between -180 and +180 degrees.');
    }

    const latSign = lat >= 0 ? '+' : '-';
    const latVal = Math.abs(lat).toFixed(6);
    const latParts = latVal.split('.');
    const latDeg = latParts[0].padStart(2, '0');
    const latStr = `${latSign}${latDeg}.${latParts[1]}`;

    const lngSign = lng >= 0 ? '+' : '-';
    const lngVal = Math.abs(lng).toFixed(6);
    const lngParts = lngVal.split('.');
    const lngDeg = lngParts[0].padStart(3, '0');
    const lngStr = `${lngSign}${lngDeg}.${lngParts[1]}`;

    let altStr = '';
    if (altitude !== null && altitude !== undefined && !isNaN(Number(altitude)) && String(altitude).trim() !== '') {
      const altNum = parseFloat(String(altitude));
      const altSign = altNum >= 0 ? '+' : '-';
      altStr = `${altSign}${Math.abs(altNum).toFixed(2)}`;
    }

    return `${latStr}${lngStr}${altStr}/`;
  }

  /**
   * Parse an ISO 6709 location string back to decimal coordinates.
   */
  static parseISO6709(str: string): VideoGPSMetadata | null {
    if (!str || typeof str !== 'string') return null;
    const clean = str.trim().replace(/\/$/, '');
    const match = clean.match(/^([+-]\d+(?:\.\d+)?)([+-]\d+(?:\.\d+)?)(?:([+-]\d+(?:\.\d+)?))?/);
    if (!match) return null;

    return {
      latitude: parseFloat(match[1]),
      longitude: parseFloat(match[2]),
      altitude: match[3] ? parseFloat(match[3]) : null,
      rawISO6709: str.trim(),
      source: 'ISO 6709 Location String'
    };
  }

  /**
   * Detect container format and verify if it is an MP4 or QuickTime MOV container.
   */
  static detectFormat(bytes: Uint8Array): VideoFormatInfo {
    if (bytes.length < 16) {
      return { format: 'Unknown', majorBrand: '', isSupported: false, error: 'File is too small to be a valid video container.' };
    }

    const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
    const magic = String.fromCharCode(bytes[4], bytes[5], bytes[6], bytes[7]);

    if (magic !== 'ftyp') {
      return {
        format: 'Non-MP4 Container',
        majorBrand: '',
        isSupported: false,
        error: 'Container is not an MP4 or QuickTime MOV file. Only MP4/MOV containers support standard ISO 6709 location atoms without re-encoding.'
      };
    }

    const majorBrand = String.fromCharCode(bytes[8], bytes[9], bytes[10], bytes[11]).trim();
    const isMov = majorBrand.toLowerCase() === 'qt' || majorBrand.toLowerCase() === 'qt  ';

    return {
      format: isMov ? 'QuickTime MOV Video' : 'MP4 Video',
      majorBrand: majorBrand || 'isom',
      isSupported: true
    };
  }

  /**
   * Read existing GPS metadata from an MP4/MOV container.
   */
  static readGPS(bytes: Uint8Array): VideoGPSMetadata | null {
    const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
    let pos = 0;
    let moovBox: { offset: number; size: number } | null = null;

    while (pos + 8 <= bytes.length) {
      const size = view.getUint32(pos);
      const type = String.fromCharCode(bytes[pos + 4], bytes[pos + 5], bytes[pos + 6], bytes[pos + 7]);
      let actSize = size;
      if (size === 1) {
        if (pos + 16 > bytes.length) break;
        actSize = Number(view.getBigUint64(pos + 8));
      } else if (size === 0) {
        actSize = bytes.length - pos;
      }
      if (type === 'moov') {
        moovBox = { offset: pos, size: actSize };
        break;
      }
      if (actSize <= 0) break;
      pos += actSize;
    }

    if (!moovBox) return null;
    const moovEnd = moovBox.offset + moovBox.size;

    // Scan for ©xyz atom: bytes [0xA9, 0x78, 0x79, 0x7A]
    for (let p = moovBox.offset; p < moovEnd - 12; p++) {
      if (bytes[p] === 0xa9 && bytes[p + 1] === 0x78 && bytes[p + 2] === 0x79 && bytes[p + 3] === 0x7a) {
        const boxStart = p - 4;
        if (boxStart >= moovBox.offset) {
          const boxSize = view.getUint32(boxStart);
          if (boxSize >= 10 && boxStart + boxSize <= moovEnd) {
            const strStart = p + 6;
            const strEnd = boxStart + boxSize;
            let str = '';
            for (let i = strStart; i < strEnd; i++) {
              str += String.fromCharCode(bytes[i]);
            }
            const parsed = VideoGeotagEngine.parseISO6709(str);
            if (parsed) {
              return { ...parsed, source: 'QuickTime User Data (©xyz atom)' };
            }
          }
        }
      }
    }

    // Secondary scan: QuickTime ItemList metadata key
    const qtPattern = 'com.apple.quicktime.location.ISO6709';
    let qtFound = -1;
    for (let p = moovBox.offset; p < moovEnd - qtPattern.length; p++) {
      let match = true;
      for (let k = 0; k < qtPattern.length; k++) {
        if (bytes[p + k] !== qtPattern.charCodeAt(k)) {
          match = false;
          break;
        }
      }
      if (match) {
        qtFound = p;
        break;
      }
    }

    if (qtFound !== -1) {
      let str = '';
      const limit = Math.min(moovEnd, qtFound + 256);
      for (let i = qtFound; i < limit; i++) {
        str += String.fromCharCode(bytes[i]);
      }
      const isoMatch = str.match(/[+-]\d{2}\.\d+[+-]\d{3}\.\d+[^\/]*\//);
      if (isoMatch) {
        const parsed = VideoGeotagEngine.parseISO6709(isoMatch[0]);
        if (parsed) {
          return { ...parsed, source: 'QuickTime ItemList (com.apple.quicktime.location.ISO6709)' };
        }
      }
    }

    return null;
  }

  /**
   * Set or update GPS metadata inside an MP4/MOV container.
   * Performs in-place container box insertion and shifts chunk offset tables (stco / co64)
   * to guarantee 100% intact audio/video playback and zero stream re-encoding.
   */
  static setGPS(bytes: Uint8Array, lat: number, lng: number, altitude?: number | null): Uint8Array {
    const isoStr = VideoGeotagEngine.formatISO6709(lat, lng, altitude);
    const strBytes = new TextEncoder().encode(isoStr);

    // Build the ©xyz box: 4 bytes size, 4 bytes '\xA9xyz', 2 bytes language (0x15C7), string
    const xyzPayloadSize = 2 + strBytes.length;
    const xyzBoxSize = 8 + xyzPayloadSize;
    const xyzBox = new Uint8Array(xyzBoxSize);
    const xyzView = new DataView(xyzBox.buffer);
    xyzView.setUint32(0, xyzBoxSize);
    xyzBox.set([0xa9, 0x78, 0x79, 0x7a], 4);
    xyzView.setUint16(8, 0x15c7); // Default language code 'und'
    xyzBox.set(strBytes, 10);

    const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);

    let pos = 0;
    let moovBox: { offset: number; size: number } | null = null;
    let mdatBox: { offset: number; size: number } | null = null;

    while (pos + 8 <= bytes.length) {
      const size = view.getUint32(pos);
      const type = String.fromCharCode(bytes[pos + 4], bytes[pos + 5], bytes[pos + 6], bytes[pos + 7]);
      let actSize = size;
      if (size === 1) {
        if (pos + 16 > bytes.length) break;
        actSize = Number(view.getBigUint64(pos + 8));
      } else if (size === 0) {
        actSize = bytes.length - pos;
      }
      if (type === 'moov') {
        moovBox = { offset: pos, size: actSize };
      } else if (type === 'mdat') {
        mdatBox = { offset: pos, size: actSize };
      }
      if (actSize <= 0) break;
      pos += actSize;
    }

    if (!moovBox) throw new Error('Invalid video: moov atom not found.');

    const moovEnd = moovBox.offset + moovBox.size;
    let udtaBox: { offset: number; size: number } | null = null;
    let moovScan = moovBox.offset + 8;

    while (moovScan + 8 <= moovEnd) {
      const bSize = view.getUint32(moovScan);
      const bType = String.fromCharCode(bytes[moovScan + 4], bytes[moovScan + 5], bytes[moovScan + 6], bytes[moovScan + 7]);
      let actSize = bSize === 1 ? Number(view.getBigUint64(moovScan + 8)) : bSize;

      if (bType === 'udta') {
        udtaBox = { offset: moovScan, size: actSize };
      }
      if (actSize <= 0) break;
      moovScan += actSize;
    }

    let newBytes: Uint8Array;
    let bytesAdded = 0;
    let insertionPoint = 0;

    if (udtaBox) {
      // Look for existing ©xyz in udta
      let existingXyzOffset = -1;
      let existingXyzSize = 0;
      for (let p = udtaBox.offset; p < udtaBox.offset + udtaBox.size - 12; p++) {
        if (bytes[p] === 0xa9 && bytes[p + 1] === 0x78 && bytes[p + 2] === 0x79 && bytes[p + 3] === 0x7a) {
          existingXyzOffset = p - 4;
          existingXyzSize = view.getUint32(existingXyzOffset);
          break;
        }
      }

      if (existingXyzOffset !== -1 && existingXyzSize > 0) {
        // Replace existing ©xyz box
        bytesAdded = xyzBoxSize - existingXyzSize;
        insertionPoint = existingXyzOffset;

        newBytes = new Uint8Array(bytes.length + bytesAdded);
        newBytes.set(bytes.subarray(0, existingXyzOffset), 0);
        newBytes.set(xyzBox, existingXyzOffset);
        newBytes.set(bytes.subarray(existingXyzOffset + existingXyzSize), existingXyzOffset + xyzBoxSize);
      } else {
        // Append ©xyz inside udta box
        insertionPoint = udtaBox.offset + udtaBox.size;
        bytesAdded = xyzBoxSize;

        newBytes = new Uint8Array(bytes.length + bytesAdded);
        newBytes.set(bytes.subarray(0, insertionPoint), 0);
        newBytes.set(xyzBox, insertionPoint);
        newBytes.set(bytes.subarray(insertionPoint), insertionPoint + xyzBoxSize);
      }
    } else {
      // Create new udta box containing ©xyz box
      const udtaBoxSize = 8 + xyzBoxSize;
      const newUdta = new Uint8Array(udtaBoxSize);
      const newUdtaView = new DataView(newUdta.buffer);
      newUdtaView.setUint32(0, udtaBoxSize);
      newUdta.set([0x75, 0x64, 0x74, 0x61], 4); // 'udta'
      newUdta.set(xyzBox, 8);

      insertionPoint = moovEnd;
      bytesAdded = udtaBoxSize;

      newBytes = new Uint8Array(bytes.length + bytesAdded);
      newBytes.set(bytes.subarray(0, insertionPoint), 0);
      newBytes.set(newUdta, insertionPoint);
      newBytes.set(bytes.subarray(insertionPoint), insertionPoint + udtaBoxSize);
    }

    const newView = new DataView(newBytes.buffer);

    // Update moov size
    const newMoovSize = moovBox.size + bytesAdded;
    newView.setUint32(moovBox.offset, newMoovSize);

    // If udta existed, update udta size
    if (udtaBox) {
      const existingUdtaSize = newView.getUint32(udtaBox.offset);
      newView.setUint32(udtaBox.offset, existingUdtaSize + bytesAdded);
    }

    // Shift chunk offsets (stco / co64) if moov is before mdat
    if (mdatBox && moovBox.offset < mdatBox.offset && bytesAdded !== 0) {
      const newMoovEnd = moovBox.offset + newMoovSize;
      let scan = moovBox.offset + 8;
      while (scan + 8 <= newMoovEnd) {
        const type = String.fromCharCode(newBytes[scan + 4], newBytes[scan + 5], newBytes[scan + 6], newBytes[scan + 7]);
        if (type === 'stco') {
          const bSize = newView.getUint32(scan);
          const count = newView.getUint32(scan + 12);
          const tablePos = scan + 16;
          for (let i = 0; i < count; i++) {
            const oldOff = newView.getUint32(tablePos + i * 4);
            if (oldOff >= insertionPoint) {
              newView.setUint32(tablePos + i * 4, oldOff + bytesAdded);
            }
          }
          scan += bSize;
        } else if (type === 'co64') {
          const bSize = newView.getUint32(scan);
          const count = newView.getUint32(scan + 12);
          const tablePos = scan + 16;
          for (let i = 0; i < count; i++) {
            const oldOff = Number(newView.getBigUint64(tablePos + i * 8));
            if (oldOff >= insertionPoint) {
              newView.setBigUint64(tablePos + i * 8, BigInt(oldOff + bytesAdded));
            }
          }
          scan += bSize;
        } else {
          scan += 1;
        }
      }
    }

    return newBytes;
  }

  /**
   * Remove GPS metadata (cleans ©xyz box from container)
   */
  static removeGPS(bytes: Uint8Array): Uint8Array {
    const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
    let pos = 0;
    let moovBox: { offset: number; size: number } | null = null;
    let mdatBox: { offset: number; size: number } | null = null;

    while (pos + 8 <= bytes.length) {
      const size = view.getUint32(pos);
      const type = String.fromCharCode(bytes[pos + 4], bytes[pos + 5], bytes[pos + 6], bytes[pos + 7]);
      let actSize = size === 1 ? Number(view.getBigUint64(pos + 8)) : (size === 0 ? bytes.length - pos : size);
      if (type === 'moov') moovBox = { offset: pos, size: actSize };
      if (type === 'mdat') mdatBox = { offset: pos, size: actSize };
      if (actSize <= 0) break;
      pos += actSize;
    }

    if (!moovBox) return bytes;

    const moovEnd = moovBox.offset + moovBox.size;
    let udtaBox: { offset: number; size: number } | null = null;
    let moovScan = moovBox.offset + 8;

    while (moovScan + 8 <= moovEnd) {
      const bSize = view.getUint32(moovScan);
      const bType = String.fromCharCode(bytes[moovScan + 4], bytes[moovScan + 5], bytes[moovScan + 6], bytes[moovScan + 7]);
      let actSize = bSize === 1 ? Number(view.getBigUint64(moovScan + 8)) : bSize;
      if (bType === 'udta') udtaBox = { offset: moovScan, size: actSize };
      if (actSize <= 0) break;
      moovScan += actSize;
    }

    if (!udtaBox) return bytes;

    let existingXyzOffset = -1;
    let existingXyzSize = 0;
    for (let p = udtaBox.offset; p < udtaBox.offset + udtaBox.size - 12; p++) {
      if (bytes[p] === 0xa9 && bytes[p + 1] === 0x78 && bytes[p + 2] === 0x79 && bytes[p + 3] === 0x7a) {
        existingXyzOffset = p - 4;
        existingXyzSize = view.getUint32(existingXyzOffset);
        break;
      }
    }

    if (existingXyzOffset === -1 || existingXyzSize <= 0) return bytes;

    const bytesRemoved = existingXyzSize;
    const newBytes = new Uint8Array(bytes.length - bytesRemoved);
    newBytes.set(bytes.subarray(0, existingXyzOffset), 0);
    newBytes.set(bytes.subarray(existingXyzOffset + existingXyzSize), existingXyzOffset);

    const newView = new DataView(newBytes.buffer);

    // Update moov size
    const newMoovSize = moovBox.size - bytesRemoved;
    newView.setUint32(moovBox.offset, newMoovSize);

    // Update udta size
    const existingUdtaSize = newView.getUint32(udtaBox.offset);
    newView.setUint32(udtaBox.offset, existingUdtaSize - bytesRemoved);

    // Shift chunk offsets (stco / co64)
    if (mdatBox && moovBox.offset < mdatBox.offset) {
      const newMoovEnd = moovBox.offset + newMoovSize;
      let scan = moovBox.offset + 8;
      while (scan + 8 <= newMoovEnd) {
        const type = String.fromCharCode(newBytes[scan + 4], newBytes[scan + 5], newBytes[scan + 6], newBytes[scan + 7]);
        if (type === 'stco') {
          const bSize = newView.getUint32(scan);
          const count = newView.getUint32(scan + 12);
          const tablePos = scan + 16;
          for (let i = 0; i < count; i++) {
            const oldOff = newView.getUint32(tablePos + i * 4);
            if (oldOff >= existingXyzOffset) {
              newView.setUint32(tablePos + i * 4, oldOff - bytesRemoved);
            }
          }
          scan += bSize;
        } else if (type === 'co64') {
          const bSize = newView.getUint32(scan);
          const count = newView.getUint32(scan + 12);
          const tablePos = scan + 16;
          for (let i = 0; i < count; i++) {
            const oldOff = Number(newView.getBigUint64(tablePos + i * 8));
            if (oldOff >= existingXyzOffset) {
              newView.setBigUint64(tablePos + i * 8, BigInt(oldOff - bytesRemoved));
            }
          }
          scan += bSize;
        } else {
          scan += 1;
        }
      }
    }

    return newBytes;
  }

  /**
   * Independently verify the generated video buffer.
   */
  static verifyGPS(bytes: Uint8Array, expectedLat: number, expectedLng: number): GeotagVerification {
    try {
      const parsed = VideoGeotagEngine.readGPS(bytes);
      if (!parsed) {
        return {
          verified: false,
          error: 'GPS metadata was not detected in the output video container.'
        };
      }

      const latDiff = Math.abs(parsed.latitude - expectedLat);
      const lngDiff = Math.abs(parsed.longitude - expectedLng);

      if (latDiff > 0.0001 || lngDiff > 0.0001) {
        return {
          verified: false,
          coordinates: { latitude: parsed.latitude, longitude: parsed.longitude, altitude: parsed.altitude },
          error: `Coordinates discrepancy: Expected (${expectedLat}, ${expectedLng}) but found (${parsed.latitude}, ${parsed.longitude})`
        };
      }

      return {
        verified: true,
        coordinates: {
          latitude: parsed.latitude,
          longitude: parsed.longitude,
          altitude: parsed.altitude
        },
        mapsUrl: `https://www.google.com/maps?q=${parsed.latitude.toFixed(6)},${parsed.longitude.toFixed(6)}`
      };
    } catch (err: any) {
      return {
        verified: false,
        error: `Verification parsing failed: ${err.message}`
      };
    }
  }
}
