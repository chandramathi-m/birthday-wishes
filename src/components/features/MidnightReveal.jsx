import { useState, useEffect, useRef, useCallback } from "react";

// ── Config ────────────────────────────────────────────────────────────────────
// 🧪 TEST MODE — set true to trigger reveal immediately for local testing
//               remember to set back to false before the real birthday!
const TEST_MODE      = false;

const BIRTHDAY_MONTH = 3;   // 0-indexed: 3 = April
const BIRTHDAY_DAY   = 11;
const LS_KEY         = "bt_midnight_seen_2026";

// Birthday song — swap this import for your own file
import birthdaySong from "../../assets/audio/mashaAllah.mp3";

// His photo — swap for the real birthday photo
import blackCat from "../../assets/images/black-cat.jpg";
const BIRTHDAY_PHOTO = blackCat;

// Hidden note revealed when polaroid is flipped
const HIDDEN_NOTE =
  "Sheik Abdullah Sheriff H — this note was hidden just for you. " +
  "You are loved far more than words will ever say. 💛";

// Personalised typewriter message — edit freely
const BIRTHDAY_MESSAGE = [
  "You don't always see it, but you mean so much to so many.",
  "Your presence alone has a way of making things feel okay.",
  "There's a quiet strength in you that never goes unnoticed.",
  "And the world feels a little better with you in it.",
  "Happy Birthday paa 🎂✨",
];

const CANDLE_COLORS = ["#FFB3B3","#FFD9B3","#FFFAB3","#B3FFD1","#B3D9FF"];

// ── Helpers ───────────────────────────────────────────────────────────────────
function isBirthday() {
  if (TEST_MODE) return true;
  const now = new Date();
  return now.getMonth() === BIRTHDAY_MONTH && now.getDate() === BIRTHDAY_DAY;
}

function hasBeenSeen() {
  if (TEST_MODE) return false;
  try { return !!localStorage.getItem(LS_KEY); } catch { return false; }
}

function markSeen() {
  try { localStorage.setItem(LS_KEY, "1"); } catch {}
}

function clearSeen() {
  try { localStorage.removeItem(LS_KEY); } catch {}
}

// ── Particle generators ───────────────────────────────────────────────────────
const GOLD_PALETTE = ["#BF8D3C","#F0C97A","#F2EDE4","#E8B86D","#FFD700",
                      "#FFF4C2","#FF6B6B","#FF9F43","#A29BFE","#74B9FF"];

function makeParticles(count = 140) {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x:     Math.random() * 100,
    y:     Math.random() * 60 + 5,
    size:  Math.random() * 8 + 4,
    color: GOLD_PALETTE[Math.floor(Math.random() * GOLD_PALETTE.length)],
    angle: Math.random() * 360,
    speed: Math.random() * 3 + 1.5,
    delay: Math.random() * 2,
    shape: Math.random() > 0.6 ? "circle" : Math.random() > 0.5 ? "star" : "rect",
  }));
}

function makeMiniParticles(count = 18) {
  return Array.from({ length: count }, (_, i) => ({
    id:    Date.now() + i + Math.random(),
    x:     15 + Math.random() * 70,   // % across screen
    y:     25 + Math.random() * 50,
    dx:    (Math.random() - 0.5) * 120,
    dy:    -(Math.random() * 90 + 20),
    size:  Math.random() * 7 + 3,
    color: GOLD_PALETTE.slice(0, 5)[Math.floor(Math.random() * 5)],
  }));
}

