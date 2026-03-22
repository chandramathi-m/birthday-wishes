import { useState, useEffect, useRef } from "react";
import GoldDivider from "../common/GoldDivider";
import { bgPause, bgResume } from "../../utils/audioEvents";
import frndz from "../../assets/audio/frndz.mp3";

const CORNER_POSITIONS = [
  { top: 16, left: 16 },
  { top: 16, right: 16 },
  { bottom: 16, left: 16 },
  { bottom: 16, right: 16 },
];

/**
 * ChandraSecretMessage
 *
 * AUDIO BEHAVIOUR:
 *  • Tap to open  → pause mashaAllah (bg), play frndz.mp3
 *  • Scroll away  → pause frndz, resume mashaAllah
 *  • Scroll back  → resume frndz (if letter still open)
 */
export default function ChandraSecretMessage() {
  const [opened, setOpened] = useState(false);

  const frndzRef = useRef(null);   // frndz audio element
  const cardRef = useRef(null);   // wrapper div for IntersectionObserver
  const openedRef = useRef(false);  // ref copy so observer closure sees latest value

  // ── Build frndz audio element once ────────────────────────────────────────
  useEffect(() => {
    const audio = new Audio(frndz);
    audio.loop = true;
    audio.volume = 0.5;
    frndzRef.current = audio;
    return () => { audio.pause(); audio.src = ""; };
  }, []);

  // ── IntersectionObserver — watch the card entering / leaving viewport ─────
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        const audio = frndzRef.current;
        if (!audio || !openedRef.current) return;

        if (entry.isIntersecting) {
          // Card visible — frndz plays, mashaAllah stays paused
          audio.play().catch(() => { });
          bgPause();
        } else {
          // Card scrolled out — pause frndz, resume mashaAllah
          audio.pause();
          bgResume();
        }
      },
      { threshold: 0.2 }   // trigger when 20% of card is visible
    );

    if (cardRef.current) observer.observe(cardRef.current);
    return () => observer.disconnect();
  }, []);

  // ── Handle envelope tap ───────────────────────────────────────────────────
  const handleOpen = () => {
    setOpened(true);
    openedRef.current = true;

    // Pause mashaAllah, start frndz
    bgPause();
    const audio = frndzRef.current;
    if (!audio) return;

    // Muted-play trick to bypass autoplay policy
    audio.muted = true;
    audio.play()
      .then(() => { audio.muted = false; })
      .catch(() => {
        audio.muted = false;
        // Fallback: play on next user interaction (shouldn't happen
        // because the tap itself is a valid gesture)
      });
  };

  return (
    <div ref={cardRef} style={{ marginTop: "64px", display: "flex", flexDirection: "column", alignItems: "center" }}>

      {/* ── Section label ── */}
      <div style={{ textAlign: "center", marginBottom: "36px" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: "10px", padding: "8px 24px", border: "0.5px solid rgba(191,141,60,0.4)", borderRadius: "20px", background: "rgba(191,141,60,0.06)", marginBottom: "14px" }}>
          <span style={{ fontSize: "14px" }}>🔐</span>
          <p style={{ fontSize: "10px", letterSpacing: ".3em", color: "#BF8D3C", textTransform: "uppercase" }}>
            Secret Message · Unlocked
          </p>
          <span style={{ fontSize: "14px" }}>💌</span>
        </div>
        <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "22px", fontStyle: "italic", color: "#9E9588" }}>
          A letter from your best friend, <em style={{ color: "#BF8D3C" }}>Chandra</em>
        </p>
      </div>

      {/* ── Sealed envelope ── */}
      {!opened ? (
        <div
          onClick={handleOpen}
          style={{ position: "relative", cursor: "pointer", animation: "glowPulse 3s ease-in-out infinite" }}
        >
          <div
            onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.03)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
            style={{
              width: "360px", height: "230px",
              background: "linear-gradient(135deg, rgba(191,141,60,0.14) 0%, rgba(191,141,60,0.04) 100%)",
              border: "0.5px solid rgba(191,141,60,0.45)", borderRadius: "4px",
              display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
              gap: "14px", position: "relative", overflow: "hidden",
              transition: "transform .3s ease",
            }}
          >
            {/* Flap */}
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 0, borderBottom: "90px solid rgba(191,141,60,0.1)", borderLeft: "180px solid transparent", borderRight: "180px solid transparent", pointerEvents: "none" }} />

            <span style={{ fontSize: "40px", zIndex: 1 }}>💌</span>
            <p style={{ fontSize: "10px", letterSpacing: ".3em", color: "#BF8D3C", textTransform: "uppercase", zIndex: 1 }}>
              Tap to open
            </p>
            <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "16px", fontStyle: "italic", color: "#9E9588", zIndex: 1 }}>
              From Chandra, with love
            </p>

            {/* Wax seal */}
            <div style={{ position: "absolute", bottom: "-16px", width: "44px", height: "44px", background: "linear-gradient(135deg, #BF8D3C, #7A5218)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px", zIndex: 2, boxShadow: "0 2px 16px rgba(191,141,60,0.5)" }}>
              ✦
            </div>
          </div>
        </div>

      ) : (
        /* ── Opened letter ── */
        <div style={{
          maxWidth: "720px", width: "100%",
          background: "linear-gradient(160deg, rgba(191,141,60,0.09) 0%, rgba(10,8,3,1) 55%)",
          border: "0.5px solid rgba(191,141,60,0.38)", borderRadius: "4px",
          padding: "60px 56px", position: "relative", overflow: "hidden",
          animation: "envelopeOpen .65s cubic-bezier(.16,1,.3,1) both",
        }}>
          {/* Accent bars */}
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "2px", background: "linear-gradient(to right, transparent, #BF8D3C, transparent)" }} />
          <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "2px", background: "linear-gradient(to right, transparent, #BF8D3C, transparent)" }} />

          {/* Corner ornaments */}
          {CORNER_POSITIONS.map((pos, i) => (
            <div key={i} style={{
              position: "absolute", ...pos, width: "22px", height: "22px",
              borderTop: i < 2 ? "0.5px solid rgba(191,141,60,0.5)" : "none",
              borderBottom: i >= 2 ? "0.5px solid rgba(191,141,60,0.5)" : "none",
              borderLeft: i % 2 === 0 ? "0.5px solid rgba(191,141,60,0.5)" : "none",
              borderRight: i % 2 === 1 ? "0.5px solid rgba(191,141,60,0.5)" : "none",
            }} />
          ))}

          {/* Now playing badge */}
          <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", marginBottom: "28px", padding: "6px 14px", border: "0.5px solid rgba(191,141,60,0.3)", borderRadius: "20px", background: "rgba(191,141,60,0.06)" }}>
            <div style={{ display: "flex", gap: "2px", alignItems: "flex-end", height: "12px" }}>
              {[1, 1.4, 0.8, 1.2].map((s, i) => (
                <div key={i} style={{ width: "2px", height: "100%", background: "#BF8D3C", borderRadius: "1px", transformOrigin: "bottom", animation: `musicBounce ${0.5 * s}s ease-in-out infinite alternate`, animationDelay: `${i * 0.08}s` }} />
              ))}
            </div>
            <p style={{ fontSize: "9px", letterSpacing: ".25em", color: "#BF8D3C", textTransform: "uppercase" }}>
              Playing — Frndz
            </p>
          </div>

          <p style={{ fontSize: "9px", letterSpacing: ".38em", color: "#BF8D3C", textTransform: "uppercase", marginBottom: "32px" }}>
            💌 From Chandra · Your Best Friend
          </p>

          <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(16px,2.5vw,20px)", fontStyle: "italic", color: "#C4BAB0", lineHeight: 2, marginBottom: "24px" }}>
            Dear friend,
          </p>

          <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(16px,2.5vw,21px)", fontStyle: "italic", color: "#F2EDE4", lineHeight: 2, marginBottom: "24px" }}>
            "I may have been your senior once, but somewhere along the way, you became someone I genuinely look up to.
            Not because of your title, your muscles, or your dance moves — though yes, the dance moves are{" "}
            <em style={{ color: "#BF8D3C" }}>absolutely elite</em> — but because of how quietly and relentlessly you show up for yourself every single day.
          </p>

          <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(16px,2.5vw,21px)", fontStyle: "italic", color: "#F2EDE4", lineHeight: 2, marginBottom: "24px" }}>
            I didn't expect us to become this close. Three years in the same company, and yet it took just a few real conversations
            to feel like we'd known each other for a lifetime. Thank you for being the kind of friend who laughs loudly,
            listens deeply, and never makes you feel like a burden.
          </p>

          <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(16px,2.5vw,21px)", fontStyle: "italic", color: "#F2EDE4", lineHeight: 2, marginBottom: "40px" }}>
            The gym is your world. Dance is your soul. Friendship is your gift. On your birthday, I want you to know — the world is better,
            louder, and so much{" "}<em style={{ color: "#BF8D3C" }}>more alive</em>{" "}with you in it.
            Keep building. Keep dancing. Keep being unapologetically{" "}<em style={{ color: "#BF8D3C" }}>you.</em>"
          </p>

          <GoldDivider style={{ marginBottom: "28px" }} />

          <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: "16px" }}>
            <div style={{ textAlign: "right" }}>
              <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "24px", fontStyle: "italic", color: "#BF8D3C" }}>Chandra</p>
              <p style={{ fontSize: "10px", letterSpacing: ".25em", color: "#9E9588", textTransform: "uppercase" }}>Your Best Friend · Always  🩷 </p>
            </div>
            <div style={{ width: "52px", height: "52px", background: "linear-gradient(135deg, rgba(191,141,60,0.3), rgba(191,141,60,0.08))", borderRadius: "50%", border: "0.5px solid rgba(191,141,60,0.4)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "24px" }}>
              🩷
            </div>
          </div>
        </div>
      )}
    </div>
  );
}