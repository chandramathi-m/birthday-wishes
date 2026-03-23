import { useState, useEffect, useRef, useCallback } from "react";

// ── Config ────────────────────────────────────────────────────────────────────
// 🧪 TEST MODE — set true to trigger reveal immediately for local testing
//               remember to set back to false before the real birthday!
const TEST_MODE      = false;

const BIRTHDAY_MONTH = 3;   // 0-indexed: 7 = August
const BIRTHDAY_DAY   = 11;
const LS_KEY         = "bt_midnight_seen_2026";

// Birthday song — swap this import for your own file
import birthdaySong from "../../assets/audio/mashaAllah.mp3";

// His photo — swap for the real birthday photo
import { thalapathystyle } from "../../constants/data";
const BIRTHDAY_PHOTO = thalapathystyle;

// Personalised typewriter message — edit freely
const BIRTHDAY_MESSAGE = [
  "Hey… you didn't think we'd let midnight pass quietly, did you?",
  "Twenty-something years ago, your parents waited nearly two decades for you.",
  "And tonight — at exactly this moment — the world stopped to say...",
  "You are the most extraordinary person in every room you walk into.",
  "The gym gave you strength. Dance gave you a soul.",
  "But it's YOU who gave everyone around you a reason to smile.",
  "Keep building. Keep dancing. Keep being unapologetically yourself.",
  "This page, this tribute, this night — all of it is for you.",
  "Happy Birthday, Sheik Abdullah Sheriff H. 🎂✨",
];

// ── Helpers ───────────────────────────────────────────────────────────────────
function isBirthday() {
  if (TEST_MODE) return true;  // 🧪 always true in test mode
  const now = new Date();
  return now.getMonth() === BIRTHDAY_MONTH && now.getDate() === BIRTHDAY_DAY;
}

function msUntilMidnight() {
  const now  = new Date();
  const next = new Date(now);
  next.setHours(24, 0, 0, 0);
  return next - now;
}

function hasBeenSeen() {
  if (TEST_MODE) return false; // 🧪 never skip in test mode
  try { return !!localStorage.getItem(LS_KEY); } catch { return false; }
}

function markSeen() {
  try { localStorage.setItem(LS_KEY, "1"); } catch {}
}

function clearSeen() {
  try { localStorage.removeItem(LS_KEY); } catch {}
}

// ── Firework particle generator ───────────────────────────────────────────────
function makeParticles(count = 120) {
  return Array.from({ length: count }, (_, i) => ({
    id:    i,
    x:     Math.random() * 100,
    y:     Math.random() * 60 + 5,
    size:  Math.random() * 8 + 4,
    color: ["#BF8D3C","#F0C97A","#F2EDE4","#E8B86D","#FFD700","#FFF4C2",
            "#FF6B6B","#FF9F43","#A29BFE","#74B9FF"][Math.floor(Math.random() * 10)],
    angle: Math.random() * 360,
    speed: Math.random() * 3 + 1.5,
    delay: Math.random() * 2,
    shape: Math.random() > 0.6 ? "circle" : Math.random() > 0.5 ? "star" : "rect",
  }));
}

// ── Typewriter hook ───────────────────────────────────────────────────────────
function useTypewriter(lines, active, speed = 38) {
  const [displayed, setDisplayed] = useState([]);
  const [lineIdx,   setLineIdx]   = useState(0);
  const [charIdx,   setCharIdx]   = useState(0);
  const [done,      setDone]      = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    if (!active) return;
    setDisplayed([]); setLineIdx(0); setCharIdx(0); setDone(false);
  }, [active]);

  useEffect(() => {
    if (!active || done) return;
    if (lineIdx >= lines.length) { setDone(true); return; }

    const line = lines[lineIdx];
    if (charIdx < line.length) {
      timerRef.current = setTimeout(() => setCharIdx(c => c + 1), speed);
    } else {
      timerRef.current = setTimeout(() => {
        setDisplayed(d => [...d, line]);
        setLineIdx(l => l + 1);
        setCharIdx(0);
      }, 600);
    }
    return () => clearTimeout(timerRef.current);
  }, [active, lineIdx, charIdx, done, lines, speed]);

  const currentPartial = active && lineIdx < lines.length
    ? lines[lineIdx].slice(0, charIdx)
    : "";

  return { displayed, currentPartial, done };
}

