import { useState, useEffect } from "react";

const NAV_LINKS = ["Story", "Gym", "Reel", "Captions", "Friends", "Wish"];

// ── Cookie helpers ────────────────────────────────────────────────────────────
function setTranslateCookie(code) {
  document.cookie = `googtrans=/en/${code}; path=/`;
  document.cookie = `googtrans=/en/${code}; path=/; domain=${location.hostname}`;
}
function clearTranslateCookie() {
  const exp = "expires=Thu, 01 Jan 1970 00:00:00 UTC";
  document.cookie = `googtrans=; ${exp}; path=/`;
  document.cookie = `googtrans=; ${exp}; path=/; domain=${location.hostname}`;
}
function getCurrentLang() {
  const m = document.cookie.match(/googtrans=\/en\/([a-z]+)/);
  return m ? m[1] : "en";
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [lang, setLang] = useState("en");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Read cookie once on mount so button reflects current translate state
  useEffect(() => { setLang(getCurrentLang()); }, []);

  const handleTranslate = () => {
    if (lang === "en") {
      setTranslateCookie("ta");
    } else {
      clearTranslateCookie();
    }
    window.location.reload();
  };

  const isTamil = lang === "ta";

  return (
    <>
      {/* Suppress Google's yellow top banner */}
      <style>{`
        .goog-te-banner-frame, .skiptranslate > iframe { display:none !important; }
        body { top:0 !important; }
      `}</style>

      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        padding: "0 40px",
        height: "60px",
        background: scrolled ? "rgba(8,8,8,0.96)" : "transparent",
        backdropFilter: scrolled ? "blur(20px)" : "none",
        borderBottom: scrolled ? "0.5px solid rgba(191,141,60,0.2)" : "none",
        transition: "all .5s ease",
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>

        {/* ── Logo ── */}
        <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "20px", fontWeight: 500, letterSpacing: "0.1em", color: "#BF8D3C", flexShrink: 0 }}>
          ✦ WISHES
        </div>

        {/* ── Right side: nav links + translate pill ── */}
        <div style={{ display: "flex", alignItems: "center", gap: "28px" }}>

          {/* Nav links */}
          {NAV_LINKS.map((link) => (
            <a
              key={link}
              href={`#${link.toLowerCase()}`}
              style={{ color: "#9E9588", textDecoration: "none", fontSize: "10px", letterSpacing: "0.2em", textTransform: "uppercase", fontWeight: 400, transition: "color .3s", whiteSpace: "nowrap" }}
              onMouseEnter={(e) => (e.target.style.color = "#BF8D3C")}
              onMouseLeave={(e) => (e.target.style.color = "#9E9588")}
            >
              {link}
            </a>
          ))}

          {/* ── Translate pill — naturally last in the row ── */}
          <button
            onClick={handleTranslate}
            title={isTamil ? "Switch to English" : "தமிழில் மொழிபெயர்க்க"}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              padding: "6px 14px",
              borderRadius: "20px",
              background: isTamil ? "rgba(191,141,60,0.18)" : "transparent",
              border: isTamil ? "1px solid #BF8D3C" : "0.5px solid rgba(191,141,60,0.4)",
              cursor: "pointer",
              transition: "all .3s ease",
              flexShrink: 0,
              boxShadow: isTamil ? "0 0 14px rgba(191,141,60,0.25)" : "none",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "#BF8D3C";
              e.currentTarget.style.background = "rgba(191,141,60,0.12)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = isTamil ? "#BF8D3C" : "rgba(191,141,60,0.4)";
              e.currentTarget.style.background = isTamil ? "rgba(191,141,60,0.18)" : "transparent";
            }}
          >
            {/* Globe icon */}
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
              stroke="#BF8D3C" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"
              style={{ flexShrink: 0 }}>
              <circle cx="12" cy="12" r="10" />
              <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
            </svg>

            {/* Label */}
            <span style={{
              fontSize: "10px", letterSpacing: "0.15em",
              color: "#BF8D3C", fontFamily: "'Jost', sans-serif",
              fontWeight: 400, userSelect: "none", whiteSpace: "nowrap",
            }}>
              {isTamil ? "English" : "தமிழ்"}
            </span>

            {/* Active dot when Tamil is on */}
            {isTamil && (
              <span style={{
                width: "5px", height: "5px", borderRadius: "50%",
                background: "#BF8D3C", flexShrink: 0,
                animation: "pulse 1.5s ease-in-out infinite",
              }} />
            )}
          </button>
        </div>
      </nav>
    </>
  );
}