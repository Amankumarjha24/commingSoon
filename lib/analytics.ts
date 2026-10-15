// Lightweight, non-blocking visitor analytics logger
// Strictly sends public telemetry to backend /api/traffic/log
// Zero cookies, zero third-party trackers, zero sensitive leaks

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export function logPageView(toolName: string = "Home", path?: string) {
  if (typeof window === "undefined") return;

  try {
    const currentPath = path || window.location.pathname;
    const referrer = document.referrer || "direct";
    const screenWidth = window.innerWidth || 0;
    const device = screenWidth < 768 ? "mobile" : screenWidth < 1024 ? "tablet" : "desktop";

    // Create or retrieve anonymous ephemeral session ID for unique visitor counting
    let sessionId = sessionStorage.getItem("tft_session");
    if (!sessionId) {
      sessionId = "s_" + Math.random().toString(36).substring(2, 12) + Date.now().toString(36);
      sessionStorage.setItem("tft_session", sessionId);
    }

    const payload = {
      path: currentPath,
      tool: toolName,
      referrer,
      device,
      screenWidth,
      sessionId,
    };

    // Use sendBeacon if available for zero-impact async logging, otherwise fallback to fetch
    const endpoint = `${API_BASE}/api/traffic/log`;
    const dataString = JSON.stringify(payload);

    if (navigator.sendBeacon) {
      const blob = new Blob([dataString], { type: "application/json" });
      navigator.sendBeacon(endpoint, blob);
    } else {
      fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: dataString,
        mode: "cors",
        keepalive: true,
      }).catch(() => {
        // Silent fail: analytics should never break user interactions
      });
    }
  } catch {
    // Graceful swallow
  }
}
