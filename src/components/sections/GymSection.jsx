import { useReveal } from "../../hooks/useReveal";
import { GYM_IMAGES, GYM_EQUATION_SLIDES } from "../../constants/data";

export default function GymSection() {
  const ref = useReveal();

  return (
    <section id="gym" ref={ref} style={{ padding: "120px 24px", background: "linear-gradient(180deg,#080808 0%,#0e0a04 50%,#080808 100%)", position: "relative", overflow: "hidden" }}>

      {/* Watermark */}
      <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", fontFamily: "'Cormorant Garamond',serif", fontSize: "clamp(80px,20vw,220px)", fontWeight: 600, color: "rgba(191,141,60,.04)", letterSpacing: "-0.05em", whiteSpace: "nowrap", pointerEvents: "none", userSelect: "none" }}>
        STRENGTH
      </div>

      <div style={{ maxWidth: "1100px", margin: "0 auto", position: "relative", zIndex: 1 }}>

        {/* Header */}
        <div className="reveal" style={{ textAlign: "center", marginBottom: "80px" }}>
          <p style={{ fontSize: "10px", letterSpacing: ".4em", color: "#BF8D3C", textTransform: "uppercase", marginBottom: "16px" }}>Chapter Two</p>
          <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "clamp(40px,7vw,72px)", fontWeight: 300, color: "#F2EDE4", letterSpacing: "-0.02em", lineHeight: 1.1, marginBottom: "12px" }}>
            The <em style={{ fontStyle: "italic", color: "#BF8D3C" }}>Transformation</em>
          </h2>
          <p style={{ fontSize: "10px", letterSpacing: ".4em", color: "#BF8D3C", textTransform: "uppercase" }}>
            🏋️‍♂️ Strength Became His Identity
          </p>
        </div>

        {/* Image collage + equation grid */}
        <div className="reveal reveal-delay-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "40px", marginBottom: "60px", alignItems: "stretch" }}>

          {/* Photo collage */}
          <div style={{ display: "grid", gridTemplateRows: "1.4fr 1fr", gap: "4px", minHeight: "420px" }}>
            <div style={{ overflow: "hidden", borderRadius: "2px", position: "relative" }}>
              <img src={GYM_IMAGES[0]} alt="Gym" className="img-cinematic" />
              <div style={{ position: "absolute", inset: "10px", border: "0.5px solid rgba(191,141,60,.3)", borderRadius: "1px", pointerEvents: "none" }} />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4px" }}>
              {GYM_IMAGES.slice(1).map((src, i) => (
                <div key={i} style={{ overflow: "hidden", borderRadius: "2px" }}>
                  <img src={src} alt="Gym" className="img-cinematic" />
                </div>
              ))}
            </div>
          </div>

          {/* Equation cards */}
          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            {GYM_EQUATION_SLIDES.map((s, i) => (
              <div
                key={i}
                style={{ flex: 1, background: "rgba(191,141,60,.05)", border: "0.5px solid rgba(191,141,60,.15)", padding: "20px 28px", display: "flex", alignItems: "center", justifyContent: "space-between", transition: "all .3s ease", cursor: "default", borderRadius: "1px" }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(191,141,60,.12)"; e.currentTarget.style.borderColor = "rgba(191,141,60,.4)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(191,141,60,.05)"; e.currentTarget.style.borderColor = "rgba(191,141,60,.15)"; }}
              >
                <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "20px", color: "#9E9588" }}>{s.label}</p>
                <p style={{ fontSize: "18px", color: "rgba(191,141,60,.6)" }}>→</p>
                <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "24px", fontWeight: 500, color: "#F2EDE4" }}>{s.result}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Body text */}
        <div className="reveal reveal-delay-3" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "40px" }}>
          <p style={{ fontSize: "clamp(14px,2vw,16px)", color: "#9E9588", lineHeight: 1.9, fontWeight: 300 }}>
            Life changed when he decided to step into the gym — not just to transform his body, but to transform his mind and life. For him, the gym is not just a place — it is his world, his therapy, his peace.
          </p>
          <p style={{ fontSize: "clamp(14px,2vw,16px)", color: "#9E9588", lineHeight: 1.9, fontWeight: 300 }}>
            Pain doesn't break him — it <em style={{ fontStyle: "italic", color: "#BF8D3C" }}>fuels</em> him. Every drop of sweat, every bit of pain, gives him happiness and strength. Today, he stands confident and transformed — living like a fighter who never gave up.
          </p>
        </div>
      </div>
    </section>
  );
}