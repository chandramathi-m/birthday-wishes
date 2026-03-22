import { useReveal } from "../../hooks/useReveal";
import GoldDivider from "../common/GoldDivider";
import CinematicPlayer from "../common/CinematicPlayer";
import { GYM_STATS, GYM_TRANSFORMATION_QUOTES, GYM_REEL } from "../../constants/data";
import gymreels from "../../assets/videos/gymreel2.mp4";

export default function GymReelSection() {
  const ref = useReveal();

  return (
    <section id="reel" ref={ref} style={{ padding: "120px 24px", background: "#060606", position: "relative", overflow: "hidden" }}>

      {/* Film perforations — left & right edges */}
      {[0, 1].map((side) => (
        <div key={side} style={{ position: "absolute", top: 0, bottom: 0, [side === 0 ? "left" : "right"]: 0, width: "28px", display: "flex", flexDirection: "column", justifyContent: "space-evenly", alignItems: "center", zIndex: 2 }}>
          {Array.from({ length: 18 }).map((_, i) => (
            <div key={i} style={{ width: "14px", height: "10px", borderRadius: "2px", background: "rgba(191,141,60,.07)", border: "0.5px solid rgba(191,141,60,.11)" }} />
          ))}
        </div>
      ))}

      <div style={{ maxWidth: "1000px", margin: "0 auto", position: "relative", zIndex: 3 }}>

        {/* ── Header ── */}
        <div className="reveal" style={{ textAlign: "center", marginBottom: "64px" }}>
          <p style={{ fontSize: "10px", letterSpacing: ".4em", color: "#BF8D3C", textTransform: "uppercase", marginBottom: "16px" }}>
            🎬 &nbsp; Transformation
          </p>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(36px,6vw,64px)", fontWeight: 300, color: "#F2EDE4", letterSpacing: "-0.02em", lineHeight: 1.1 }}>
            The Man He <em style={{ fontStyle: "italic", color: "#BF8D3C" }}>Built</em>
          </h2>
          <p style={{ fontSize: "clamp(14px,2vw,17px)", color: "#9E9588", lineHeight: 1.8, maxWidth: "540px", margin: "20px auto 0" }}>
            Same person. Different story. Watch how he rewrote everything — one rep, one day, one decision at a time.
          </p>
          <GoldDivider style={{ maxWidth: "280px", margin: "36px auto 0" }} />
        </div>

        {/* ── Before / After label strip ── */}
        <div className="reveal reveal-delay-1" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", marginBottom: "0", border: "0.5px solid rgba(191,141,60,.2)", borderBottom: "none", borderRadius: "2px 2px 0 0", overflow: "hidden" }}>
          {["✦  Before", "Now  ✦"].map((label, i) => (
            <div key={i} style={{
              padding: "14px 24px",
              background: i === 0 ? "rgba(191,141,60,.04)" : "rgba(191,141,60,.1)",
              borderRight: i === 0 ? "0.5px solid rgba(191,141,60,.2)" : "none",
              display: "flex", alignItems: "center",
              justifyContent: i === 0 ? "flex-start" : "flex-end",
            }}>
              <span style={{ fontSize: "10px", letterSpacing: ".35em", color: i === 0 ? "#9E9588" : "#BF8D3C", textTransform: "uppercase", fontFamily: "'Jost', sans-serif" }}>
                {label}
              </span>
            </div>
          ))}
        </div>

        {/* ── Full-width video player ── */}
        <div className="reveal reveal-delay-2">
          <CinematicPlayer
            src={gymreels}
            poster={GYM_REEL.poster}
            title={GYM_REEL.title}
            subtitle={GYM_REEL.subtitle}
          />
        </div>

        {/* ── Before / After quote cards ── */}
        <div className="reveal reveal-delay-3" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2px", marginTop: "2px" }}>
          {GYM_TRANSFORMATION_QUOTES.map(({ phase, icon, title, text }, i) => (
            <div key={i} style={{
              padding: "36px 32px",
              background: i === 0 ? "rgba(191,141,60,.04)" : "rgba(191,141,60,.08)",
              border: "0.5px solid rgba(191,141,60,.18)",
              borderRadius: i === 0 ? "0 0 0 2px" : "0 0 2px 0",
              position: "relative", overflow: "hidden",
            }}>
              {/* Phase watermark */}
              <span style={{ position: "absolute", top: "-10px", right: "16px", fontFamily: "'Cormorant Garamond', serif", fontSize: "80px", fontWeight: 600, color: "rgba(191,141,60,.05)", lineHeight: 1, pointerEvents: "none", userSelect: "none" }}>
                {phase}
              </span>

              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
                <span style={{ fontSize: "22px" }}>{icon}</span>
                <div>
                  <p style={{ fontSize: "9px", letterSpacing: ".3em", color: "#BF8D3C", textTransform: "uppercase" }}>{phase}</p>
                  <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "20px", fontWeight: 400, color: "#F2EDE4", lineHeight: 1.2 }}>{title}</p>
                </div>
              </div>

              <p style={{ fontSize: "15px", color: "#9E9588", lineHeight: 1.85, fontWeight: 300, position: "relative", zIndex: 1 }}>
                {text}
              </p>
            </div>
          ))}
        </div>

        {/* ── Stats row ── */}
        <div className="reveal reveal-delay-4" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "2px", marginTop: "24px" }}>
          {GYM_STATS.map(({ icon, val, label }) => (
            <div key={label} style={{
              padding: "24px 16px",
              background: "rgba(191,141,60,.04)",
              border: "0.5px solid rgba(191,141,60,.12)",
              borderRadius: "2px",
              textAlign: "center",
              transition: "all .3s ease",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(191,141,60,.1)"; e.currentTarget.style.borderColor = "rgba(191,141,60,.3)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(191,141,60,.04)"; e.currentTarget.style.borderColor = "rgba(191,141,60,.12)"; }}
            >
              <p style={{ fontSize: "22px", marginBottom: "8px" }}>{icon}</p>
              <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "26px", fontWeight: 500, color: "#F2EDE4", letterSpacing: "-0.01em" }}>{val}</p>
              <p style={{ fontSize: "9px", letterSpacing: ".2em", color: "#9E9588", textTransform: "uppercase", marginTop: "6px" }}>{label}</p>
            </div>
          ))}
        </div>

        {/* ── Closing pull-quote ── */}
        <div className="reveal reveal-delay-5" style={{ textAlign: "center", marginTop: "56px" }}>
          <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(20px,3.5vw,32px)", fontStyle: "italic", color: "#F2EDE4", lineHeight: 1.6, maxWidth: "680px", margin: "0 auto" }}>
            "He didn't just change his body —<br />
            <em style={{ color: "#BF8D3C" }}>he changed his entire story."</em>
          </p>
        </div>
      </div>
    </section>
  );
}