// ── Main component ────────────────────────────────────────────────────────────
export default function MidnightReveal() {
  // States: "idle" | "locked" | "unlocking" | "open" | "hidden"
  const [phase,      setPhase]      = useState("idle");
  const [particles,  setParticles]  = useState([]);
  const [photoGlow,  setPhotoGlow]  = useState(false);
  const [showReplay, setShowReplay] = useState(false);
  const audioRef = useRef(null);
  const timerRef = useRef(null);

  // ── Typewriter ──────────────────────────────────────────────────────────────
  const { displayed, currentPartial, done: twDone } = useTypewriter(
    BIRTHDAY_MESSAGE,
    phase === "open"
  );

  // ── Audio ───────────────────────────────────────────────────────────────────
  const startSong = useCallback(() => {
    if (!audioRef.current) {
      const a = new Audio(birthdaySong);
      a.loop = true; a.volume = 0.45;
      audioRef.current = a;
    }
    audioRef.current.muted = true;
    audioRef.current.play().then(() => {
      audioRef.current.muted = false;
    }).catch(() => {});
  }, []);

  const stopSong = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  }, []);

  // ── Unlock sequence ─────────────────────────────────────────────────────────
  const runUnlockSequence = useCallback(() => {
    setPhase("unlocking");
    setParticles(makeParticles(140));

    timerRef.current = setTimeout(() => {
      setPhase("open");
      startSong();
      setTimeout(() => setPhotoGlow(true), 400);
      setTimeout(() => setShowReplay(false), 500);
    }, 2200);
  }, [startSong]);

  // ── Initialise on mount ─────────────────────────────────────────────────────
  useEffect(() => {
    if (!isBirthday()) {
      // Not his birthday — show a "locked until birthday" teaser in the page
      setPhase("hidden");
      return;
    }

    if (hasBeenSeen()) {
      // Already seen — show replay button only
      setPhase("hidden");
      setShowReplay(true);
      return;
    }

    // It IS his birthday and user hasn't seen it yet
    // If it's already past midnight (i.e. it IS Aug 28 already), unlock immediately
    const now = new Date();
    if (now.getHours() === 0 && now.getMinutes() === 0) {
      // Right at midnight
      setPhase("locked");
      setTimeout(() => runUnlockSequence(), 800);
    } else if (now.getHours() >= 0) {
      // Sometime during Aug 28 — show locked chest, then auto-unlock after 1.5s
      setPhase("locked");
      timerRef.current = setTimeout(() => runUnlockSequence(), 1500);
    }

    return () => clearTimeout(timerRef.current);
  }, [runUnlockSequence]);

  // ── Wait for midnight on non-birthday ──────────────────────────────────────
  useEffect(() => {
    // Calculate if next midnight IS Aug 28
    const now   = new Date();
    const next  = new Date(now); next.setHours(24, 0, 0, 0);
    if (next.getMonth() === BIRTHDAY_MONTH && next.getDate() === BIRTHDAY_DAY) {
      const ms = next - now;
      const t = setTimeout(() => {
        setPhase("locked");
        setTimeout(() => runUnlockSequence(), 800);
      }, ms);
      return () => clearTimeout(t);
    }
  }, [runUnlockSequence]);

  const handleClose = () => {
    markSeen();
    stopSong();
    setPhase("hidden");
    setShowReplay(true);
    setPhotoGlow(false);
  };

  const handleReplay = () => {
    clearSeen();
    setShowReplay(false);
    setPhotoGlow(false);
    setParticles([]);
    setPhase("locked");
    setTimeout(() => runUnlockSequence(), 800);
  };

  // ── Render: replay button only ──────────────────────────────────────────────
  if (phase === "hidden") {
    if (!showReplay) return null;
    return (
      <button onClick={handleReplay} style={{
        position: "fixed", bottom: "32px", right: "32px", zIndex: 300,
        display: "flex", alignItems: "center", gap: "8px",
        padding: "10px 20px", borderRadius: "20px",
        background: "rgba(191,141,60,0.15)",
        border: "0.5px solid rgba(191,141,60,0.5)",
        backdropFilter: "blur(12px)",
        cursor: "pointer", transition: "all .3s ease",
        animation: "glowPulse 3s ease-in-out infinite",
      }}
      onMouseEnter={e => e.currentTarget.style.background = "rgba(191,141,60,0.28)"}
      onMouseLeave={e => e.currentTarget.style.background = "rgba(191,141,60,0.15)"}
      >
        <span style={{ fontSize: "16px" }}>🎂</span>
        <span style={{ fontSize: "10px", letterSpacing: "0.2em", color: "#BF8D3C", textTransform: "uppercase", fontFamily: "'Jost', sans-serif" }}>
          Replay Birthday Reveal
        </span>
      </button>
    );
  }

  // ── Render: nothing until birthday ─────────────────────────────────────────
  if (phase === "idle") return null;

  // ── Render: full-screen overlay ─────────────────────────────────────────────
  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 1000,
      background: phase === "open"
        ? "linear-gradient(160deg, #0a0700 0%, #050300 60%, #0d0a04 100%)"
        : "#050300",
      display: "flex", alignItems: "center", justifyContent: "center",
      overflow: "hidden",
      transition: "background 1s ease",
    }}>

      {/* ── Fireworks / confetti ── */}
      {(phase === "unlocking" || phase === "open") && particles.map(p => (
        <div key={p.id} style={{
          position: "absolute",
          left: `${p.x}%`,
          top:  `${p.y}%`,
          width:  p.shape === "rect" ? `${p.size * 0.6}px` : `${p.size}px`,
          height: p.size + "px",
          background: p.color,
          borderRadius: p.shape === "circle" ? "50%" : p.shape === "rect" ? "1px" : "0",
          clipPath: p.shape === "star"
            ? "polygon(50% 0%,61% 35%,98% 35%,68% 57%,79% 91%,50% 70%,21% 91%,32% 57%,2% 35%,39% 35%)"
            : "none",
          transform: `rotate(${p.angle}deg)`,
          animation: `confettiFall ${p.speed}s ease-in ${p.delay}s both`,
          pointerEvents: "none",
        }} />
      ))}

      {/* ── Radial gold glow behind content ── */}
      {phase === "open" && (
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          background: "radial-gradient(ellipse at center, rgba(191,141,60,0.12) 0%, transparent 65%)",
          animation: "pulse 4s ease-in-out infinite",
        }} />
      )}

      {/* ── LOCKED CHEST ── */}
      {phase === "locked" && (
        <div style={{
          display: "flex", flexDirection: "column", alignItems: "center", gap: "32px",
          animation: "fadeUp 0.8s ease both",
        }}>
          {/* Chest */}
          <div style={{
            fontSize: "100px", lineHeight: 1,
            animation: "chestPulse 1.2s ease-in-out infinite",
            filter: "drop-shadow(0 0 30px rgba(191,141,60,0.7))",
          }}>🔒</div>
          <div style={{ textAlign: "center" }}>
            <p style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "clamp(28px,5vw,52px)", fontWeight: 300,
              color: "#F2EDE4", letterSpacing: "-0.02em",
              animation: "pulse 2s ease-in-out infinite",
            }}>
              Something special is unlocking…
            </p>
            <p style={{ fontSize: "11px", letterSpacing: "0.3em", color: "#BF8D3C", textTransform: "uppercase", marginTop: "12px" }}>
              ✦ &nbsp; For you &nbsp; ✦
            </p>
          </div>
        </div>
      )}

      {/* ── UNLOCKING BURST ── */}
      {phase === "unlocking" && (
        <div style={{
          display: "flex", flexDirection: "column", alignItems: "center", gap: "24px",
          animation: "unlockBurst 0.5s ease both",
        }}>
          <div style={{ fontSize: "120px", lineHeight: 1, filter: "drop-shadow(0 0 60px #BF8D3C)" }}>
            🔓
          </div>
          <p style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "clamp(24px,4vw,44px)",
            color: "#BF8D3C", fontStyle: "italic",
            animation: "fadeIn 0.6s ease both",
          }}>
            Unlocked — just for you ✨
          </p>
        </div>
      )}

      {/* ── OPEN: full birthday reveal ── */}
      {phase === "open" && (
        <div style={{
          maxWidth: "820px", width: "90%",
          display: "flex", flexDirection: "column", alignItems: "center",
          gap: "36px", padding: "40px 20px",
          animation: "fadeUp 0.9s ease both",
          position: "relative", zIndex: 2,
          maxHeight: "95vh", overflowY: "auto",
        }}>

          {/* Close button */}
          <button onClick={handleClose} style={{
            position: "fixed", top: "20px", right: "24px",
            background: "transparent", border: "0.5px solid rgba(191,141,60,0.4)",
            borderRadius: "50%", width: "36px", height: "36px",
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer", color: "#BF8D3C", fontSize: "16px",
            transition: "all .3s ease",
          }}
          onMouseEnter={e => e.currentTarget.style.background = "rgba(191,141,60,0.15)"}
          onMouseLeave={e => e.currentTarget.style.background = "transparent"}
          >✕</button>

          {/* Birthday label */}
          <div style={{
            display: "flex", alignItems: "center", gap: "12px",
            animation: "fadeUp .6s ease .1s both",
          }}>
            <div style={{ flex: 1, height: "0.5px", background: "linear-gradient(to right, transparent, #BF8D3C)" }} />
            <p style={{ fontSize: "10px", letterSpacing: "0.45em", color: "#BF8D3C", textTransform: "uppercase", whiteSpace: "nowrap" }}>
              🎂 &nbsp; Happy Birthday &nbsp; 🎂
            </p>
            <div style={{ flex: 1, height: "0.5px", background: "linear-gradient(to left, transparent, #BF8D3C)" }} />
          </div>

          {/* Photo with gold light reveal */}
          <div style={{
            position: "relative",
            width: "220px", height: "280px",
            borderRadius: "4px", overflow: "hidden",
            border: "0.5px solid rgba(191,141,60,0.5)",
            animation: "fadeUp .7s ease .2s both",
            flexShrink: 0,
          }}>
            <img src={BIRTHDAY_PHOTO} alt="Birthday" style={{
              width: "100%", height: "100%", objectFit: "cover",
              filter: photoGlow
                ? "brightness(0.85) contrast(1.05) saturate(1.1)"
                : "brightness(0.2)",
              transition: "filter 2s ease",
            }} />

            {/* Gold sweep overlay */}
            <div style={{
              position: "absolute", inset: 0,
              background: photoGlow
                ? "linear-gradient(160deg, rgba(191,141,60,0.25) 0%, transparent 60%)"
                : "rgba(0,0,0,0.8)",
              transition: "all 2s ease",
            }} />

            {/* Inner gold frame */}
            <div style={{
              position: "absolute", inset: "10px",
              border: "0.5px solid rgba(191,141,60,0.5)",
              borderRadius: "2px", pointerEvents: "none",
              opacity: photoGlow ? 1 : 0, transition: "opacity 2s ease",
            }} />

            {/* Name tag */}
            {photoGlow && (
              <div style={{
                position: "absolute", bottom: "12px", left: "12px", right: "12px",
                textAlign: "center",
                animation: "fadeUp 0.6s ease both",
              }}>
                <p style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: "14px", fontStyle: "italic", color: "#BF8D3C",
                  textShadow: "0 2px 12px rgba(0,0,0,0.9)",
                }}>Sheik Abdullah Sheriff H</p>
              </div>
            )}
          </div>

          {/* Big Happy Birthday heading */}
          <div style={{ textAlign: "center", animation: "fadeUp .7s ease .3s both" }}>
            <h1 style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "clamp(40px,8vw,80px)",
              fontWeight: 300, color: "#F2EDE4",
              letterSpacing: "-0.02em", lineHeight: 1.1,
              marginBottom: "8px",
            }}>
              Happy{" "}
              <em style={{
                fontStyle: "italic",
                background: "linear-gradient(135deg, #C8963A, #F0C97A, #BF8D3C)",
                backgroundSize: "200% auto",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                animation: "shimmer 3s linear infinite",
              }}>Birthday</em>
            </h1>
            <p style={{ fontSize: "11px", letterSpacing: "0.4em", color: "rgba(191,141,60,0.7)", textTransform: "uppercase" }}>
              ✦ &nbsp; August 28 &nbsp; ✦
            </p>
          </div>

          {/* Typewriter message */}
          <div style={{
            maxWidth: "620px", width: "100%",
            padding: "40px 40px",
            background: "rgba(191,141,60,0.04)",
            border: "0.5px solid rgba(191,141,60,0.2)",
            borderRadius: "4px",
            position: "relative",
            animation: "fadeUp .8s ease .5s both",
          }}>
            {/* Top accent */}
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "2px", background: "linear-gradient(to right, transparent, #BF8D3C, transparent)" }} />

            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(15px,2.2vw,19px)", color: "#F2EDE4", lineHeight: 2, fontStyle: "italic" }}>
              {/* Completed lines */}
              {displayed.map((line, i) => (
                <p key={i} style={{ marginBottom: "10px", opacity: 0.9 }}>{line}</p>
              ))}
              {/* Currently typing line */}
              {currentPartial && (
                <p style={{ marginBottom: "10px" }}>
                  {currentPartial}
                  <span style={{
                    display: "inline-block", width: "2px", height: "1.1em",
                    background: "#BF8D3C", marginLeft: "2px", verticalAlign: "middle",
                    animation: "pulse .7s ease-in-out infinite",
                  }} />
                </p>
              )}
            </div>

            {/* Bottom accent */}
            <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "2px", background: "linear-gradient(to right, transparent, #BF8D3C, transparent)" }} />
          </div>

          {/* Done — close button */}
          {twDone && (
            <button onClick={handleClose} style={{
              padding: "14px 44px",
              background: "linear-gradient(135deg, #BF8D3C, #C8963A)",
              border: "none", borderRadius: "2px",
              color: "#080808", fontSize: "11px",
              letterSpacing: "0.3em", textTransform: "uppercase",
              fontWeight: 500, cursor: "pointer",
              fontFamily: "'Jost', sans-serif",
              animation: "fadeUp 0.6s ease both",
              transition: "transform .3s ease",
            }}
            onMouseEnter={e => e.currentTarget.style.transform = "scale(1.04)"}
            onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
            >
              🎂 &nbsp; Thank You &nbsp; 🎂
            </button>
          )}
        </div>
      )}

      {/* ── Extra keyframes only needed inside this overlay ── */}
      <style>{`
        @keyframes confettiFall {
          0%   { transform: translateY(-20px) rotate(0deg);   opacity: 1; }
          100% { transform: translateY(110vh) rotate(720deg); opacity: 0; }
        }
        @keyframes chestPulse {
          0%,100% { transform: scale(1);    filter: drop-shadow(0 0 20px rgba(191,141,60,0.5)); }
          50%     { transform: scale(1.08); filter: drop-shadow(0 0 50px rgba(191,141,60,0.9)); }
        }
        @keyframes unlockBurst {
          0%   { transform: scale(0.4); opacity: 0; }
          60%  { transform: scale(1.15); opacity: 1; }
          100% { transform: scale(1);   opacity: 1; }
        }
      `}</style>
    </div>
  );
}
