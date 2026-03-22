import { useState, useEffect, useRef } from "react";
import GoldDivider from "../common/GoldDivider";
import { NEXT_BIRTHDAY, BIRTHDAY_DISPLAY } from "../../constants/config";

function pad(n) {
  return String(Math.max(0, Math.floor(n))).padStart(2, "0");
}

const TIME_UNITS = ["Days", "Hours", "Minutes", "Seconds"];

export default function CountdownSection() {
  const [time, setTime] = useState({ d: 0, h: 0, m: 0, s: 0 });

  useEffect(() => {
    const tick = () => {
      const diff = NEXT_BIRTHDAY - Date.now();
      if (diff <= 0) { setTime({ d: 0, h: 0, m: 0, s: 0 }); return; }
      setTime({
        d: Math.floor(diff / 86400000),
        h: Math.floor((diff % 86400000) / 3600000),
        m: Math.floor((diff % 3600000)  / 60000),
        s: Math.floor((diff % 60000)    / 1000),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const units = [
    { val: time.d, label: "Days" },
    { val: time.h, label: "Hours" },
    { val: time.m, label: "Minutes" },
    { val: time.s, label: "Seconds" },
  ];

  return (
    <section style={{ padding: "80px 24px", background: "linear-gradient(180deg,#080808 0%,#0a0800 50%,#080808 100%)", position: "relative", overflow: "hidden" }}>

      {/* Faint watermark */}
      <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", fontFamily: "'Cormorant Garamond',serif", fontSize: "clamp(60px,15vw,160px)", fontWeight: 600, color: "rgba(191,141,60,0.04)", whiteSpace: "nowrap", pointerEvents: "none", userSelect: "none", letterSpacing: "-0.04em" }}>
        COUNTING DOWN
      </div>

      <div style={{ maxWidth: "900px", margin: "0 auto", position: "relative", zIndex: 1, textAlign: "center" }}>
        <p style={{ fontSize: "10px", letterSpacing: "0.4em", color: "#BF8D3C", textTransform: "uppercase", marginBottom: "12px" }}>
          🎂 &nbsp; Birthday
        </p>
        <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "clamp(22px,4vw,38px)", fontWeight: 300, color: "#F2EDE4", marginBottom: "48px", fontStyle: "italic" }}>
          {BIRTHDAY_DISPLAY} — The Celebration Awaits
        </p>

        {/* Digit cards */}
        <div style={{ display: "flex", justifyContent: "center", gap: "clamp(12px,3vw,36px)", flexWrap: "wrap" }}>
          {units.map(({ val, label }) => (
            <div key={label} style={{ display: "flex", flexDirection: "column", alignItems: "center", minWidth: "90px" }}>
              {/* Flip card */}
              <div style={{ width: "clamp(72px,12vw,104px)", height: "clamp(72px,12vw,104px)", background: "linear-gradient(160deg,rgba(191,141,60,0.12) 0%,rgba(10,8,3,1) 100%)", border: "0.5px solid rgba(191,141,60,0.35)", borderRadius: "6px", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden", animation: "borderGlow 4s ease-in-out infinite" }}>
                {/* Scan line */}
                <div style={{ position: "absolute", left: 0, right: 0, height: "1px", background: "linear-gradient(to right,transparent,rgba(191,141,60,0.35),transparent)", animation: "reelScan 2s linear infinite" }} />
                <span key={val} style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "clamp(32px,6vw,52px)", fontWeight: 500, color: "#F2EDE4", letterSpacing: "-0.02em", animation: "countFlip .35s ease both" }}>
                  {pad(val)}
                </span>
              </div>

              {/* Dot row */}
              <div style={{ display: "flex", gap: "4px", margin: "10px 0 6px" }}>
                {[...Array(3)].map((_, i) => (
                  <div key={i} style={{ width: "3px", height: "3px", borderRadius: "50%", background: `rgba(191,141,60,${0.3 + i * 0.25})` }} />
                ))}
              </div>
              <p style={{ fontSize: "9px", letterSpacing: "0.3em", color: "#BF8D3C", textTransform: "uppercase" }}>{label}</p>
            </div>
          ))}
        </div>

        <GoldDivider style={{ marginTop: "48px", maxWidth: "400px", margin: "48px auto 0" }} />
        <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "clamp(16px,2.5vw,20px)", fontStyle: "italic", color: "#9E9588", marginTop: "24px" }}>
          Every second counts down to another reason to celebrate this extraordinary life.
        </p>
      </div>
    </section>
  );
}