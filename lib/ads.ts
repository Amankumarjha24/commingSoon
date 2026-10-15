// Dynamic AdSense & Banner settings fetcher
// Communicates with backend /api/ads

export interface AdSettingsData {
  adsEnabled: boolean;
  adsenseClientId: string;
  headerBannerCode: string;
  inToolBannerCode: string;
  footerStickyCode: string;
  fallbackBannerUrl: string;
  fallbackBannerText: string;
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export async function getAdSettings(): Promise<AdSettingsData> {
  try {
    const res = await fetch(`${API_BASE}/api/ads`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
    });
    if (!res.ok) throw new Error("Failed to fetch ad settings");
    const json = await res.json();
    return json;
  } catch {
    return {
      adsEnabled: false,
      adsenseClientId: "",
      headerBannerCode: "",
      inToolBannerCode: "",
      footerStickyCode: "",
      fallbackBannerUrl: "",
      fallbackBannerText: "",
    };
  }
}
