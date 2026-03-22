import { useState } from "react";
import { useReveal } from "../../hooks/useReveal";
import GoldDivider from "../common/GoldDivider";
import { QUOTES, VOICEOVER, dance } from "../../constants/data";

export default function QuotesSection() {
  const ref = useReveal();
  const [active, setActive] = useState(0);

  return (
    <section id="captions" ref={ref} style={{ padding: "120px 24px", maxWidth: "1100px", margin: "0 auto" }}>

      <div className="reveal" style={{ textAlign: "center", marginBottom: "60px" }}>
        <p style={{ fontSize: "10px", letterSpacing: ".4em", color: "#BF8D3C", textTransform: "uppercase", marginBottom: "16px" }}>Cinematic Captions</p>
        <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "clamp(36px,6vw,64px)", fontWeight: 300, color: "#F2EDE4", letterSpacing: "-0.02em" }}>
          His Story in <em style={{ fontStyle: "italic", color: "#BF8D3C" }}>Words</em>
        </h2>
        <GoldDivider style={{ marginTop: "32px", maxWidth: "300px", margin: "32px auto 0" }} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "48px", alignItems: "start" }}>

        {/* Left — dance image with quote overlay */}
        <div className="reveal reveal-delay-1" style={{ position: "relative", overflow: "hidden", borderRadius: "2px", aspectRatio: "3/4" }}>
          <img src={dance} alt="Dance" className="img-cinematic" />
          <div style={{ position: "absolute", inset: "12px", border: "0.5px solid rgba(191,141,60,.4)", borderRadius: "1px", pointerEvents: "none" }} />
          <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "60%", background: "linear-gradient(to top,rgba(8,8,8,.9),transparent)", pointerEvents: "none" }} />
          <div style={{ position: "absolute", bottom: "24px", left: "24px", right: "24px" }}>
            <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "20px", fontStyle: "italic", color: "#F2EDE4", lineHeight: 1.5 }}>
              "Dance is not his hobby…<br />it's his <span style={{ color: "#BF8D3C" }}>soul.</span>"
            </p>
          </div>
        </div>

        {/* Right — quote selector + voiceover */}
        <div className="reveal reveal-delay-2">

          {/* Tab buttons */}
          <div style={{ display: "flex", gap: "8px", marginBottom: "28px", flexWrap: "wrap" }}>
            {QUOTES.map((_, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                style={{
                  padding: "8px 18px",
                  background: i === active ? "rgba(191,141,60,.15)" : "transparent",
                  border:     i === active ? "0.5px solid #BF8D3C"  : "0.5px solid rgba(191,141,60,.25)",
                  borderRadius: "2px",
                  color:    i === active ? "#BF8D3C" : "#9E9588",
                  fontSize: "10px", letterSpacing: ".2em", textTransform: "uppercase",
                  cursor: "pointer", transition: "all .3s ease",
                  fontFamily: "'Jost', sans-serif",
                }}
              >
                0{i + 1}
              </button>
            ))}
          </div>

          {/* Active quote card */}
          <div style={{ background: "rgba(191,141,60,.04)", border: "0.5px solid rgba(191,141,60,.2)", borderRadius: "2px", padding: "44px 36px", position: "relative", marginBottom: "36px", animation: "borderGlow 4s ease-in-out infinite" }}>
            <div style={{ position: "absolute", top: "14px", left: "22px", fontFamily: "'Cormorant Garamond',serif", fontSize: "64px", color: "rgba(191,141,60,.12)", lineHeight: 1 }}>"</div>
            <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "clamp(17px,2.5vw,22px)", color: "#F2EDE4", lineHeight: 1.7, fontWeight: 300, fontStyle: "italic", whiteSpace: "pre-line", position: "relative", zIndex: 1 }}>
              {QUOTES[active].text}
            </p>
            <p style={{ marginTop: "20px", fontSize: "9px", letterSpacing: ".35em", color: "#BF8D3C", textTransform: "uppercase" }}>
              {QUOTES[active].label}
            </p>
            <div style={{ position: "absolute", bottom: "14px", right: "22px", fontFamily: "'Cormorant Garamond',serif", fontSize: "64px", color: "rgba(191,141,60,.12)", lineHeight: 1 }}>"</div>
          </div>

          {/* Voiceover block */}
          <div style={{ borderLeft: "1px solid #BF8D3C", paddingLeft: "28px" }}>
            <p style={{ fontSize: "9px", letterSpacing: ".35em", color: "#BF8D3C", textTransform: "uppercase", marginBottom: "16px" }}>🎬 Cinematic Voiceover</p>
            <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "clamp(15px,2vw,18px)", color: "#9E9588", lineHeight: 1.9, fontWeight: 300, fontStyle: "italic", whiteSpace: "pre-line" }}>
              {VOICEOVER}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}