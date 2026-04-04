import { useState } from "react";
import { useReveal } from "../../hooks/useReveal";
import GoldDivider from "../common/GoldDivider";
import CinematicPlayer from "../common/CinematicPlayer";
import { WISH_VIDEO_QUOTES, silverStone, earPieceWhite } from "../../constants/data";
import BORN_TO_NOW_VIDEO  from "../../assets/videos/born-now.mp4";

const PARTICLE_COLORS = ["#BF8D3C", "#F0C97A", "#E8B86D", "#F2EDE4", "#C8963A", "#FFD700"];

export default function BirthdayWish() {
  const ref = useReveal();
  const [celebrated, setCelebrated] = useState(false);

  const handleCelebrate = () => {
    setCelebrated(true);
    setTimeout(() => setCelebrated(false), 4000);
  };

  return (
    <section
      id="wish"
      ref={ref}
      style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "120px 24px", position: "relative", overflow: "hidden", textAlign: "center" }}
    >
      {/* ── Background image ── */}
      <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
        <img
          src={earPieceWhite}
          alt=""
          style={{ width: "100%", height: "100%", objectFit: "cover", filter: "brightness(.12) saturate(.45)" }}
        />
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at center, rgba(191,141,60,.09) 0%, rgba(8,8,8,.88) 70%)" }} />
      </div>

      {/* ── Confetti particles ── */}
      {celebrated && (
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden", zIndex: 5 }}>
          {Array.from({ length: 40 }).map((_, i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                left: `${Math.random() * 100}%`,
                bottom: 0,
                width:  `${4 + Math.random() * 6}px`,
                height: `${4 + Math.random() * 6}px`,
                background: PARTICLE_COLORS[Math.floor(Math.random() * PARTICLE_COLORS.length)],
                borderRadius: Math.random() > 0.5 ? "50%" : "1px",
                animation: `particleFloat ${2 + Math.random() * 3}s ease-out both`,
                animationDelay: `${Math.random() * 1.5}s`,
              }}
            />
          ))}
        </div>
      )}

      {/* ── Main content ── */}
      <div className="reveal" style={{ position: "relative", zIndex: 2, maxWidth: "860px", width: "100%" }}>

        {/* Title */}
        <p style={{ fontSize: "10px", letterSpacing: ".4em", color: "#BF8D3C", textTransform: "uppercase", marginBottom: "32px" }}>
          🎂 A Heartfelt Wish
        </p>
        <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(48px,10vw,96px)", fontWeight: 300, color: "#F2EDE4", letterSpacing: "-0.03em", lineHeight: 1.05, marginBottom: "20px" }}>
          Happy<br />
          <span className="gold-text" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(56px,12vw,120px)", fontWeight: 500, fontStyle: "italic" }}>
            Birthday
          </span>
        </h2>

        <GoldDivider style={{ marginBottom: "48px" }} />

        {/* Wish body */}
        <p style={{ fontSize: "clamp(15px,2vw,18px)", color: "#9E9588", lineHeight: 1.9, fontWeight: 300, letterSpacing: ".01em", marginBottom: "40px" }}>
          On this special day, may your life continue to shine with happiness, success, and love.
          May your passion for dance and your dedication to fitness never fade. You are living proof
          that no matter where you start, you can transform your life with{" "}
          <em style={{ fontStyle: "italic", color: "#BF8D3C" }}>determination</em> and{" "}
          <em style={{ fontStyle: "italic", color: "#BF8D3C" }}>belief</em>.
        </p>

        {/* Pull-quote card */}
        <div style={{ padding: "32px 48px", border: "0.5px solid rgba(191,141,60,.3)", borderRadius: "2px", background: "rgba(8,8,8,.65)", backdropFilter: "blur(12px)", marginBottom: "48px" }}>
          <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(18px,3vw,24px)", fontStyle: "italic", color: "#F2EDE4", lineHeight: 1.7 }}>
            "Happy Birthday to someone truly special — your story inspires, your strength motivates,
            and your journey reminds us that{" "}
            <em style={{ color: "#BF8D3C" }}>greatness is built, not given. 💫✨</em>"
          </p>
        </div>

        {/* Action buttons */}
        <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap", marginBottom: "64px" }}>
          <button
            onClick={handleCelebrate}
            onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.04)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
            style={{ padding: "16px 40px", background: "linear-gradient(135deg,#BF8D3C,#C8963A)", border: "none", borderRadius: "2px", color: "#080808", fontSize: "11px", letterSpacing: ".3em", textTransform: "uppercase", fontWeight: 500, cursor: "pointer", fontFamily: "'Jost', sans-serif", transition: "all .3s ease" }}
          >
            🎉 Celebrate!
          </button>
          <div style={{ padding: "16px 32px", border: "0.5px solid rgba(191,141,60,.4)", borderRadius: "2px", fontSize: "11px", letterSpacing: ".3em", textTransform: "uppercase", color: "#BF8D3C", display: "flex", alignItems: "center", gap: "8px", background: "rgba(8,8,8,.5)", backdropFilter: "blur(8px)" }}>
            💫 A Self-Made Legend
          </div>
        </div>

        {/* ── Born to Now video ── */}
        <div style={{ textAlign: "left" }}>
          <GoldDivider style={{ marginBottom: "40px" }} />

          <div style={{ textAlign: "center", marginBottom: "36px" }}>
            <p style={{ fontSize: "10px", letterSpacing: ".4em", color: "#BF8D3C", textTransform: "uppercase", marginBottom: "12px" }}>
              🎬 &nbsp; The Journey
            </p>
            <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(28px,5vw,52px)", fontWeight: 300, color: "#F2EDE4", fontStyle: "italic" }}>
              Born to <em style={{ color: "#BF8D3C" }}>Now</em>
            </h3>
            <p style={{ fontSize: "clamp(13px,2vw,16px)", color: "#9E9588", lineHeight: 1.8, maxWidth: "520px", margin: "12px auto 0" }}>
              From the first breath to this very moment — watch the full story of a man who turned
              every challenge into a chapter worth living.
            </p>
          </div>

          <CinematicPlayer
            src={BORN_TO_NOW_VIDEO}
            poster={silverStone}
            title="Born to Now — The Full Journey"
            subtitle="🎬 Life Story"
          />

          {/* Quotes beneath the video */}
          <div className="quotes-beneath-video" style={{ marginTop: "28px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
            {WISH_VIDEO_QUOTES.map(({ icon, text }, i) => (
              <div
                className="wish-video-quotes"
                key={i}
                style={{ padding: "24px 28px", background: "rgba(191,141,60,.04)", border: "0.5px solid rgba(191,141,60,.18)", borderRadius: "2px", display: "flex", gap: "14px", alignItems: "flex-start" }}
              >
                <span style={{ fontSize: "22px", flexShrink: 0 }}>{icon}</span>
                <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "16px", fontStyle: "italic", color: "#9E9588", lineHeight: 1.7 }}>
                  {text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}