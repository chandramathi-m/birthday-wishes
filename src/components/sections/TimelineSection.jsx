import { useState, useEffect, useRef, useCallback } from "react";
import { useReveal } from "../../hooks/useReveal";
import { STORY_SLIDES } from "../../constants/data";

export default function TimelineSection() {
  const ref = useReveal();
  const [current,   setCurrent]   = useState(0);
  const [animating, setAnimating] = useState(false);
  const timerRef = useRef(null);

  const go = useCallback((dir) => {
    if (animating) return;
    setAnimating(true);
    setCurrent((p) => (p + dir + STORY_SLIDES.length) % STORY_SLIDES.length);
    setTimeout(() => setAnimating(false), 500);
  }, [animating]);

  const resetAndGo = (fn) => {
    clearInterval(timerRef.current);
    fn();
    timerRef.current = setInterval(() => go(1), 4500);
  };

  useEffect(() => {
    timerRef.current = setInterval(() => go(1), 4500);
    return () => clearInterval(timerRef.current);
  }, [go]);

  const prevIdx = (current - 1 + STORY_SLIDES.length) % STORY_SLIDES.length;
  const nextIdx = (current + 1) % STORY_SLIDES.length;
  const s = STORY_SLIDES[current];

  return (
    <section style={{ padding: "120px 0", background: "#060606", overflow: "hidden" }}>
      <div ref={ref} style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 24px" }}>

        {/* Header */}
        <div className="reveal" style={{ textAlign: "center", marginBottom: "64px" }}>
          <p style={{ fontSize: "10px", letterSpacing: ".4em", color: "#BF8D3C", textTransform: "uppercase", marginBottom: "16px" }}>
            📱 Story Slides
          </p>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(36px,6vw,64px)", fontWeight: 300, color: "#F2EDE4", letterSpacing: "-0.02em" }}>
            The <em style={{ fontStyle: "italic", color: "#BF8D3C" }}>Reel</em> of a Life
          </h2>
        </div>

        <div className="reveal reveal-delay-2">

          {/* ── 3-card carousel ── */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "20px", marginBottom: "40px" }}>

            {/* Prev preview */}
            <div
              onClick={() => resetAndGo(() => go(-1))}
              style={{ flexShrink: 0, width: "160px", height: "290px", borderRadius: "10px", overflow: "hidden", opacity: 0.38, transform: "scale(.86)", transition: "all .5s ease", cursor: "pointer", filter: "brightness(.55)" }}
            >
              <img src={STORY_SLIDES[prevIdx].img} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>

            {/* Active card */}
            <div
              key={`slide-${current}`}
              style={{ flexShrink: 0, width: "310px", height: "540px", borderRadius: "18px", overflow: "hidden", position: "relative", boxShadow: "0 28px 80px rgba(0,0,0,.85), 0 0 50px rgba(191,141,60,.12)", border: "0.5px solid rgba(191,141,60,.45)", animation: "fadeIn .45s ease both" }}
            >
              <img src={s.img} alt={s.slide} style={{ width: "100%", height: "100%", objectFit: "cover", filter: "brightness(.4) saturate(.65)" }} />
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(8,8,8,.96) 0%, rgba(8,8,8,.25) 55%, rgba(8,8,8,.18) 100%)" }} />
              <div style={{ position: "absolute", inset: "18px", border: "0.5px solid rgba(191,141,60,.38)", borderRadius: "10px", pointerEvents: "none" }} />
              <p style={{ position: "absolute", top: "28px", left: "28px", fontSize: "9px", letterSpacing: ".38em", color: "rgba(191,141,60,.75)", textTransform: "uppercase" }}>
                {s.slide} / {STORY_SLIDES.length}
              </p>
              <p style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%) translateY(-36px)", fontSize: "52px" }}>
                {s.icon}
              </p>
              <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "32px 28px" }}>
                <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "22px", color: "#F2EDE4", lineHeight: 1.55, fontStyle: "italic", fontWeight: 300, whiteSpace: "pre-line", textShadow: "0 2px 16px rgba(0,0,0,.9)" }}>
                  {s.text}
                </p>
              </div>
            </div>

            {/* Next preview */}
            <div
              onClick={() => resetAndGo(() => go(1))}
              style={{ flexShrink: 0, width: "160px", height: "290px", borderRadius: "10px", overflow: "hidden", opacity: 0.38, transform: "scale(.86)", transition: "all .5s ease", cursor: "pointer", filter: "brightness(.55)" }}
            >
              <img src={STORY_SLIDES[nextIdx].img} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
          </div>

          {/* ── Prev / Dot indicators / Next ── */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "20px" }}>
            <NavBtn onClick={() => resetAndGo(() => go(-1))}>‹</NavBtn>

            <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
              {STORY_SLIDES.map((_, i) => (
                <button
                  key={i}
                  onClick={() => resetAndGo(() => setCurrent(i))}
                  style={{ width: i === current ? "24px" : "6px", height: "6px", borderRadius: "3px", background: i === current ? "#BF8D3C" : "rgba(191,141,60,.25)", border: "none", cursor: "pointer", padding: 0, transition: "all .4s ease" }}
                />
              ))}
            </div>

            <NavBtn onClick={() => resetAndGo(() => go(1))}>›</NavBtn>
          </div>

          {/* ── Thumbnail filmstrip ── */}
          <div style={{ display: "flex", gap: "8px", justifyContent: "center", marginTop: "28px", overflowX: "auto", padding: "4px 0" }}>
            {STORY_SLIDES.map((sl, i) => (
              <div
                key={i}
                onClick={() => resetAndGo(() => setCurrent(i))}
                style={{ width: "52px", height: "80px", flexShrink: 0, borderRadius: "6px", overflow: "hidden", cursor: "pointer", border: i === current ? "1.5px solid #BF8D3C" : "1px solid rgba(191,141,60,.15)", opacity: i === current ? 1 : 0.42, transition: "all .3s ease", transform: i === current ? "scale(1.1)" : "scale(1)" }}
              >
                <img src={sl.img} alt={sl.slide} style={{ width: "100%", height: "100%", objectFit: "cover", filter: "brightness(.65)" }} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* Small arrow button shared by prev/next */
function NavBtn({ onClick, children }) {
  return (
    <button
      onClick={onClick}
      onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(191,141,60,.15)")}
      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
      style={{ width: "44px", height: "44px", borderRadius: "50%", border: "0.5px solid rgba(191,141,60,.4)", background: "transparent", color: "#BF8D3C", fontSize: "20px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "all .3s ease" }}
    >
      {children}
    </button>
  );
}