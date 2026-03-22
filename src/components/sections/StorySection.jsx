import { useReveal } from "../../hooks/useReveal";
import GoldDivider from "../common/GoldDivider";
import { STORY_CHAPTERS } from "../../constants/data";

export default function StorySection() {
  const ref = useReveal();

  return (
    <section id="story" ref={ref} style={{ padding: "100px 24px", maxWidth: "1100px", margin: "0 auto" }}>
      <div className="reveal" style={{ textAlign: "center", marginBottom: "80px" }}>
        <p style={{ fontSize: "10px", letterSpacing: ".4em", color: "#BF8D3C", textTransform: "uppercase", marginBottom: "16px" }}>Chapter One</p>
        <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "clamp(36px,6vw,64px)", fontWeight: 300, color: "#F2EDE4", letterSpacing: "-0.02em" }}>
          The Story of <em style={{ fontStyle: "italic", color: "#BF8D3C" }}>Growth</em>
        </h2>
        <GoldDivider style={{ marginTop: "32px", maxWidth: "400px", margin: "32px auto 0" }} />
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "80px" }}>
        {STORY_CHAPTERS.map((ch, i) => (
          <div key={ch.num} className={`reveal reveal-delay-${i + 1}`} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "56px", alignItems: "center" }}>

            {/* Image left on even */}
            {i % 2 === 0 && <ChapterImage ch={ch} />}

            {/* Text */}
            <div style={{ position: "relative" }}>
              <span style={{ position: "absolute", top: "-40px", right: i % 2 === 0 ? "auto" : "-10px", left: i % 2 === 0 ? "-10px" : "auto", fontFamily: "'Cormorant Garamond',serif", fontSize: "clamp(80px,12vw,130px)", fontWeight: 600, color: "rgba(191,141,60,.05)", lineHeight: 1, pointerEvents: "none", userSelect: "none" }}>{ch.num}</span>
              <div style={{ background: "linear-gradient(135deg,rgba(191,141,60,.07) 0%,transparent 100%)", border: "0.5px solid rgba(191,141,60,.18)", borderRadius: "2px", padding: "36px", position: "relative", zIndex: 1, marginBottom: "24px" }}>
                <p style={{ fontSize: "26px", marginBottom: "12px" }}>{ch.icon}</p>
                <h3 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "clamp(22px,3vw,32px)", fontWeight: 400, color: "#F2EDE4", lineHeight: 1.2, marginBottom: "6px" }}>{ch.title}</h3>
                <p style={{ fontSize: "10px", letterSpacing: ".3em", color: "#BF8D3C", textTransform: "uppercase" }}>{ch.date}</p>
              </div>
              <p style={{ fontSize: "clamp(14px,1.8vw,16px)", color: "#9E9588", lineHeight: 1.9, fontWeight: 300 }}>{ch.content}</p>
            </div>

            {/* Image right on odd */}
            {i % 2 !== 0 && <ChapterImage ch={ch} />}
          </div>
        ))}
      </div>
    </section>
  );
}

function ChapterImage({ ch }) {
  return (
    <div style={{ position: "relative", overflow: "hidden", borderRadius: "2px", aspectRatio: "4/5" }}>
      <img src={ch.img} alt={ch.title} className="img-cinematic" />
      <div style={{ position: "absolute", inset: "12px", border: "0.5px solid rgba(191,141,60,.4)", borderRadius: "1px", pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "50%", background: "linear-gradient(to top,rgba(8,8,8,.75),transparent)", pointerEvents: "none" }} />
      <p style={{ position: "absolute", bottom: "18px", left: "18px", fontSize: "9px", letterSpacing: ".3em", color: "#BF8D3C", textTransform: "uppercase" }}>{ch.num} · {ch.date}</p>
    </div>
  );
}