// ── ✨ Cursor Sparkle Trail ───────────────────────────────────────────────────
function CursorSparkle() {
  const [sparks, setSparks] = useState([]);

  useEffect(() => {
    let lastTime = 0;
    const SYMBOLS = ["✦","✧","⋆","★","·","✺"];

    const handleMove = (e) => {
      const now = Date.now();
      if (now - lastTime < 45) return;
      lastTime = now;
      const id = now + Math.random();
      const spark = {
        id,
        x:      e.clientX,
        y:      e.clientY,
        symbol: SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
        size:   Math.random() * 12 + 7,
        color:  GOLD_PALETTE[Math.floor(Math.random() * 5)],
        angle:  Math.random() * 360,
        dy:     -(Math.random() * 30 + 10),
      };
      setSparks(s => [...s.slice(-25), spark]);
      setTimeout(() => setSparks(s => s.filter(sp => sp.id !== id)), 900);
    };

    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, []);

  return (
    <>
      {sparks.map(sp => (
        <div key={sp.id} style={{
          position:      "fixed",
          left:          sp.x,
          top:           sp.y,
          pointerEvents: "none",
          zIndex:        9999,
          fontSize:      `${sp.size}px`,
          color:         sp.color,
          userSelect:    "none",
          "--dy":        `${sp.dy}px`,
          animation:     "sparkTrail 0.9s ease-out forwards",
          transform:     `translate(-50%, -50%) rotate(${sp.angle}deg)`,
        }}>
          {sp.symbol}
        </div>
      ))}
    </>
  );
}

// ── 🎂 Candles (blow-out interaction) ─────────────────────────────────────────
function Candles({ onAllBlown }) {
  const [blown, setBlown] = useState(Array(5).fill(false));

  const blow = useCallback((i) => {
    setBlown(prev => {
      const next = [...prev];
      next[i] = true;
      if (next.every(Boolean)) setTimeout(onAllBlown, 900);
      return next;
    });
  }, [onAllBlown]);

  const allBlown = blown.every(Boolean);

  return (
    <div style={{
      display: "flex", flexDirection: "column", alignItems: "center",
      gap: "40px", animation: "fadeUp 0.7s ease both",
    }}>
      <div style={{ textAlign: "center" }}>
        <p style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: "clamp(22px, 4vw, 40px)", fontWeight: 300,
          color: "#F2EDE4", letterSpacing: "-0.01em",
        }}>
          Blow out the candles…
        </p>
        <p style={{
          fontSize: "11px", letterSpacing: "0.35em",
          color: "rgba(191,141,60,0.6)", textTransform: "uppercase", marginTop: "8px",
        }}>
          click each one ✦
        </p>
      </div>

      <div style={{ display: "flex", gap: "24px", alignItems: "flex-end" }}>
        {blown.map((b, i) => (
          <div key={i} style={{ position: "relative", display: "flex", flexDirection: "column", alignItems: "center" }}>
            {/* Smoke puff */}
            {b && (
              <div style={{
                position: "absolute",
                top: "-30px",
                fontSize: "20px",
                animation: "smokeRise 1.2s ease-out forwards",
                pointerEvents: "none",
              }}>💨</div>
            )}

            {/* Flame */}
            <div style={{
              width:        "14px",
              height:       b ? "0px" : "26px",
              background:   "radial-gradient(ellipse at bottom, #FFD700 0%, #FF8800 55%, transparent 100%)",
              borderRadius: "50% 50% 20% 20%",
              marginBottom: "3px",
              filter:       "blur(1px) drop-shadow(0 0 8px #FFD700)",
              opacity:      b ? 0 : 1,
              transition:   "all 0.4s ease",
              animation:    b ? "none" : "flicker 0.35s ease-in-out infinite alternate",
            }} />

            {/* Wick */}
            <div style={{ width: "2px", height: "8px", background: "#888" }} />

            {/* Candle body */}
            <div
              onClick={() => !b && blow(i)}
              style={{
                width:        "30px",
                height:       `${48 + i * 9}px`,
                background:   b
                  ? "linear-gradient(to bottom, #9E9E9E, #777)"
                  : `linear-gradient(to bottom, ${CANDLE_COLORS[i]}, #fff)`,
                borderRadius: "3px 3px 2px 2px",
                boxShadow:    b ? "none" : `0 0 16px ${CANDLE_COLORS[i]}88`,
                cursor:       b ? "default" : "pointer",
                transition:   "all 0.4s ease",
              }}
            />
          </div>
        ))}
      </div>

      {allBlown && (
        <p style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: "clamp(18px, 3vw, 28px)", fontStyle: "italic",
          color: "#BF8D3C", animation: "fadeUp 0.6s ease both",
        }}>
          ✨ Opening your surprise…
        </p>
      )}
    </div>
  );
}

