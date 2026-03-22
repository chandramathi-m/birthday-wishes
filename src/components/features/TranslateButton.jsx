import { useEffect, useState } from "react";

/**
 * TranslateButton
 *
 * Uses the "googtrans" cookie approach — the same mechanism Chrome uses
 * internally for Google Translate. Steps:
 *
 *   Translate → set cookie  googtrans=/en/ta  → reload → Google auto-translates
 *   Restore   → clear cookie                 → reload → original content
 *
 * The Google Translate script (injected into index.html) reads this cookie
 * on every page load and translates automatically when it's present.
 */

const COOKIE_NAME = "googtrans";

function setTranslateCookie(langCode) {
  // Must be set on both "/" and the full domain for Google to pick it up
  document.cookie = `${COOKIE_NAME}=/en/${langCode}; path=/`;
  document.cookie = `${COOKIE_NAME}=/en/${langCode}; path=/; domain=${location.hostname}`;
}

function clearTranslateCookie() {
  const expiry = "expires=Thu, 01 Jan 1970 00:00:00 UTC";
  document.cookie = `${COOKIE_NAME}=; ${expiry}; path=/`;
  document.cookie = `${COOKIE_NAME}=; ${expiry}; path=/; domain=${location.hostname}`;
}

function getCurrentLang() {
  const match = document.cookie.match(/googtrans=\/en\/([a-z]+)/);
  return match ? match[1] : "en";
}

export default function TranslateButton() {
  const [lang, setLang] = useState("en");

  // Read current state from cookie on mount
  useEffect(() => {
    setLang(getCurrentLang());
  }, []);

  const handleToggle = () => {
    if (lang === "en") {
      setTranslateCookie("ta");
      setLang("ta");
    } else {
      clearTranslateCookie();
      setLang("en");
    }
    // Reload so Google Translate script picks up the new cookie
    window.location.reload();
  };

  const isTamil = lang === "ta";

  return (
    <>
      {/* ── Suppress Google's default yellow top banner ───────────────────── */}
      <style>{`
        .goog-te-banner-frame.skiptranslate,
        .skiptranslate > iframe            { display: none !important; }
        body                               { top: 0 !important; }
      `}</style>

      <button
        onClick={handleToggle}
        title={isTamil ? "Switch to English" : "தமிழில் மொழிபெயர்க்க"}
        style={{
          position: "fixed",
          top: "14px",
          right: "230px",
          zIndex: 200,
          display: "flex",
          alignItems: "center",
          gap: "7px",
          padding: "7px 16px",
          borderRadius: "20px",
          background: isTamil
            ? "rgba(191,141,60,0.2)"
            : "rgba(15,13,9,0.88)",
          border: isTamil
            ? "1px solid #BF8D3C"
            : "0.5px solid rgba(191,141,60,0.45)",
          backdropFilter: "blur(14px)",
          cursor: "pointer",
          transition: "all .3s ease",
          boxShadow: isTamil
            ? "0 0 18px rgba(191,141,60,0.3)"
            : "none",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = "#BF8D3C";
          e.currentTarget.style.background = "rgba(191,141,60,0.15)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = isTamil
            ? "#BF8D3C"
            : "rgba(191,141,60,0.45)";
          e.currentTarget.style.background = isTamil
            ? "rgba(191,141,60,0.2)"
            : "rgba(15,13,9,0.88)";
        }}
      >
        {/* Globe icon */}
        <svg
          width="13" height="13" viewBox="0 0 24 24"
          fill="none" stroke="#BF8D3C" strokeWidth="1.6"
          strokeLinecap="round" strokeLinejoin="round"
          style={{ flexShrink: 0 }}
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        </svg>

        {/* Label */}
        <span style={{
          fontSize: "10px",
          letterSpacing: "0.12em",
          color: "#BF8D3C",
          fontFamily: "'Jost', sans-serif",
          fontWeight: 400,
          userSelect: "none",
          whiteSpace: "nowrap",
        }}>
          {isTamil ? "English" : "தமிழ்"}
        </span>

        {/* Active indicator dot */}
        {isTamil && (
          <span style={{
            width: "5px",
            height: "5px",
            borderRadius: "50%",
            background: "#BF8D3C",
            flexShrink: 0,
            animation: "pulse 1.5s ease-in-out infinite",
          }} />
        )}
      </button>
    </>
  );
}