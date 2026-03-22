import { useState, useEffect } from "react";
import GoldDivider from "../common/GoldDivider";
import { HERO_BG_IMAGES, HERO_BADGES } from "../../constants/data";

const CORNER_POSITIONS = [
  { top: 80, left: 40 },
  { top: 80, right: 40 },
  { bottom: 100, left: 40 },
  { bottom: 100, right: 40 },
];

export default function HeroSection() {
  const [loaded,  setLoaded]  = useState(false);
  const [bgIndex, setBgIndex] = useState(0);

  useEffect(() => { setTimeout(() => setLoaded(true), 200); }, []);

  useEffect(() => {
    const timer = setInterval(() => setBgIndex((p) => (p + 1) % HERO_BG_IMAGES.length), 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden", padding: "120px 24px 80px" }}>

      {/* ── Background image crossfade ── */}
      {HERO_BG_IMAGES.map((src, i) => (
        <div key={i} style={{ position: "absolute", inset: 0, zIndex: 0, opacity: i === bgIndex ? 1 : 0, transition: "opacity 1.8s ease" }}>
          <img src={src} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", animation: i === bgIndex ? "bgZoom 10s ease-in-out both" : "none", filter: "brightness(0.22) saturate(0.5)" }} />
        </div>
      ))}

      {/* ── Gradient overlays ── */}
      <div style={{ position: "absolute", inset: 0, zIndex: 1, background: "linear-gradient(to bottom, rgba(8,8,8,.45) 0%, rgba(8,8,8,.15) 50%, rgba(8,8,8,.75) 100%)" }} />
      <div style={{ position: "absolute", inset: 0, zIndex: 1, background: "radial-gradient(ellipse at center, rgba(191,141,60,.07) 0%, transparent 70%)", animation: "pulse 6s ease-in-out infinite" }} />

      {/* ── Slide dots ── */}
      <div style={{ position: "absolute", bottom: "72px", left: "50%", transform: "translateX(-50%)", display: "flex", gap: "8px", zIndex: 10 }}>
        {HERO_BG_IMAGES.map((_, i) => (
          <button key={i} onClick={() => setBgIndex(i)} style={{ width: i === bgIndex ? "24px" : "6px", height: "6px", borderRadius: "3px", background: i === bgIndex ? "#BF8D3C" : "rgba(191,141,60,.3)", border: "none", cursor: "pointer", transition: "all .4s ease", padding: 0 }} />
        ))}
      </div>

      {/* ── Corner decorations ── */}
      {CORNER_POSITIONS.map((pos, i) => (
        <div key={i} style={{
          position: "absolute", ...pos, zIndex: 5, width: "50px", height: "50px",
          borderTop:    i < 2      ? "0.5px solid rgba(191,141,60,.55)" : "none",
          borderBottom: i >= 2     ? "0.5px solid rgba(191,141,60,.55)" : "none",
          borderLeft:   i % 2 === 0 ? "0.5px solid rgba(191,141,60,.55)" : "none",
          borderRight:  i % 2 === 1 ? "0.5px solid rgba(191,141,60,.55)" : "none",
        }} />
      ))}

      {/* ── Main content ── */}
      <div style={{ opacity: loaded ? 1 : 0, transition: "opacity 1s ease", textAlign: "center", maxWidth: "900px", position: "relative", zIndex: 5 }}>
        <p style={{ fontSize: "11px", letterSpacing: "0.4em", textTransform: "uppercase", color: "#BF8D3C", fontWeight: 400, marginBottom: "32px", animation: loaded ? "fadeUp 0.8s ease both" : "none", animationDelay: ".1s" }}>
          ✦ &nbsp; A Celebration of a Life &nbsp; ✦
        </p>

        <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(48px,10vw,110px)", fontWeight: 300, lineHeight: 1.05, letterSpacing: "-0.02em", color: "#F2EDE4", marginBottom: "20px", animation: loaded ? "fadeUp 1s ease both" : "none", animationDelay: ".3s", textShadow: "0 4px 40px rgba(0,0,0,.9)" }}>
          From <em style={{ fontStyle: "italic", color: "#BF8D3C" }}>Waiting</em><br />to Wonder
        </h1>

        <div style={{ animation: loaded ? "fadeIn 1s ease both" : "none", animationDelay: ".7s", margin: "36px 0" }}>
          <GoldDivider />
        </div>

        <p style={{ fontSize: "clamp(14px,2.5vw,18px)", color: "#C4BAB0", fontWeight: 300, lineHeight: 1.8, letterSpacing: ".03em", maxWidth: "600px", margin: "0 auto 48px", animation: loaded ? "fadeUp 1s ease both" : "none", animationDelay: ".9s", textShadow: "0 2px 20px rgba(0,0,0,.95)" }}>
          A journey worth celebrating — from a child born of patience and prayers, to a man who built himself from the inside out.
        </p>

        {/* Badges */}
        <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap", animation: loaded ? "fadeUp 1s ease both" : "none", animationDelay: "1.1s" }}>
          {HERO_BADGES.map(({ icon, label }) => (
            <div key={label} style={{ padding: "10px 22px", border: "0.5px solid rgba(191,141,60,.45)", borderRadius: "2px", fontSize: "11px", letterSpacing: ".25em", textTransform: "uppercase", color: "#BF8D3C", display: "flex", gap: "8px", alignItems: "center", background: "rgba(8,8,8,.45)", backdropFilter: "blur(8px)" }}>
              <span style={{ fontSize: "14px" }}>{icon}</span>{label}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}