// ── 📸 Polaroid Stack (with flip easter egg) ──────────────────────────────────
function PolaroidStack({ photo, hiddenNote }) {
  const [flipped,  setFlipped]  = useState(false);
  const [hovered,  setHovered]  = useState(false);
  const [revealed, setRevealed] = useState(false);

  const handleFlip = () => {
    setFlipped(f => !f);
    if (!revealed) setRevealed(true);
  };

  const stackCards = [
    { rot: -7, tx: -10, ty: 5,  z: 1 },
    { rot:  4, tx:  8,  ty: 2,  z: 2 },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "12px", animation: "fadeUp .7s ease .2s both" }}>
      <div
        style={{ position: "relative", width: "210px", height: "270px", perspective: "1000px", cursor: "pointer" }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onClick={handleFlip}
      >
        {/* Stacked ghost polaroids */}
        {stackCards.map((c, i) => (
          <div key={i} style={{
            position:     "absolute", inset: 0,
            background:   "white",
            borderRadius: "3px",
            padding:      "10px 10px 36px",
            boxShadow:    "0 4px 20px rgba(0,0,0,0.55)",
            transform:    hovered
              ? `rotate(${c.rot * 1.9}deg) translate(${c.tx * 1.7}px, ${c.ty}px)`
              : `rotate(${c.rot * 0.4}deg) translate(${c.tx * 0.25}px, 0px)`,
            zIndex:       c.z,
            transition:   "transform 0.45s cubic-bezier(0.34,1.56,0.64,1)",
          }} />
        ))}

        {/* Flipping front polaroid */}
        <div style={{
          position:       "absolute", inset: 0, zIndex: 3,
          transformStyle: "preserve-3d",
          transform:      flipped ? "rotateY(180deg)" : "rotateY(0deg)",
          transition:     "transform 0.75s cubic-bezier(0.4, 0, 0.2, 1)",
        }}>
          {/* Front face */}
          <div style={{
            position:             "absolute", inset: 0,
            background:           "white",
            borderRadius:         "3px",
            padding:              "10px 10px 36px",
            boxShadow:            "0 10px 48px rgba(0,0,0,0.7)",
            backfaceVisibility:   "hidden",
            WebkitBackfaceVisibility: "hidden",
            overflow:             "hidden",
          }}>
            <img src={photo} alt="Birthday" style={{
              width: "100%", height: "100%",
              objectFit: "cover", borderRadius: "1px",
              display: "block",
            }} />
            <p style={{
              position:   "absolute", bottom: "7px", left: 0, right: 0,
              textAlign:  "center",
              fontFamily: "'Cormorant Garamond', serif",
              fontSize:   "11px", fontStyle: "italic", color: "#aaa",
            }}>tap to flip ✦</p>
          </div>

          {/* Back face */}
          <div style={{
            position:             "absolute", inset: 0,
            background:           "#FFFDF5",
            borderRadius:         "3px",
            padding:              "28px 20px",
            boxShadow:            "0 10px 48px rgba(0,0,0,0.7)",
            backfaceVisibility:   "hidden",
            WebkitBackfaceVisibility: "hidden",
            transform:            "rotateY(180deg)",
            display:              "flex",
            flexDirection:        "column",
            alignItems:           "center",
            justifyContent:       "center",
            gap:                  "16px",
          }}>
            <div style={{ width: "36px", height: "1px", background: "#BF8D3C" }} />
            <p style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "12.5px", fontStyle: "italic",
              color: "#333", lineHeight: 1.75, textAlign: "center",
            }}>{hiddenNote}</p>
            <div style={{ width: "36px", height: "1px", background: "#BF8D3C" }} />
            <span style={{ fontSize: "22px" }}>💛</span>
          </div>
        </div>
      </div>

      {/* Hint label */}
      {!revealed && (
        <p style={{
          fontSize: "10px", letterSpacing: "0.3em",
          color: "rgba(191,141,60,0.5)", textTransform: "uppercase",
          animation: "pulse 2s ease-in-out infinite",
        }}>
          ✦ a secret waits inside ✦
        </p>
      )}
    </div>
  );
}

// ── Typewriter hook ───────────────────────────────────────────────────────────
function useTypewriter(lines, active, speed = 38, onLineComplete) {
  const [displayed,      setDisplayed]      = useState([]);
  const [lineIdx,        setLineIdx]        = useState(0);
  const [charIdx,        setCharIdx]        = useState(0);
  const [done,           setDone]           = useState(false);
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
        setDisplayed(d => {
          const next = [...d, line];
          onLineComplete?.(next.length - 1);
          return next;
        });
        setLineIdx(l => l + 1);
        setCharIdx(0);
      }, 600);
    }
    return () => clearTimeout(timerRef.current);
  }, [active, lineIdx, charIdx, done, lines, speed, onLineComplete]);

  const currentPartial = active && lineIdx < lines.length
    ? lines[lineIdx].slice(0, charIdx)
    : "";

  return { displayed, currentPartial, done };
}

// ── Main component ────────────────────────────────────────────────────────────
export default function MidnightReveal() {
  // Phases: "idle" | "locked" | "unlocking" | "candles" | "open" | "hidden"
  const [phase,          setPhase]          = useState("idle");
  const [particles,      setParticles]      = useState([]);
  const [miniParticles,  setMiniParticles]  = useState([]);
  const [showReplay,     setShowReplay]     = useState(false);
  const [cameraFlash,    setCameraFlash]    = useState(false);
  const [chestShaking,   setChestShaking]   = useState(false);
  const [chestSparks,    setChestSparks]    = useState([]);
  const audioRef  = useRef(null);
  const timerRef  = useRef(null);

  // ── Line-complete confetti burst ──────────────────────────────────────────
  const handleLineComplete = useCallback(() => {
    const burst = makeMiniParticles(20);
    setMiniParticles(prev => [...prev, ...burst]);
    const ids = burst.map(p => p.id);
    setTimeout(() => setMiniParticles(prev => prev.filter(p => !ids.includes(p.id))), 1500);
  }, []);

  const { displayed, currentPartial, done: twDone } = useTypewriter(
    BIRTHDAY_MESSAGE, phase === "open", 38, handleLineComplete
  );

  // ── Audio ─────────────────────────────────────────────────────────────────
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

  // ── 📸 Camera flash ───────────────────────────────────────────────────────
  const triggerCameraFlash = useCallback(() => {
    setCameraFlash(true);
    setTimeout(() => setCameraFlash(false), 700);
  }, []);

  // ── Unlock sequence ───────────────────────────────────────────────────────
  const runUnlockSequence = useCallback(() => {
    setPhase("unlocking");
    setParticles(makeParticles(140));
    triggerCameraFlash();

    timerRef.current = setTimeout(() => {
      setPhase("candles");   // ← go to candles first
      startSong();
      setShowReplay(false);
    }, 2200);
  }, [startSong, triggerCameraFlash]);

  // ── 🔒 Chest shake on click ───────────────────────────────────────────────
  const handleChestClick = useCallback(() => {
    if (chestShaking) return;
    setChestShaking(true);
    const sparks = Array.from({ length: 10 }, (_, i) => ({
      id: Date.now() + i,
      angle: (i / 10) * 360,
    }));
    setChestSparks(sparks);
    setTimeout(() => setChestSparks([]), 750);
    setTimeout(() => setChestShaking(false), 550);
  }, [chestShaking]);

  // ── Init ──────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!isBirthday()) { setPhase("hidden"); return; }

    if (hasBeenSeen()) {
      setPhase("hidden");
      setShowReplay(true);
      return;
    }

    const now = new Date();
    if (now.getHours() >= 0) {
      setPhase("locked");
      timerRef.current = setTimeout(() => runUnlockSequence(), 1500);
    }

    return () => clearTimeout(timerRef.current);
  }, [runUnlockSequence]);

  // Wait for midnight on eve
  useEffect(() => {
    const now  = new Date();
    const next = new Date(now); next.setHours(24, 0, 0, 0);
    if (next.getMonth() === BIRTHDAY_MONTH && next.getDate() === BIRTHDAY_DAY) {
      const ms = next - now;
      const t  = setTimeout(() => {
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
  };

  const handleReplay = () => {
    clearSeen();
    setShowReplay(false);
    setParticles([]);
    setMiniParticles([]);
    setPhase("locked");
    setTimeout(() => runUnlockSequence(), 800);
  };

  // ── Replay button only ────────────────────────────────────────────────────
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

  if (phase === "idle") return null;

  // ── Full overlay ──────────────────────────────────────────────────────────
  return (
    <>
      {/* ✨ Cursor sparkle — active during candles + open phases */}
      {(phase === "candles" || phase === "open") && <CursorSparkle />}

      {/* 📸 Camera flash */}
      {cameraFlash && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 9998,
          background: "white", pointerEvents: "none",
          animation: "cameraFlash 0.7s ease-out forwards",
        }} />
      )}

      <div style={{
        position:   "fixed", inset: 0, zIndex: 1000,
        background: (phase === "open" || phase === "candles")
          ? "linear-gradient(160deg, #0a0700 0%, #050300 60%, #0d0a04 100%)"
          : "#050300",
        display: "flex", alignItems: "center", justifyContent: "center",
        overflow: "hidden", transition: "background 1s ease",
      }}>

        {/* ── Fireworks ── */}
        {(phase === "unlocking" || phase === "open") && particles.map(p => (
          <div key={p.id} style={{
            position: "absolute",
            left: `${p.x}%`, top: `${p.y}%`,
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

        {/* ── Mini confetti bursts (per typewriter line) ── */}
        {miniParticles.map(p => (
          <div key={p.id} style={{
            position:      "absolute",
            left:          `${p.x}%`, top: `${p.y}%`,
            width:         `${p.size}px`, height: `${p.size}px`,
            background:    p.color,
            borderRadius:  "50%",
            pointerEvents: "none",
            "--dx":        `${p.dx}px`,
            "--dy":        `${p.dy}px`,
            animation:     "miniBurst 1.3s ease-out forwards",
          }} />
        ))}

        {/* ── Radial gold glow ── */}
        {(phase === "open" || phase === "candles") && (
          <div style={{
            position: "absolute", inset: 0, pointerEvents: "none",
            background: "radial-gradient(ellipse at center, rgba(191,141,60,0.12) 0%, transparent 65%)",
            animation: "pulse 4s ease-in-out infinite",
          }} />
        )}

        {/* ══════════════════════════════════════════════
            🔒 LOCKED — shake-to-unlock chest
        ══════════════════════════════════════════════ */}
        {phase === "locked" && (
          <div style={{
            display: "flex", flexDirection: "column", alignItems: "center",
            gap: "32px", animation: "fadeUp 0.8s ease both",
            position: "relative",
          }}>
            {/* Chest spark particles */}
            {chestSparks.map(s => (
              <div key={s.id} style={{
                position:      "absolute",
                top:           "30%", left: "50%",
                width:         "7px", height: "7px",
                background:    "#FFD700",
                borderRadius:  "50%",
                pointerEvents: "none",
                "--angle":     `${s.angle}deg`,
                animation:     "sparkShoot 0.65s ease-out forwards",
                transformOrigin: "0 0",
              }} />
            ))}

            <div
              onClick={handleChestClick}
              title="Click me…"
              style={{
                fontSize:   "100px", lineHeight: 1,
                cursor:     "pointer", userSelect: "none",
                animation:  chestShaking
                  ? "chestShake 0.5s ease both"
                  : "chestPulse 1.2s ease-in-out infinite",
                filter:     "drop-shadow(0 0 30px rgba(191,141,60,0.7))",
                transition: "filter 0.2s",
              }}
            >🔒</div>

            <div style={{ textAlign: "center" }}>
              <p style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "clamp(28px,5vw,52px)", fontWeight: 300,
                color: "#F2EDE4", letterSpacing: "-0.02em",
                animation: "pulse 2s ease-in-out infinite",
              }}>
                Something special is unlocking…
              </p>
              <p style={{
                fontSize: "11px", letterSpacing: "0.3em",
                color: "#BF8D3C", textTransform: "uppercase", marginTop: "12px",
              }}>
                ✦ &nbsp; For you &nbsp; ✦
              </p>
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════
            🔓 UNLOCKING — burst animation
        ══════════════════════════════════════════════ */}
        {phase === "unlocking" && (
          <div style={{
            display: "flex", flexDirection: "column", alignItems: "center",
            gap: "24px", animation: "unlockBurst 0.5s ease both",
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

        {/* ══════════════════════════════════════════════
            🕯️ CANDLES — blow them out to proceed
        ══════════════════════════════════════════════ */}
        {phase === "candles" && (
          <Candles onAllBlown={() => setPhase("open")} />
        )}

        {/* ══════════════════════════════════════════════
            🎂 OPEN — full birthday reveal
        ══════════════════════════════════════════════ */}
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

            {/* 📸 Polaroid stack with flip easter egg */}
            <PolaroidStack photo={BIRTHDAY_PHOTO} hiddenNote={HIDDEN_NOTE} />

            {/* Heading */}
            <div style={{ textAlign: "center", animation: "fadeUp .7s ease .3s both" }}>
              <h1 style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "clamp(40px,8vw,80px)",
                fontWeight: 300, color: "#F2EDE4",
                letterSpacing: "-0.02em", lineHeight: 1.1, marginBottom: "8px",
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
                ✦ &nbsp; April 11 &nbsp; ✦
              </p>
            </div>

            {/* Typewriter card */}
            <div style={{
              maxWidth: "620px", width: "100%",
              padding: "40px 40px",
              background: "rgba(191,141,60,0.04)",
              border: "0.5px solid rgba(191,141,60,0.2)",
              borderRadius: "4px", position: "relative",
              animation: "fadeUp .8s ease .5s both",
            }}>
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "2px", background: "linear-gradient(to right, transparent, #BF8D3C, transparent)" }} />
              <div style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "clamp(15px,2.2vw,19px)",
                color: "#F2EDE4", lineHeight: 2, fontStyle: "italic",
              }}>
                {displayed.map((line, i) => (
                  <p key={i} style={{ marginBottom: "10px", opacity: 0.9 }}>{line}</p>
                ))}
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
              <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "2px", background: "linear-gradient(to right, transparent, #BF8D3C, transparent)" }} />
            </div>

            {/* Done CTA */}
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

        {/* ── All keyframes ── */}
        <style>{`
          /* Original */
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
          @keyframes shimmer {
            0%   { background-position: 0% center; }
            100% { background-position: 200% center; }
          }
          @keyframes glowPulse {
            0%, 100% { box-shadow: 0 0 0 rgba(191,141,60,0); }
            50%       { box-shadow: 0 0 20px rgba(191,141,60,0.4); }
          }

          /* NEW: Cursor sparkle trail */
          @keyframes sparkTrail {
            0%   { opacity: 1; transform: translate(-50%, -50%) scale(1.1) rotate(0deg); }
            100% { opacity: 0; transform: translate(-50%, calc(-50% + var(--dy, -20px))) scale(0.2) rotate(45deg); }
          }

          /* NEW: Camera flash */
          @keyframes cameraFlash {
            0%   { opacity: 0.95; }
            25%  { opacity: 1; }
            100% { opacity: 0; }
          }

          /* NEW: Chest shake */
          @keyframes chestShake {
            0%   { transform: rotate(0deg)   scale(1); }
            12%  { transform: rotate(-9deg)  scale(1.12); filter: drop-shadow(0 0 45px rgba(255,210,0,0.95)); }
            28%  { transform: rotate(8deg)   scale(1.06); }
            44%  { transform: rotate(-6deg)  scale(1.09); }
            60%  { transform: rotate(5deg)   scale(1.03); }
            76%  { transform: rotate(-3deg)  scale(1.01); }
            100% { transform: rotate(0deg)   scale(1); }
          }

          /* NEW: Chest sparks */
          @keyframes sparkShoot {
            0%   { transform: rotate(var(--angle, 0deg)) translateX(0px);   opacity: 1; }
            100% { transform: rotate(var(--angle, 0deg)) translateX(70px);  opacity: 0; }
          }

          /* NEW: Mini confetti burst per line */
          @keyframes miniBurst {
            0%   { transform: translate(0, 0) scale(1);                                opacity: 1; }
            100% { transform: translate(var(--dx, 40px), var(--dy, -60px)) scale(0.1); opacity: 0; }
          }

          /* NEW: Candle flame flicker */
          @keyframes flicker {
            0%   { transform: scaleX(1)    scaleY(1);    opacity: 1; }
            100% { transform: scaleX(0.82) scaleY(0.93); opacity: 0.82; }
          }

          /* NEW: Smoke puff rising */
          @keyframes smokeRise {
            0%   { opacity: 0.9; transform: translateY(0) scale(1); }
            60%  { opacity: 0.6; transform: translateY(-20px) scale(1.3); }
            100% { opacity: 0;   transform: translateY(-45px) scale(1.7); }
          }

          /* Shared */
          @keyframes fadeUp {
            from { opacity: 0; transform: translateY(20px); }
            to   { opacity: 1; transform: translateY(0); }
          }
          @keyframes fadeIn {
            from { opacity: 0; }
            to   { opacity: 1; }
          }
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50%       { opacity: 0.55; }
          }
        `}</style>
      </div>
    </>
  );
}