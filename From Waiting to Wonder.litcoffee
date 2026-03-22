import { useState, useEffect, useRef, useCallback } from "react";

// ─────────────────────────────────────────────────────────────────────────────
//  VIDEO CONFIGURATION — paste your video file paths or URLs here
// ─────────────────────────────────────────────────────────────────────────────
const BORN_TO_NOW_VIDEO = "";   // e.g. "/videos/born-to-now.mp4" or a URL
const GYM_REEL_1       = "";   // First gym clip
const GYM_REEL_2       = "";   // Second gym clip
const GYM_REEL_3       = "";   // Third gym clip
const BACKGROUND_MUSIC = "";   // e.g. "/music/ambient.mp3" or a streaming URL

// Next birthday — August 28, 2026
const NEXT_BIRTHDAY = new Date("2026-08-28T00:00:00");

// ─────────────────────────────────────────────────────────────────────────────

const globalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=Jost:wght@200;300;400;500&display=swap');

  * { margin: 0; padding: 0; box-sizing: border-box; }
  html { scroll-behavior: smooth; }
  body {
    background: #080808;
    color: #F2EDE4;
    font-family: 'Jost', sans-serif;
    font-weight: 300;
    overflow-x: hidden;
  }
  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: #0d0d0d; }
  ::-webkit-scrollbar-thumb { background: #BF8D3C; border-radius: 2px; }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(40px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes fadeIn  { from { opacity:0; } to { opacity:1; } }
  @keyframes pulse   { 0%,100%{opacity:.6} 50%{opacity:1} }
  @keyframes float   { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
  @keyframes shimmer { 0%{background-position:-200% center} 100%{background-position:200% center} }
  @keyframes bgZoom  { 0%{transform:scale(1)} 100%{transform:scale(1.08)} }
  @keyframes borderGlow {
    0%,100%{box-shadow:0 0 20px rgba(191,141,60,0.1)}
    50%    {box-shadow:0 0 40px rgba(191,141,60,0.3)}
  }
  @keyframes glowPulse {
    0%,100%{box-shadow:0 0 0 0 rgba(191,141,60,0)}
    50%    {box-shadow:0 0 40px 8px rgba(191,141,60,0.22)}
  }
  @keyframes envelopeOpen {
    0%  {opacity:0;transform:translateY(20px)}
    100%{opacity:1;transform:translateY(0)}
  }
  @keyframes particleFloat {
    0%  {transform:translateY(0) rotate(0deg);opacity:0}
    10% {opacity:1}
    90% {opacity:1}
    100%{transform:translateY(-100vh) rotate(720deg);opacity:0}
  }
  @keyframes countFlip {
    0%  {transform:rotateX(90deg);opacity:0}
    100%{transform:rotateX(0deg);opacity:1}
  }
  @keyframes musicBounce {
    0%,100%{transform:scaleY(0.4)}
    50%    {transform:scaleY(1)}
  }
  @keyframes reelScan {
    0%  {top:0%;opacity:0.18}
    100%{top:100%;opacity:0}
  }
  @keyframes progressPulse {
    0%,100%{box-shadow:0 0 0 0 rgba(191,141,60,0)}
    50%    {box-shadow:0 0 8px 2px rgba(191,141,60,0.5)}
  }
  @keyframes spin {
    from{transform:rotate(0deg)}
    to  {transform:rotate(360deg)}
  }

  .reveal {
    opacity:0; transform:translateY(50px);
    transition: opacity .9s cubic-bezier(.16,1,.3,1), transform .9s cubic-bezier(.16,1,.3,1);
  }
  .reveal.visible { opacity:1; transform:translateY(0); }
  .reveal-delay-1{transition-delay:.1s}
  .reveal-delay-2{transition-delay:.2s}
  .reveal-delay-3{transition-delay:.35s}
  .reveal-delay-4{transition-delay:.5s}
  .reveal-delay-5{transition-delay:.65s}

  .gold-text {
    background: linear-gradient(135deg,#C8963A 0%,#F0C97A 40%,#BF8D3C 70%,#E8B86D 100%);
    background-size:200% auto;
    -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text;
    animation: shimmer 4s linear infinite;
  }
  .img-cinematic {
    width:100%; height:100%; object-fit:cover; display:block;
    filter:grayscale(15%) brightness(.75) contrast(1.05);
    transition: transform .6s ease, filter .4s ease;
  }
  .img-cinematic:hover { filter:grayscale(0%) brightness(.88) contrast(1.08); transform:scale(1.04); }

  /* custom video controls */
  .vid-progress::-webkit-slider-thumb {
    -webkit-appearance:none; width:14px; height:14px;
    background:#BF8D3C; border-radius:50%; cursor:pointer;
    box-shadow:0 0 6px rgba(191,141,60,.6);
  }
  .vid-progress::-moz-range-thumb {
    width:14px; height:14px; background:#BF8D3C;
    border-radius:50%; border:none; cursor:pointer;
  }
  .vid-progress {
    -webkit-appearance:none; appearance:none;
    height:3px; border-radius:2px; cursor:pointer; outline:none;
    background: linear-gradient(to right, #BF8D3C var(--pct,0%), rgba(191,141,60,.2) var(--pct,0%));
  }
`;

/* ─── helpers ─────────────────────────────────────────────────────────────── */
function useReveal() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const els = el.querySelectorAll(".reveal");
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add("visible"); }),
      { threshold: 0.1, rootMargin: "0px 0px -60px 0px" }
    );
    els.forEach(e => obs.observe(e));
    return () => obs.disconnect();
  }, []);
  return ref;
}

function GoldDivider({ style = {} }) {
  return (
    <div style={{ display:"flex", alignItems:"center", gap:"16px", ...style }}>
      <div style={{ flex:1, height:"0.5px", background:"linear-gradient(to right,transparent,#BF8D3C)" }}/>
      <div style={{ width:"6px", height:"6px", background:"#BF8D3C", transform:"rotate(45deg)", flexShrink:0 }}/>
      <div style={{ flex:1, height:"0.5px", background:"linear-gradient(to left,transparent,#BF8D3C)" }}/>
    </div>
  );
}

function fmt(n) { return String(Math.max(0, Math.floor(n))).padStart(2,"0"); }

/* ─── 1. BACKGROUND MUSIC TOGGLE ────────────────────────────────────────── */
function MusicToggle() {
  const [playing, setPlaying] = useState(false);
  const [ready,   setReady]   = useState(false);
  const audioRef = useRef(null);

  // Build audio element once
  useEffect(() => {
    const a = new Audio();
    a.loop = true; a.volume = 0.3;
    // Use a free lofi ambient track (CC0)
    a.src = BACKGROUND_MUSIC ||
      "https://cdn.pixabay.com/audio/2023/10/30/audio_0625d92f16.mp3";
    a.addEventListener("canplaythrough", () => setReady(true), { once: true });
    audioRef.current = a;
    return () => { a.pause(); a.src = ""; };
  }, []);

  const toggle = () => {
    const a = audioRef.current;
    if (!a) return;
    if (playing) { a.pause(); setPlaying(false); }
    else         { a.play().then(() => setPlaying(true)).catch(()=>{}); }
  };

  const bars = [1, 1.4, 0.7, 1.2, 0.9];

  return (
    <button onClick={toggle} title={playing ? "Pause music" : "Play ambient music"} style={{
      position:"fixed", bottom:"32px", left:"32px", zIndex:200,
      width:"52px", height:"52px", borderRadius:"50%",
      background: playing ? "rgba(191,141,60,0.18)" : "rgba(20,18,14,0.9)",
      border: playing ? "1px solid #BF8D3C" : "0.5px solid rgba(191,141,60,0.4)",
      backdropFilter:"blur(12px)",
      display:"flex", alignItems:"center", justifyContent:"center",
      cursor:"pointer", transition:"all .35s ease",
      boxShadow: playing ? "0 0 24px rgba(191,141,60,0.3)" : "none",
    }}>
      {playing ? (
        /* animated equalizer bars */
        <div style={{ display:"flex", gap:"3px", alignItems:"flex-end", height:"20px" }}>
          {bars.map((spd, i) => (
            <div key={i} style={{
              width:"3px", height:"100%", background:"#BF8D3C", borderRadius:"2px",
              transformOrigin:"bottom",
              animation:`musicBounce ${0.5 * spd}s ease-in-out infinite alternate`,
              animationDelay:`${i * 0.08}s`,
            }}/>
          ))}
        </div>
      ) : (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#BF8D3C" strokeWidth="1.5" strokeLinecap="round">
          <path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>
        </svg>
      )}
    </button>
  );
}

/* ─── 2. COUNTDOWN TIMER ─────────────────────────────────────────────────── */
function CountdownSection() {
  const [time, setTime] = useState({ d:0, h:0, m:0, s:0 });
  const [passed, setPassed] = useState(false);
  const prevRef = useRef({ d:0,h:0,m:0,s:0 });

  useEffect(() => {
    const tick = () => {
      const diff = NEXT_BIRTHDAY - Date.now();
      if (diff <= 0) { setPassed(false); setTime({ d:0,h:0,m:0,s:0 }); return; }
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
    <section style={{
      padding:"80px 24px",
      background:"linear-gradient(180deg,#080808 0%,#0a0800 50%,#080808 100%)",
      position:"relative", overflow:"hidden",
    }}>
      {/* faint background text */}
      <div style={{
        position:"absolute", top:"50%", left:"50%",
        transform:"translate(-50%,-50%)",
        fontFamily:"'Cormorant Garamond',serif",
        fontSize:"clamp(60px,15vw,160px)", fontWeight:600,
        color:"rgba(191,141,60,0.04)", whiteSpace:"nowrap",
        pointerEvents:"none", userSelect:"none", letterSpacing:"-0.04em",
      }}>COUNTING DOWN</div>

      <div style={{ maxWidth:"900px", margin:"0 auto", position:"relative", zIndex:1, textAlign:"center" }}>
        <p style={{ fontSize:"10px", letterSpacing:"0.4em", color:"#BF8D3C", textTransform:"uppercase", marginBottom:"12px" }}>
          🎂 &nbsp; Next Birthday
        </p>
        <p style={{
          fontFamily:"'Cormorant Garamond',serif",
          fontSize:"clamp(22px,4vw,38px)", fontWeight:300,
          color:"#F2EDE4", marginBottom:"48px", fontStyle:"italic",
        }}>
          28 August 2026 — The Celebration Awaits
        </p>

        <div style={{ display:"flex", justifyContent:"center", gap:"clamp(12px,3vw,36px)", flexWrap:"wrap" }}>
          {units.map(({ val, label }) => (
            <div key={label} style={{
              display:"flex", flexDirection:"column", alignItems:"center",
              minWidth:"90px",
            }}>
              {/* flip card */}
              <div style={{
                width:"clamp(72px,12vw,104px)", height:"clamp(72px,12vw,104px)",
                background:"linear-gradient(160deg,rgba(191,141,60,0.12) 0%,rgba(10,8,3,1) 100%)",
                border:"0.5px solid rgba(191,141,60,0.35)",
                borderRadius:"6px",
                display:"flex", alignItems:"center", justifyContent:"center",
                position:"relative", overflow:"hidden",
                animation:"borderGlow 4s ease-in-out infinite",
              }}>
                {/* scan line */}
                <div style={{
                  position:"absolute", left:0, right:0, height:"1px",
                  background:"linear-gradient(to right,transparent,rgba(191,141,60,0.35),transparent)",
                  animation:"reelScan 2s linear infinite",
                }}/>
                <span key={val} style={{
                  fontFamily:"'Cormorant Garamond',serif",
                  fontSize:"clamp(32px,6vw,52px)", fontWeight:500,
                  color:"#F2EDE4", letterSpacing:"-0.02em",
                  animation:"countFlip .35s ease both",
                }}>{fmt(val)}</span>
              </div>
              {/* divider dot row */}
              <div style={{ display:"flex", gap:"4px", margin:"10px 0 6px" }}>
                {[...Array(3)].map((_,i) => (
                  <div key={i} style={{ width:"3px", height:"3px", borderRadius:"50%", background:`rgba(191,141,60,${0.3+i*0.25})` }}/>
                ))}
              </div>
              <p style={{ fontSize:"9px", letterSpacing:"0.3em", color:"#BF8D3C", textTransform:"uppercase" }}>{label}</p>
            </div>
          ))}
        </div>

        <GoldDivider style={{ marginTop:"48px", maxWidth:"400px", margin:"48px auto 0" }}/>
        <p style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"clamp(16px,2.5vw,20px)", fontStyle:"italic", color:"#9E9588", marginTop:"24px" }}>
          Every second counts down to another reason to celebrate this extraordinary life.
        </p>
      </div>
    </section>
  );
}

/* ─── CINEMATIC VIDEO PLAYER ─────────────────────────────────────────────── */
function CinematicPlayer({ src, poster, title, subtitle, compact = false }) {
  const videoRef  = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [muted,   setMuted]   = useState(false);
  const [pct,     setPct]     = useState(0);
  const [current, setCurrent] = useState(0);
  const [duration,setDuration]= useState(0);
  const [loading, setLoading] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [showCtrl,   setShowCtrl]   = useState(true);
  const hideTimer = useRef(null);

  const hasVideo = !!src;

  const fmtTime = s => {
    if (!s || isNaN(s)) return "0:00";
    const m = Math.floor(s/60), sec = Math.floor(s%60);
    return `${m}:${String(sec).padStart(2,"0")}`;
  };

  const togglePlay = () => {
    const v = videoRef.current; if (!v) return;
    if (playing) { v.pause(); setPlaying(false); }
    else         { v.play(); setPlaying(true); }
  };

  const onTimeUpdate = () => {
    const v = videoRef.current; if (!v) return;
    const p = v.duration ? (v.currentTime / v.duration) * 100 : 0;
    setPct(p); setCurrent(v.currentTime);
  };

  const seek = e => {
    const v = videoRef.current; if (!v || !v.duration) return;
    const val = parseFloat(e.target.value);
    v.currentTime = (val / 100) * v.duration;
    setPct(val);
  };

  const onMouseMove = () => {
    setShowCtrl(true);
    clearTimeout(hideTimer.current);
    if (playing) hideTimer.current = setTimeout(() => setShowCtrl(false), 2800);
  };

  const toggleFS = () => {
    const el = videoRef.current?.closest(".cinema-wrap");
    if (!el) return;
    if (!document.fullscreenElement) { el.requestFullscreen(); setFullscreen(true); }
    else { document.exitFullscreen(); setFullscreen(false); }
  };

  const h = compact ? "280px" : "clamp(240px,50vw,520px)";

  return (
    <div className="cinema-wrap" style={{
      position:"relative", width:"100%", height:h,
      background:"#000", borderRadius:"4px", overflow:"hidden",
      border:"0.5px solid rgba(191,141,60,0.3)",
      cursor: playing ? "none" : "pointer",
    }} onMouseMove={onMouseMove} onClick={hasVideo && !playing ? togglePlay : undefined}>

      {hasVideo ? (
        <video
          ref={videoRef} src={src} poster={poster}
          style={{ width:"100%", height:"100%", objectFit:"cover", display:"block" }}
          muted={muted}
          onTimeUpdate={onTimeUpdate}
          onLoadedMetadata={e => setDuration(e.target.duration)}
          onWaiting={() => setLoading(true)}
          onCanPlay={() => setLoading(false)}
          onEnded={() => { setPlaying(false); setPct(0); setCurrent(0); }}
        />
      ) : (
        /* Placeholder when no video is set */
        <div style={{
          width:"100%", height:"100%",
          background:"linear-gradient(160deg,rgba(191,141,60,0.08) 0%,#050401 100%)",
          display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center",
          gap:"16px",
        }}>
          {poster && <img src={poster} alt="" style={{ position:"absolute", inset:0, width:"100%", height:"100%", objectFit:"cover", filter:"brightness(0.2) saturate(0.4)" }}/>}
          <div style={{ position:"relative", zIndex:1, textAlign:"center" }}>
            <div style={{ width:"72px", height:"72px", borderRadius:"50%", border:"1.5px dashed rgba(191,141,60,0.5)", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 20px" }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#BF8D3C" strokeWidth="1.5">
                <polygon points="5,3 19,12 5,21"/>
              </svg>
            </div>
            <p style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"20px", fontStyle:"italic", color:"rgba(191,141,60,0.8)", marginBottom:"8px" }}>{title || "Video Coming Soon"}</p>
            <p style={{ fontSize:"10px", letterSpacing:"0.25em", color:"rgba(158,149,136,0.6)", textTransform:"uppercase" }}>
              Add your video path in the config at top of file
            </p>
          </div>
        </div>
      )}

      {/* Scan line effect */}
      <div style={{ position:"absolute", inset:0, background:"repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,0.03) 2px,rgba(0,0,0,0.03) 4px)", pointerEvents:"none", zIndex:1 }}/>

      {/* Loading spinner */}
      {loading && (
        <div style={{ position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center", zIndex:5 }}>
          <div style={{ width:"40px", height:"40px", borderRadius:"50%", border:"2px solid rgba(191,141,60,0.2)", borderTopColor:"#BF8D3C", animation:"spin .8s linear infinite" }}/>
        </div>
      )}

      {/* Controls overlay */}
      {hasVideo && (
        <div style={{
          position:"absolute", bottom:0, left:0, right:0, zIndex:10,
          background:"linear-gradient(to top,rgba(0,0,0,0.85) 0%,transparent 100%)",
          padding:"32px 20px 16px",
          opacity: showCtrl ? 1 : 0,
          transition:"opacity .4s ease",
          pointerEvents: showCtrl ? "auto" : "none",
        }}>
          {/* Progress bar */}
          <input type="range" min="0" max="100" step="0.1"
            value={pct} onChange={seek}
            className="vid-progress"
            style={{ width:"100%", marginBottom:"10px", "--pct":`${pct}%` }}
          />

          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
            <div style={{ display:"flex", alignItems:"center", gap:"14px" }}>
              {/* Play/pause */}
              <button onClick={e => { e.stopPropagation(); togglePlay(); }} style={{ background:"transparent", border:"none", cursor:"pointer", color:"#F2EDE4", display:"flex", alignItems:"center" }}>
                {playing ? (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="#F2EDE4"><rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/></svg>
                ) : (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="#F2EDE4"><polygon points="5,3 19,12 5,21"/></svg>
                )}
              </button>
              {/* Mute */}
              <button onClick={e => { e.stopPropagation(); const v=videoRef.current; if(v){v.muted=!muted; setMuted(!muted);} }} style={{ background:"transparent", border:"none", cursor:"pointer", color:"#9E9588" }}>
                {muted ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polygon points="11,5 6,9 2,9 2,15 6,15 11,19"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/></svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#BF8D3C" strokeWidth="1.5"><polygon points="11,5 6,9 2,9 2,15 6,15 11,19"/><path d="M15.54,8.46a5,5,0,0,1,0,7.07"/><path d="M19.07,4.93a10,10,0,0,1,0,14.14"/></svg>
                )}
              </button>
              {/* Time */}
              <span style={{ fontSize:"11px", color:"#9E9588", fontVariantNumeric:"tabular-nums" }}>
                {fmtTime(current)} / {fmtTime(duration)}
              </span>
            </div>
            {/* Fullscreen */}
            <button onClick={e => { e.stopPropagation(); toggleFS(); }} style={{ background:"transparent", border:"none", cursor:"pointer", color:"#9E9588" }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                {fullscreen ? <><path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3"/></> : <><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/></>}
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Big center play button */}
      {hasVideo && !playing && (
        <button onClick={e => { e.stopPropagation(); togglePlay(); }} style={{
          position:"absolute", top:"50%", left:"50%",
          transform:"translate(-50%,-50%)",
          width:"72px", height:"72px", borderRadius:"50%",
          background:"rgba(191,141,60,0.18)", border:"1.5px solid rgba(191,141,60,0.6)",
          display:"flex", alignItems:"center", justifyContent:"center",
          cursor:"pointer", zIndex:8,
          backdropFilter:"blur(8px)",
          transition:"all .3s ease",
          animation:"glowPulse 3s ease-in-out infinite",
        }}
        onMouseEnter={e => { e.currentTarget.style.background="rgba(191,141,60,0.32)"; e.currentTarget.style.transform="translate(-50%,-50%) scale(1.08)"; }}
        onMouseLeave={e => { e.currentTarget.style.background="rgba(191,141,60,0.18)"; e.currentTarget.style.transform="translate(-50%,-50%) scale(1)"; }}
        >
          <svg width="26" height="26" viewBox="0 0 24 24" fill="#BF8D3C"><polygon points="6,3 20,12 6,21"/></svg>
        </button>
      )}

      {/* Title overlay (top-left) */}
      {title && (
        <div style={{ position:"absolute", top:"16px", left:"20px", zIndex:8 }}>
          <p style={{ fontSize:"9px", letterSpacing:"0.3em", color:"#BF8D3C", textTransform:"uppercase" }}>{subtitle}</p>
          <p style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"16px", fontStyle:"italic", color:"#F2EDE4", marginTop:"2px" }}>{title}</p>
        </div>
      )}
    </div>
  );
}

/* ─── NAVBAR ─────────────────────────────────────────────────────────────── */
function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);
  const links = ["Story","Gym","Reel","Captions","Friends","Wish"];
  return (
    <nav style={{
      position:"fixed", top:0, left:0, right:0, zIndex:100,
      padding:"18px 40px",
      background: scrolled ? "rgba(8,8,8,0.96)" : "transparent",
      backdropFilter: scrolled ? "blur(20px)" : "none",
      borderBottom: scrolled ? "0.5px solid rgba(191,141,60,0.2)" : "none",
      transition:"all .5s ease",
      display:"flex", alignItems:"center", justifyContent:"space-between",
    }}>
      <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"20px", fontWeight:500, letterSpacing:"0.1em", color:"#BF8D3C" }}>✦ TRIBUTE</div>
      <div style={{ display:"flex", gap:"28px" }}>
        {links.map(l => (
          <a key={l} href={`#${l.toLowerCase()}`} style={{ color:"#9E9588", textDecoration:"none", fontSize:"10px", letterSpacing:"0.2em", textTransform:"uppercase", fontWeight:400, transition:"color .3s" }}
            onMouseEnter={e=>e.target.style.color="#BF8D3C"}
            onMouseLeave={e=>e.target.style.color="#9E9588"}
          >{l}</a>
        ))}
      </div>
    </nav>
  );
}

/* ─── HERO ───────────────────────────────────────────────────────────────── */
function HeroSection() {
  const [loaded, setLoaded] = useState(false);
  const [bgIndex, setBgIndex] = useState(0);
  const bgImages = [
    "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1600&q=80",
    "https://images.unsplash.com/photo-1508807526345-15e9b5f4eaff?w=1600&q=80",
    "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=1600&q=80",
    "https://images.unsplash.com/photo-1547153760-18fc86324498?w=1600&q=80",
    "https://images.unsplash.com/photo-1504609813442-a8924e83f76e?w=1600&q=80",
  ];
  useEffect(() => { setTimeout(()=>setLoaded(true),200); },[]);
  useEffect(() => {
    const t = setInterval(()=>setBgIndex(p=>(p+1)%bgImages.length),5000);
    return () => clearInterval(t);
  },[]);

  return (
    <section style={{ minHeight:"100vh", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", position:"relative", overflow:"hidden", padding:"120px 24px 80px" }}>
      {bgImages.map((src,i) => (
        <div key={i} style={{ position:"absolute", inset:0, zIndex:0, opacity:i===bgIndex?1:0, transition:"opacity 1.8s ease" }}>
          <img src={src} alt="" style={{ width:"100%", height:"100%", objectFit:"cover", animation:i===bgIndex?"bgZoom 10s ease-in-out both":"none", filter:"brightness(0.22) saturate(0.5)" }}/>
        </div>
      ))}
      <div style={{ position:"absolute", inset:0, zIndex:1, background:"linear-gradient(to bottom,rgba(8,8,8,.45) 0%,rgba(8,8,8,.15) 50%,rgba(8,8,8,.75) 100%)" }}/>
      <div style={{ position:"absolute", inset:0, zIndex:1, background:"radial-gradient(ellipse at center,rgba(191,141,60,.07) 0%,transparent 70%)", animation:"pulse 6s ease-in-out infinite" }}/>

      {/* dots */}
      <div style={{ position:"absolute", bottom:"72px", left:"50%", transform:"translateX(-50%)", display:"flex", gap:"8px", zIndex:10 }}>
        {bgImages.map((_,i)=>(
          <button key={i} onClick={()=>setBgIndex(i)} style={{ width:i===bgIndex?"24px":"6px", height:"6px", borderRadius:"3px", background:i===bgIndex?"#BF8D3C":"rgba(191,141,60,.3)", border:"none", cursor:"pointer", transition:"all .4s ease", padding:0 }}/>
        ))}
      </div>

      {[{top:80,left:40},{top:80,right:40},{bottom:100,left:40},{bottom:100,right:40}].map((pos,i)=>(
        <div key={i} style={{ position:"absolute",...pos, zIndex:5, width:"50px", height:"50px",
          borderTop:    i<2  ?"0.5px solid rgba(191,141,60,.55)":"none",
          borderBottom: i>=2 ?"0.5px solid rgba(191,141,60,.55)":"none",
          borderLeft:   i%2===0?"0.5px solid rgba(191,141,60,.55)":"none",
          borderRight:  i%2===1?"0.5px solid rgba(191,141,60,.55)":"none",
        }}/>
      ))}

      <div style={{ opacity:loaded?1:0, transition:"opacity 1s ease", textAlign:"center", maxWidth:"900px", position:"relative", zIndex:5 }}>
        <p style={{ fontSize:"11px", letterSpacing:"0.4em", textTransform:"uppercase", color:"#BF8D3C", fontWeight:400, marginBottom:"32px", animation:loaded?"fadeUp 0.8s ease both":"none", animationDelay:".1s" }}>✦ &nbsp; A Celebration of a Life &nbsp; ✦</p>
        <h1 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"clamp(48px,10vw,110px)", fontWeight:300, lineHeight:1.05, letterSpacing:"-0.02em", color:"#F2EDE4", marginBottom:"20px", animation:loaded?"fadeUp 1s ease both":"none", animationDelay:".3s", textShadow:"0 4px 40px rgba(0,0,0,.9)" }}>
          From <em style={{ fontStyle:"italic", color:"#BF8D3C" }}>Waiting</em><br/>to Wonder
        </h1>
        <div style={{ animation:loaded?"fadeIn 1s ease both":"none", animationDelay:".7s", margin:"36px 0" }}><GoldDivider/></div>
        <p style={{ fontSize:"clamp(14px,2.5vw,18px)", color:"#C4BAB0", fontWeight:300, lineHeight:1.8, letterSpacing:".03em", maxWidth:"600px", margin:"0 auto 48px", animation:loaded?"fadeUp 1s ease both":"none", animationDelay:".9s", textShadow:"0 2px 20px rgba(0,0,0,.95)" }}>
          A journey worth celebrating — from a child born of patience and prayers, to a man who built himself from the inside out.
        </p>
        <div style={{ display:"flex", gap:"16px", justifyContent:"center", flexWrap:"wrap", animation:loaded?"fadeUp 1s ease both":"none", animationDelay:"1.1s" }}>
          {[{icon:"💪",label:"Fighter"},{icon:"💃",label:"Dancer"},{icon:"🏋️",label:"Builder"},{icon:"🌟",label:"Legend"}].map(({icon,label})=>(
            <div key={label} style={{ padding:"10px 22px", border:"0.5px solid rgba(191,141,60,.45)", borderRadius:"2px", fontSize:"11px", letterSpacing:".25em", textTransform:"uppercase", color:"#BF8D3C", display:"flex", gap:"8px", alignItems:"center", background:"rgba(8,8,8,.45)", backdropFilter:"blur(8px)" }}>
              <span style={{ fontSize:"14px" }}>{icon}</span>{label}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── STORY SECTION ──────────────────────────────────────────────────────── */
function StorySection() {
  const ref = useReveal();
  const chapters = [
    { num:"01", title:"The Miracle of His Beginning", icon:"✨", date:"A Dream Fulfilled",
      img:"https://images.unsplash.com/photo-1544027993-37dbfe43562a?w=800&q=80",
      content:"After nearly two decades of waiting, hope, and countless prayers, he arrived as a blessing — their only child, their greatest joy. His birthday is not just a date; it's a celebration of patience, love, and a dream finally fulfilled. Every year, this day reminds everyone around him of how special his existence truly is." },
    { num:"02", title:"The Childhood That Shaped Him", icon:"🌱", date:"A Foundation of Resilience",
      img:"https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800&q=80",
      content:"As a child, he was adorably chubby — full of innocence and charm. Some misunderstood him. Those moments may have been difficult, but they quietly built a strong foundation within him. Instead of breaking him, those experiences shaped his resilience — teaching him that self-worth comes from within, not from others' opinions." },
    { num:"03", title:"An Average Student with Extraordinary Passion", icon:"💃", date:"Dance — His Voice, His Soul",
      img:"https://images.unsplash.com/photo-1508807526345-15e9b5f4eaff?w=800&q=80",
      content:"Academically, he was just like many others. But what made him stand out was something far more powerful: his love for dance. Dance wasn't just a hobby; it was his escape, his strength, his voice. When words failed, his movements spoke. When confidence shook, dance lifted him up." },
  ];

  return (
    <section id="story" ref={ref} style={{ padding:"100px 24px", maxWidth:"1100px", margin:"0 auto" }}>
      <div className="reveal" style={{ textAlign:"center", marginBottom:"80px" }}>
        <p style={{ fontSize:"10px", letterSpacing:".4em", color:"#BF8D3C", textTransform:"uppercase", marginBottom:"16px" }}>Chapter One</p>
        <h2 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"clamp(36px,6vw,64px)", fontWeight:300, color:"#F2EDE4", letterSpacing:"-0.02em" }}>The Story of <em style={{ fontStyle:"italic", color:"#BF8D3C" }}>Growth</em></h2>
        <GoldDivider style={{ marginTop:"32px", maxWidth:"400px", margin:"32px auto 0" }}/>
      </div>
      <div style={{ display:"flex", flexDirection:"column", gap:"80px" }}>
        {chapters.map((ch,i)=>(
          <div key={ch.num} className={`reveal reveal-delay-${i+1}`} style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"56px", alignItems:"center" }}>
            {i%2===0 && (
              <div style={{ position:"relative", overflow:"hidden", borderRadius:"2px", aspectRatio:"4/5" }}>
                <img src={ch.img} alt={ch.title} className="img-cinematic"/>
                <div style={{ position:"absolute", inset:"12px", border:"0.5px solid rgba(191,141,60,.4)", borderRadius:"1px", pointerEvents:"none" }}/>
                <div style={{ position:"absolute", bottom:0, left:0, right:0, height:"50%", background:"linear-gradient(to top,rgba(8,8,8,.75),transparent)", pointerEvents:"none" }}/>
                <p style={{ position:"absolute", bottom:"18px", left:"18px", fontSize:"9px", letterSpacing:".3em", color:"#BF8D3C", textTransform:"uppercase" }}>{ch.num} · {ch.date}</p>
              </div>
            )}
            <div style={{ position:"relative" }}>
              <span style={{ position:"absolute", top:"-40px", right:i%2===0?"auto":"-10px", left:i%2===0?"-10px":"auto", fontFamily:"'Cormorant Garamond',serif", fontSize:"clamp(80px,12vw,130px)", fontWeight:600, color:"rgba(191,141,60,.05)", lineHeight:1, pointerEvents:"none", userSelect:"none" }}>{ch.num}</span>
              <div style={{ background:"linear-gradient(135deg,rgba(191,141,60,.07) 0%,transparent 100%)", border:"0.5px solid rgba(191,141,60,.18)", borderRadius:"2px", padding:"36px", position:"relative", zIndex:1, marginBottom:"24px" }}>
                <p style={{ fontSize:"26px", marginBottom:"12px" }}>{ch.icon}</p>
                <h3 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"clamp(22px,3vw,32px)", fontWeight:400, color:"#F2EDE4", lineHeight:1.2, marginBottom:"6px" }}>{ch.title}</h3>
                <p style={{ fontSize:"10px", letterSpacing:".3em", color:"#BF8D3C", textTransform:"uppercase" }}>{ch.date}</p>
              </div>
              <p style={{ fontSize:"clamp(14px,1.8vw,16px)", color:"#9E9588", lineHeight:1.9, fontWeight:300 }}>{ch.content}</p>
            </div>
            {i%2!==0 && (
              <div style={{ position:"relative", overflow:"hidden", borderRadius:"2px", aspectRatio:"4/5" }}>
                <img src={ch.img} alt={ch.title} className="img-cinematic"/>
                <div style={{ position:"absolute", inset:"12px", border:"0.5px solid rgba(191,141,60,.4)", borderRadius:"1px", pointerEvents:"none" }}/>
                <div style={{ position:"absolute", bottom:0, left:0, right:0, height:"50%", background:"linear-gradient(to top,rgba(8,8,8,.75),transparent)", pointerEvents:"none" }}/>
                <p style={{ position:"absolute", bottom:"18px", left:"18px", fontSize:"9px", letterSpacing:".3em", color:"#BF8D3C", textTransform:"uppercase" }}>{ch.num} · {ch.date}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

/* ─── GYM SECTION ────────────────────────────────────────────────────────── */
function GymSection() {
  const ref = useReveal();
  const gymImages = [
    "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80",
    "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&q=80",
    "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=800&q=80",
  ];
  const slides = [
    {label:"Sad?",result:"Gym"},{label:"Happy?",result:"Gym"},
    {label:"Broken?",result:"Gym"},{label:"Overwhelmed?",result:"Gym"},
  ];

  return (
    <section id="gym" ref={ref} style={{ padding:"120px 24px", background:"linear-gradient(180deg,#080808 0%,#0e0a04 50%,#080808 100%)", position:"relative", overflow:"hidden" }}>
      <div style={{ position:"absolute", top:"50%", left:"50%", transform:"translate(-50%,-50%)", fontFamily:"'Cormorant Garamond',serif", fontSize:"clamp(80px,20vw,220px)", fontWeight:600, color:"rgba(191,141,60,.04)", letterSpacing:"-0.05em", whiteSpace:"nowrap", pointerEvents:"none", userSelect:"none" }}>STRENGTH</div>
      <div style={{ maxWidth:"1100px", margin:"0 auto", position:"relative", zIndex:1 }}>
        <div className="reveal" style={{ textAlign:"center", marginBottom:"80px" }}>
          <p style={{ fontSize:"10px", letterSpacing:".4em", color:"#BF8D3C", textTransform:"uppercase", marginBottom:"16px" }}>Chapter Two</p>
          <h2 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"clamp(40px,7vw,72px)", fontWeight:300, color:"#F2EDE4", letterSpacing:"-0.02em", lineHeight:1.1, marginBottom:"12px" }}>The <em style={{ fontStyle:"italic", color:"#BF8D3C" }}>Transformation</em></h2>
          <p style={{ fontSize:"10px", letterSpacing:".4em", color:"#BF8D3C", textTransform:"uppercase" }}>🏋️‍♂️ Strength Became His Identity</p>
        </div>
        <div className="reveal reveal-delay-2" style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"40px", marginBottom:"60px", alignItems:"stretch" }}>
          <div style={{ display:"grid", gridTemplateRows:"1.4fr 1fr", gap:"4px", minHeight:"420px" }}>
            <div style={{ overflow:"hidden", borderRadius:"2px", position:"relative" }}>
              <img src={gymImages[0]} alt="Gym" className="img-cinematic"/>
              <div style={{ position:"absolute", inset:"10px", border:"0.5px solid rgba(191,141,60,.3)", borderRadius:"1px", pointerEvents:"none" }}/>
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"4px" }}>
              {gymImages.slice(1).map((src,i)=>(
                <div key={i} style={{ overflow:"hidden", borderRadius:"2px" }}><img src={src} alt="Gym" className="img-cinematic"/></div>
              ))}
            </div>
          </div>
          <div style={{ display:"flex", flexDirection:"column", gap:"4px" }}>
            {slides.map((s,i)=>(
              <div key={i} style={{ flex:1, background:"rgba(191,141,60,.05)", border:"0.5px solid rgba(191,141,60,.15)", padding:"20px 28px", display:"flex", alignItems:"center", justifyContent:"space-between", transition:"all .3s ease", cursor:"default", borderRadius:"1px" }}
                onMouseEnter={e=>{e.currentTarget.style.background="rgba(191,141,60,.12)";e.currentTarget.style.borderColor="rgba(191,141,60,.4)"}}
                onMouseLeave={e=>{e.currentTarget.style.background="rgba(191,141,60,.05)";e.currentTarget.style.borderColor="rgba(191,141,60,.15)"}}>
                <p style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"20px", color:"#9E9588" }}>{s.label}</p>
                <p style={{ fontSize:"18px", color:"rgba(191,141,60,.6)" }}>→</p>
                <p style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"24px", fontWeight:500, color:"#F2EDE4" }}>{s.result}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="reveal reveal-delay-3" style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"40px" }}>
          <p style={{ fontSize:"clamp(14px,2vw,16px)", color:"#9E9588", lineHeight:1.9, fontWeight:300 }}>Life changed when he decided to step into the gym — not just to transform his body, but to transform his mind and life. For him, the gym is not just a place — it is his world, his therapy, his peace.</p>
          <p style={{ fontSize:"clamp(14px,2vw,16px)", color:"#9E9588", lineHeight:1.9, fontWeight:300 }}>Pain doesn't break him — it <em style={{ fontStyle:"italic", color:"#BF8D3C" }}>fuels</em> him. Every drop of sweat, every bit of pain, gives him happiness and strength. Today, he stands confident and transformed — living like a fighter who never gave up.</p>
        </div>
      </div>
    </section>
  );
}

/* ─── 3. GYM REEL SECTION ────────────────────────────────────────────────── */
function GymReelSection() {
  const ref = useReveal();
  const [activeReel, setActiveReel] = useState(0);

  const reels = [
    { src: GYM_REEL_1, title:"The Grind", subtitle:"Reel 01 · Strength Training", poster:"https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80", quote:"Pain is not pain for him… it's happiness." },
    { src: GYM_REEL_2, title:"The Hustle", subtitle:"Reel 02 · Cardio & Endurance", poster:"https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&q=80", quote:"Built by pain. Driven by passion." },
    { src: GYM_REEL_3, title:"The Beast Mode", subtitle:"Reel 03 · Peak Performance", poster:"https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=800&q=80", quote:"Not born strong — but became unstoppable." },
  ];

  return (
    <section id="reel" ref={ref} style={{ padding:"120px 24px", background:"#060606", position:"relative", overflow:"hidden" }}>

      {/* Decorative film perforations left & right */}
      {["left:0","right:0"].map((side,si)=>(
        <div key={si} style={{ position:"absolute", top:0, bottom:0, [si===0?"left":"right"]:0, width:"28px", display:"flex", flexDirection:"column", justifyContent:"space-evenly", alignItems:"center", zIndex:2 }}>
          {Array.from({length:14}).map((_,i)=>(
            <div key={i} style={{ width:"14px", height:"10px", borderRadius:"2px", background:"rgba(191,141,60,.08)", border:"0.5px solid rgba(191,141,60,.12)" }}/>
          ))}
        </div>
      ))}

      <div style={{ maxWidth:"1100px", margin:"0 auto", position:"relative", zIndex:3 }}>
        <div className="reveal" style={{ textAlign:"center", marginBottom:"64px" }}>
          <p style={{ fontSize:"10px", letterSpacing:".4em", color:"#BF8D3C", textTransform:"uppercase", marginBottom:"16px" }}>🎬 &nbsp; Gym Reels</p>
          <h2 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"clamp(36px,6vw,64px)", fontWeight:300, color:"#F2EDE4", letterSpacing:"-0.02em" }}>
            Where <em style={{ fontStyle:"italic", color:"#BF8D3C" }}>Legends</em> Are Made
          </h2>
          <p style={{ fontSize:"clamp(14px,2vw,16px)", color:"#9E9588", marginTop:"16px", lineHeight:1.7, maxWidth:"520px", margin:"16px auto 0" }}>
            Watch the man who turned the gym into his therapy, his world, his identity.
          </p>
          <GoldDivider style={{ marginTop:"32px", maxWidth:"300px", margin:"32px auto 0" }}/>
        </div>

        <div className="reveal reveal-delay-2" style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"40px", alignItems:"start" }}>

          {/* Left — main player */}
          <div>
            <CinematicPlayer
              src={reels[activeReel].src}
              poster={reels[activeReel].poster}
              title={reels[activeReel].title}
              subtitle={reels[activeReel].subtitle}
            />
            {/* Quote under player */}
            <div style={{ marginTop:"20px", paddingLeft:"16px", borderLeft:"2px solid #BF8D3C" }}>
              <p style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"18px", fontStyle:"italic", color:"#BF8D3C" }}>
                "{reels[activeReel].quote}"
              </p>
            </div>
          </div>

          {/* Right — reel selector + stats */}
          <div style={{ display:"flex", flexDirection:"column", gap:"12px" }}>
            {reels.map((r,i)=>(
              <div key={i} onClick={()=>setActiveReel(i)} style={{
                display:"flex", gap:"16px", alignItems:"center",
                padding:"16px 20px", cursor:"pointer", borderRadius:"2px",
                background: i===activeReel?"rgba(191,141,60,.1)":"rgba(191,141,60,.03)",
                border: i===activeReel?"0.5px solid rgba(191,141,60,.5)":"0.5px solid rgba(191,141,60,.12)",
                transition:"all .3s ease",
              }}
              onMouseEnter={e=>{ if(i!==activeReel){ e.currentTarget.style.background="rgba(191,141,60,.07)"; e.currentTarget.style.borderColor="rgba(191,141,60,.25)"; } }}
              onMouseLeave={e=>{ if(i!==activeReel){ e.currentTarget.style.background="rgba(191,141,60,.03)"; e.currentTarget.style.borderColor="rgba(191,141,60,.12)"; } }}
              >
                <div style={{ width:"64px", height:"48px", borderRadius:"2px", overflow:"hidden", flexShrink:0, position:"relative" }}>
                  <img src={r.poster} alt={r.title} style={{ width:"100%", height:"100%", objectFit:"cover", filter:"brightness(.55)" }}/>
                  {i===activeReel && (
                    <div style={{ position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center", background:"rgba(191,141,60,.2)" }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="#BF8D3C"><polygon points="5,3 19,12 5,21"/></svg>
                    </div>
                  )}
                </div>
                <div>
                  <p style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"18px", fontWeight:400, color: i===activeReel?"#F2EDE4":"#9E9588" }}>{r.title}</p>
                  <p style={{ fontSize:"9px", letterSpacing:".25em", color:"#BF8D3C", textTransform:"uppercase", marginTop:"2px" }}>{r.subtitle}</p>
                </div>
                {i===activeReel && <div style={{ marginLeft:"auto", width:"6px", height:"6px", borderRadius:"50%", background:"#BF8D3C", flexShrink:0, animation:"pulse 1.5s ease-in-out infinite" }}/>}
              </div>
            ))}

            {/* Stats */}
            <div style={{ marginTop:"12px", display:"grid", gridTemplateColumns:"1fr 1fr", gap:"2px" }}>
              {[
                {icon:"🏋️",val:"Daily",label:"Gym visits"},
                {icon:"💪",val:"365+",label:"Days of grind"},
                {icon:"🔥",val:"Zero",label:"Days of giving up"},
                {icon:"⚡",val:"∞",label:"Willpower"},
              ].map(({icon,val,label})=>(
                <div key={label} style={{ padding:"20px 16px", background:"rgba(191,141,60,.04)", border:"0.5px solid rgba(191,141,60,.12)", textAlign:"center" }}>
                  <p style={{ fontSize:"20px", marginBottom:"6px" }}>{icon}</p>
                  <p style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"24px", fontWeight:500, color:"#F2EDE4" }}>{val}</p>
                  <p style={{ fontSize:"9px", letterSpacing:".2em", color:"#9E9588", textTransform:"uppercase", marginTop:"4px" }}>{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── QUOTES SECTION ─────────────────────────────────────────────────────── */
function QuotesSection() {
  const ref = useReveal();
  const [active, setActive] = useState(0);
  const quotes = [
    { text:"From waiting… to becoming.\nFrom being judged… to being respected.\nFrom pain… to power.\n\nHe didn't just grow — he transformed.", label:"Option I — Strong & Emotional" },
    { text:"Built by pain.\nDriven by passion.\nDefined by discipline.\n\nGym is his escape.\nDance is his identity.\n\nThis is his story.", label:"Option II — Short & Punchy" },
    { text:"If life hits him…\nhe lifts harder.\n\nIf life tests him…\nhe comes back stronger.\n\nNot born strong —\nbut became unstoppable.", label:"Option III — Mass Hero Vibe" },
  ];
  const voiceover = `"They saw a boy… but he saw a future.\nThey laughed… but he worked.\nThey doubted… but he believed.\n\nWhen life got heavy…\nhe lifted heavier.\n\nThis isn't just a birthday…\nthis is the rise of a man who built himself."`;

  return (
    <section id="captions" ref={ref} style={{ padding:"120px 24px", maxWidth:"1100px", margin:"0 auto" }}>
      <div className="reveal" style={{ textAlign:"center", marginBottom:"60px" }}>
        <p style={{ fontSize:"10px", letterSpacing:".4em", color:"#BF8D3C", textTransform:"uppercase", marginBottom:"16px" }}>Cinematic Captions</p>
        <h2 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"clamp(36px,6vw,64px)", fontWeight:300, color:"#F2EDE4", letterSpacing:"-0.02em" }}>His Story in <em style={{ fontStyle:"italic", color:"#BF8D3C" }}>Words</em></h2>
        <GoldDivider style={{ marginTop:"32px", maxWidth:"300px", margin:"32px auto 0" }}/>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"48px", alignItems:"start" }}>
        <div className="reveal reveal-delay-1" style={{ position:"relative", overflow:"hidden", borderRadius:"2px", aspectRatio:"3/4" }}>
          <img src="https://images.unsplash.com/photo-1508807526345-15e9b5f4eaff?w=800&q=80" alt="Dance" className="img-cinematic"/>
          <div style={{ position:"absolute", inset:"12px", border:"0.5px solid rgba(191,141,60,.4)", borderRadius:"1px", pointerEvents:"none" }}/>
          <div style={{ position:"absolute", bottom:0, left:0, right:0, height:"60%", background:"linear-gradient(to top,rgba(8,8,8,.9),transparent)", pointerEvents:"none" }}/>
          <div style={{ position:"absolute", bottom:"24px", left:"24px", right:"24px" }}>
            <p style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"20px", fontStyle:"italic", color:"#F2EDE4", lineHeight:1.5 }}>"Dance is not his hobby…<br/>it's his <span style={{ color:"#BF8D3C" }}>soul.</span>"</p>
          </div>
        </div>
        <div className="reveal reveal-delay-2">
          <div style={{ display:"flex", gap:"8px", marginBottom:"28px", flexWrap:"wrap" }}>
            {quotes.map((q,i)=>(
              <button key={i} onClick={()=>setActive(i)} style={{ padding:"8px 18px", background:i===active?"rgba(191,141,60,.15)":"transparent", border:i===active?"0.5px solid #BF8D3C":"0.5px solid rgba(191,141,60,.25)", borderRadius:"2px", color:i===active?"#BF8D3C":"#9E9588", fontSize:"10px", letterSpacing:".2em", textTransform:"uppercase", cursor:"pointer", transition:"all .3s ease", fontFamily:"'Jost',sans-serif" }}>0{i+1}</button>
            ))}
          </div>
          <div style={{ background:"rgba(191,141,60,.04)", border:"0.5px solid rgba(191,141,60,.2)", borderRadius:"2px", padding:"44px 36px", position:"relative", marginBottom:"36px", animation:"borderGlow 4s ease-in-out infinite" }}>
            <div style={{ position:"absolute", top:"14px", left:"22px", fontFamily:"'Cormorant Garamond',serif", fontSize:"64px", color:"rgba(191,141,60,.12)", lineHeight:1 }}>"</div>
            <p style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"clamp(17px,2.5vw,22px)", color:"#F2EDE4", lineHeight:1.7, fontWeight:300, fontStyle:"italic", whiteSpace:"pre-line", position:"relative", zIndex:1 }}>{quotes[active].text}</p>
            <p style={{ marginTop:"20px", fontSize:"9px", letterSpacing:".35em", color:"#BF8D3C", textTransform:"uppercase" }}>{quotes[active].label}</p>
            <div style={{ position:"absolute", bottom:"14px", right:"22px", fontFamily:"'Cormorant Garamond',serif", fontSize:"64px", color:"rgba(191,141,60,.12)", lineHeight:1 }}>"</div>
          </div>
          <div style={{ borderLeft:"1px solid #BF8D3C", paddingLeft:"28px" }}>
            <p style={{ fontSize:"9px", letterSpacing:".35em", color:"#BF8D3C", textTransform:"uppercase", marginBottom:"16px" }}>🎬 Cinematic Voiceover</p>
            <p style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"clamp(15px,2vw,18px)", color:"#9E9588", lineHeight:1.9, fontWeight:300, fontStyle:"italic", whiteSpace:"pre-line" }}>{voiceover}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── CHANDRA SECRET MESSAGE ─────────────────────────────────────────────── */
function ChandraSecretMessage() {
  const [opened, setOpened] = useState(false);
  const handleOpen = () => setOpened(true);

  return (
    <div style={{ marginTop:"64px", display:"flex", flexDirection:"column", alignItems:"center" }}>
      <div style={{ textAlign:"center", marginBottom:"36px" }}>
        <div style={{ display:"inline-flex", alignItems:"center", gap:"10px", padding:"8px 24px", border:"0.5px solid rgba(191,141,60,.4)", borderRadius:"20px", background:"rgba(191,141,60,.06)", marginBottom:"14px" }}>
          <span style={{ fontSize:"14px" }}>🔐</span>
          <p style={{ fontSize:"10px", letterSpacing:".3em", color:"#BF8D3C", textTransform:"uppercase" }}>Secret Message · Unlocked</p>
          <span style={{ fontSize:"14px" }}>💌</span>
        </div>
        <p style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"22px", fontStyle:"italic", color:"#9E9588" }}>A letter from your best friend, <em style={{ color:"#BF8D3C" }}>Chandra</em></p>
      </div>

      {!opened ? (
        <div style={{ position:"relative", cursor:"pointer", animation:"glowPulse 3s ease-in-out infinite" }} onClick={handleOpen}>
          <div style={{ width:"360px", height:"230px", background:"linear-gradient(135deg,rgba(191,141,60,.14) 0%,rgba(191,141,60,.04) 100%)", border:"0.5px solid rgba(191,141,60,.45)", borderRadius:"4px", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:"14px", position:"relative", overflow:"hidden", transition:"transform .3s ease" }}
            onMouseEnter={e=>e.currentTarget.style.transform="scale(1.03)"}
            onMouseLeave={e=>e.currentTarget.style.transform="scale(1)"}>
            <div style={{ position:"absolute", top:0, left:0, right:0, height:0, borderBottom:"90px solid rgba(191,141,60,.1)", borderLeft:"180px solid transparent", borderRight:"180px solid transparent", pointerEvents:"none" }}/>
            <span style={{ fontSize:"40px", zIndex:1 }}>💌</span>
            <p style={{ fontSize:"10px", letterSpacing:".3em", color:"#BF8D3C", textTransform:"uppercase", zIndex:1 }}>Tap to open</p>
            <p style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"16px", fontStyle:"italic", color:"#9E9588", zIndex:1 }}>From Chandra, with love</p>
            <div style={{ position:"absolute", bottom:"-16px", width:"44px", height:"44px", background:"linear-gradient(135deg,#BF8D3C,#7A5218)", borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"18px", zIndex:2, boxShadow:"0 2px 16px rgba(191,141,60,.5)" }}>✦</div>
          </div>
        </div>
      ) : (
        <div style={{ maxWidth:"720px", width:"100%", background:"linear-gradient(160deg,rgba(191,141,60,.09) 0%,rgba(10,8,3,1) 55%)", border:"0.5px solid rgba(191,141,60,.38)", borderRadius:"4px", padding:"60px 56px", position:"relative", overflow:"hidden", animation:"envelopeOpen .65s cubic-bezier(.16,1,.3,1) both" }}>
          <div style={{ position:"absolute", top:0, left:0, right:0, height:"2px", background:"linear-gradient(to right,transparent,#BF8D3C,transparent)" }}/>
          <div style={{ position:"absolute", bottom:0, left:0, right:0, height:"2px", background:"linear-gradient(to right,transparent,#BF8D3C,transparent)" }}/>
          {[{top:16,left:16},{top:16,right:16},{bottom:16,left:16},{bottom:16,right:16}].map((pos,i)=>(
            <div key={i} style={{ position:"absolute",...pos, width:"22px", height:"22px", borderTop:i<2?"0.5px solid rgba(191,141,60,.5)":"none", borderBottom:i>=2?"0.5px solid rgba(191,141,60,.5)":"none", borderLeft:i%2===0?"0.5px solid rgba(191,141,60,.5)":"none", borderRight:i%2===1?"0.5px solid rgba(191,141,60,.5)":"none" }}/>
          ))}
          <p style={{ fontSize:"9px", letterSpacing:".38em", color:"#BF8D3C", textTransform:"uppercase", marginBottom:"32px" }}>💌 From Chandra · Your Best Friend</p>
          <p style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"clamp(16px,2.5vw,20px)", fontStyle:"italic", color:"#C4BAB0", lineHeight:2, marginBottom:"24px" }}>Dear friend,</p>
          <p style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"clamp(16px,2.5vw,21px)", fontStyle:"italic", color:"#F2EDE4", lineHeight:2, marginBottom:"24px" }}>"I may have been your senior once, but somewhere along the way, you became someone I genuinely look up to. Not because of your title, your muscles, or your dance moves — though yes, the dance moves are <em style={{ color:"#BF8D3C" }}>absolutely elite</em> — but because of how quietly and relentlessly you show up for yourself every single day.</p>
          <p style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"clamp(16px,2.5vw,21px)", fontStyle:"italic", color:"#F2EDE4", lineHeight:2, marginBottom:"24px" }}>I didn't expect us to become this close. Three years in the same company, and yet it took just a few real conversations to feel like we'd known each other for a lifetime. Thank you for being the kind of friend who laughs loudly, listens deeply, and never makes you feel like a burden.</p>
          <p style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"clamp(16px,2.5vw,21px)", fontStyle:"italic", color:"#F2EDE4", lineHeight:2, marginBottom:"40px" }}>The gym is your world. Dance is your soul. Friendship is your gift. On your birthday, I want you to know — the world is better, louder, and so much <em style={{ color:"#BF8D3C" }}>more alive</em> with you in it. Keep building. Keep dancing. Keep being unapologetically <em style={{ color:"#BF8D3C" }}>you.</em>"</p>
          <GoldDivider style={{ marginBottom:"28px" }}/>
          <div style={{ display:"flex", justifyContent:"flex-end", alignItems:"center", gap:"16px" }}>
            <div style={{ textAlign:"right" }}>
              <p style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"24px", fontStyle:"italic", color:"#BF8D3C" }}>Chandra</p>
              <p style={{ fontSize:"10px", letterSpacing:".25em", color:"#9E9588", textTransform:"uppercase" }}>Your Best Friend · Always 💙</p>
            </div>
            <div style={{ width:"52px", height:"52px", background:"linear-gradient(135deg,rgba(191,141,60,.3),rgba(191,141,60,.08))", borderRadius:"50%", border:"0.5px solid rgba(191,141,60,.4)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"24px" }}>💙</div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── FRIENDS SECTION ────────────────────────────────────────────────────── */
function FriendsSection() {
  const ref = useReveal();
  return (
    <section id="friends" ref={ref} style={{ padding:"120px 24px", maxWidth:"1100px", margin:"0 auto" }}>
      <div className="reveal" style={{ textAlign:"center", marginBottom:"80px" }}>
        <p style={{ fontSize:"10px", letterSpacing:".4em", color:"#BF8D3C", textTransform:"uppercase", marginBottom:"16px" }}>Chapter Three</p>
        <h2 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"clamp(36px,6vw,64px)", fontWeight:300, color:"#F2EDE4", letterSpacing:"-0.02em" }}>Bonds & <em style={{ fontStyle:"italic", color:"#BF8D3C" }}>Brotherhood</em></h2>
        <GoldDivider style={{ marginTop:"32px", maxWidth:"300px", margin:"32px auto 0" }}/>
      </div>

      {[
        { img:"https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?w=800&q=80", icon:"💙", name:"Chandra", role:"Once Senior · Now Soulmate Friend", label:"Best Friend", quote:"What started unexpectedly has turned into a collection of unforgettable memories.", body:"Though she was once his senior, time transformed their connection into a deep and meaningful friendship. Even after working together for over three years, they weren't initially close. But recently, something changed — and they found comfort, laughter, and understanding in each other.", reverse:false },
        { img:"https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&q=80", icon:"🤝", name:"The Brotherhood", role:"Triplet Gundama · Mukesh · Bhaii", label:"Brotherhood", quote:"Together, they created moments no camera could ever fully capture.", body:"Weekends alive with temple visits, outings, movies, and evenings over coffee — these three are not just friends but a family of their own. Evening breaks with coffee turn into deep talks and endless memories. A bond that is simple, real, and truly priceless.", reverse:true },
      ].map((c,i)=>(
        <div key={i} className={`reveal reveal-delay-${i+1}`} style={{ display:"grid", gridTemplateColumns:c.reverse?"1.5fr 1fr":"1fr 1.5fr", gap:"48px", alignItems:"center", marginBottom:"48px", background:"linear-gradient(135deg,rgba(191,141,60,.07) 0%,rgba(191,141,60,.02) 100%)", border:"0.5px solid rgba(191,141,60,.2)", borderRadius:"2px", padding:"48px" }}>
          {!c.reverse && (
            <div style={{ position:"relative", overflow:"hidden", borderRadius:"2px", aspectRatio:"3/4" }}>
              <img src={c.img} alt={c.name} className="img-cinematic"/>
              <div style={{ position:"absolute", inset:"10px", border:"0.5px solid rgba(191,141,60,.35)", borderRadius:"1px", pointerEvents:"none" }}/>
              <div style={{ position:"absolute", bottom:0, left:0, right:0, height:"40%", background:"linear-gradient(to top,rgba(8,8,8,.8),transparent)", pointerEvents:"none" }}/>
              <p style={{ position:"absolute", bottom:"16px", left:"16px", fontSize:"9px", letterSpacing:".3em", color:"#BF8D3C", textTransform:"uppercase" }}>{c.label}</p>
            </div>
          )}
          <div>
            <p style={{ fontSize:"36px", marginBottom:"18px", animation:"float 4s ease-in-out infinite" }}>{c.icon}</p>
            <h3 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"36px", fontWeight:400, color:"#F2EDE4", marginBottom:"6px" }}>{c.name}</h3>
            <p style={{ fontSize:"10px", letterSpacing:".25em", color:"#BF8D3C", textTransform:"uppercase", marginBottom:"18px" }}>{c.role}</p>
            <p style={{ color:"#9E9588", lineHeight:1.9, fontSize:"15px", fontWeight:300, marginBottom:"16px" }}>{c.body}</p>
            <p style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"18px", fontStyle:"italic", color:"#BF8D3C" }}>"{c.quote}"</p>
          </div>
          {c.reverse && (
            <div style={{ position:"relative", overflow:"hidden", borderRadius:"2px", aspectRatio:"3/4" }}>
              <img src={c.img} alt={c.name} className="img-cinematic"/>
              <div style={{ position:"absolute", inset:"10px", border:"0.5px solid rgba(191,141,60,.35)", borderRadius:"1px", pointerEvents:"none" }}/>
              <div style={{ position:"absolute", bottom:0, left:0, right:0, height:"40%", background:"linear-gradient(to top,rgba(8,8,8,.8),transparent)", pointerEvents:"none" }}/>
              <p style={{ position:"absolute", bottom:"16px", left:"16px", fontSize:"9px", letterSpacing:".3em", color:"#BF8D3C", textTransform:"uppercase" }}>{c.label}</p>
            </div>
          )}
        </div>
      ))}

      <div className="reveal reveal-delay-3" style={{ padding:"40px 48px", borderTop:"0.5px solid rgba(191,141,60,.15)", borderBottom:"0.5px solid rgba(191,141,60,.15)", display:"grid", gridTemplateColumns:"auto 1fr 1fr", gap:"36px", alignItems:"center", marginBottom:"80px" }}>
        <div style={{ overflow:"hidden", borderRadius:"2px", width:"130px", height:"130px", flexShrink:0 }}>
          <img src="https://images.unsplash.com/photo-1487528278747-ba99ed528ebc?w=400&q=80" alt="Career" className="img-cinematic" style={{ borderRadius:"2px" }}/>
        </div>
        <div>
          <p style={{ fontSize:"10px", letterSpacing:".35em", color:"#BF8D3C", textTransform:"uppercase", marginBottom:"10px" }}>💼 Career</p>
          <h3 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"clamp(22px,3vw,30px)", fontWeight:400, color:"#F2EDE4", lineHeight:1.2 }}>Balancing Dreams & Reality</h3>
        </div>
        <p style={{ color:"#9E9588", lineHeight:1.9, fontSize:"15px", fontWeight:300 }}>Though his heart beats for dance, life led him to IT — and he embraced it with responsibility. Today, he stands strong with not just one, but <em style={{ fontStyle:"italic", color:"#BF8D3C" }}>two accounts</em> in his professional journey, proving you can be practical without giving up on your passion.</p>
      </div>

      <div className="reveal reveal-delay-4"><ChandraSecretMessage/></div>
    </section>
  );
}

/* ─── STORY SLIDES CAROUSEL ──────────────────────────────────────────────── */
function TimelineSection() {
  const ref = useReveal();
  const [current, setCurrent] = useState(0);
  const [animating, setAnimating] = useState(false);
  const timerRef = useRef(null);

  const slides = [
    {slide:"01",icon:"✨",text:"From Waiting…\nto Wonder…",img:"https://images.unsplash.com/photo-1488702765232-3e95a9f4a12d?w=600&q=80"},
    {slide:"02",icon:"👶",text:"A dream his parents waited\n20 years to hold",img:"https://images.unsplash.com/photo-1544027993-37dbfe43562a?w=600&q=80"},
    {slide:"03",icon:"💭",text:"Once judged…\nonce misunderstood…",img:"https://images.unsplash.com/photo-1519791883288-dc8bd696e667?w=600&q=80"},
    {slide:"04",icon:"🔥",text:"But he never gave up\non himself",img:"https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?w=600&q=80"},
    {slide:"05",icon:"💃",text:"Dance became his voice\nwhen words failed",img:"https://images.unsplash.com/photo-1508807526345-15e9b5f4eaff?w=600&q=80"},
    {slide:"06",icon:"🏋️",text:"Gym became his world\nSad? Happy? Broken? → Gym",img:"https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&q=80"},
    {slide:"07",icon:"💪",text:"Pain is not pain for him…\nit's happiness.",img:"https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=600&q=80"},
    {slide:"08",icon:"✨",text:"He didn't change…\nHe transformed.",img:"https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=600&q=80"},
    {slide:"09",icon:"👬",text:"Friends. Memories. Brotherhood.\nMoments that matter",img:"https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&q=80"},
    {slide:"10",icon:"🌈",text:"Still rising…\nStill chasing…\nStill becoming…",img:"https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=600&q=80"},
  ];

  const go = useCallback((dir) => {
    if (animating) return;
    setAnimating(true);
    setCurrent(p => (p + dir + slides.length) % slides.length);
    setTimeout(() => setAnimating(false), 500);
  }, [animating, slides.length]);

  const resetAndGo = fn => {
    clearInterval(timerRef.current);
    fn();
    timerRef.current = setInterval(() => go(1), 4500);
  };

  useEffect(() => {
    timerRef.current = setInterval(() => go(1), 4500);
    return () => clearInterval(timerRef.current);
  }, [go]);

  const prevIdx = (current - 1 + slides.length) % slides.length;
  const nextIdx = (current + 1) % slides.length;
  const s = slides[current];

  return (
    <section style={{ padding:"120px 0", background:"#060606", overflow:"hidden" }}>
      <div ref={ref} style={{ maxWidth:"1200px", margin:"0 auto", padding:"0 24px" }}>
        <div className="reveal" style={{ textAlign:"center", marginBottom:"64px" }}>
          <p style={{ fontSize:"10px", letterSpacing:".4em", color:"#BF8D3C", textTransform:"uppercase", marginBottom:"16px" }}>📱 Story Slides</p>
          <h2 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"clamp(36px,6vw,64px)", fontWeight:300, color:"#F2EDE4", letterSpacing:"-0.02em" }}>The <em style={{ fontStyle:"italic", color:"#BF8D3C" }}>Reel</em> of a Life</h2>
        </div>
        <div className="reveal reveal-delay-2">
          <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:"20px", marginBottom:"40px" }}>
            <div onClick={()=>resetAndGo(()=>go(-1))} style={{ flexShrink:0, width:"160px", height:"290px", borderRadius:"10px", overflow:"hidden", opacity:.38, transform:"scale(.86)", transition:"all .5s ease", cursor:"pointer", filter:"brightness(.55)" }}>
              <img src={slides[prevIdx].img} alt="" style={{ width:"100%", height:"100%", objectFit:"cover" }}/>
            </div>
            <div key={`s${current}`} style={{ flexShrink:0, width:"310px", height:"540px", borderRadius:"18px", overflow:"hidden", position:"relative", boxShadow:"0 28px 80px rgba(0,0,0,.85),0 0 50px rgba(191,141,60,.12)", border:"0.5px solid rgba(191,141,60,.45)", animation:"fadeIn .45s ease both" }}>
              <img src={s.img} alt="" style={{ width:"100%", height:"100%", objectFit:"cover", filter:"brightness(.4) saturate(.65)" }}/>
              <div style={{ position:"absolute", inset:0, background:"linear-gradient(to top,rgba(8,8,8,.96) 0%,rgba(8,8,8,.25) 55%,rgba(8,8,8,.18) 100%)" }}/>
              <div style={{ position:"absolute", inset:"18px", border:"0.5px solid rgba(191,141,60,.38)", borderRadius:"10px", pointerEvents:"none" }}/>
              <p style={{ position:"absolute", top:"28px", left:"28px", fontSize:"9px", letterSpacing:".38em", color:"rgba(191,141,60,.75)", textTransform:"uppercase" }}>{s.slide} / 10</p>
              <p style={{ position:"absolute", top:"50%", left:"50%", transform:"translate(-50%,-50%) translateY(-36px)", fontSize:"52px" }}>{s.icon}</p>
              <div style={{ position:"absolute", bottom:0, left:0, right:0, padding:"32px 28px" }}>
                <p style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"22px", color:"#F2EDE4", lineHeight:1.55, fontStyle:"italic", fontWeight:300, whiteSpace:"pre-line", textShadow:"0 2px 16px rgba(0,0,0,.9)" }}>{s.text}</p>
              </div>
            </div>
            <div onClick={()=>resetAndGo(()=>go(1))} style={{ flexShrink:0, width:"160px", height:"290px", borderRadius:"10px", overflow:"hidden", opacity:.38, transform:"scale(.86)", transition:"all .5s ease", cursor:"pointer", filter:"brightness(.55)" }}>
              <img src={slides[nextIdx].img} alt="" style={{ width:"100%", height:"100%", objectFit:"cover" }}/>
            </div>
          </div>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:"20px" }}>
            <button onClick={()=>resetAndGo(()=>go(-1))} style={{ width:"44px", height:"44px", borderRadius:"50%", border:"0.5px solid rgba(191,141,60,.4)", background:"transparent", color:"#BF8D3C", fontSize:"20px", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", transition:"all .3s ease" }} onMouseEnter={e=>e.currentTarget.style.background="rgba(191,141,60,.15)"} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>‹</button>
            <div style={{ display:"flex", gap:"6px", alignItems:"center" }}>
              {slides.map((_,i)=>(
                <button key={i} onClick={()=>resetAndGo(()=>setCurrent(i))} style={{ width:i===current?"24px":"6px", height:"6px", borderRadius:"3px", background:i===current?"#BF8D3C":"rgba(191,141,60,.25)", border:"none", cursor:"pointer", padding:0, transition:"all .4s ease" }}/>
              ))}
            </div>
            <button onClick={()=>resetAndGo(()=>go(1))} style={{ width:"44px", height:"44px", borderRadius:"50%", border:"0.5px solid rgba(191,141,60,.4)", background:"transparent", color:"#BF8D3C", fontSize:"20px", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", transition:"all .3s ease" }} onMouseEnter={e=>e.currentTarget.style.background="rgba(191,141,60,.15)"} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>›</button>
          </div>
          <div style={{ display:"flex", gap:"8px", justifyContent:"center", marginTop:"28px", overflowX:"auto", padding:"4px 0" }}>
            {slides.map((sl,i)=>(
              <div key={i} onClick={()=>resetAndGo(()=>setCurrent(i))} style={{ width:"52px", height:"80px", flexShrink:0, borderRadius:"6px", overflow:"hidden", cursor:"pointer", border:i===current?"1.5px solid #BF8D3C":"1px solid rgba(191,141,60,.15)", opacity:i===current?1:.42, transition:"all .3s ease", transform:i===current?"scale(1.1)":"scale(1)" }}>
                <img src={sl.img} alt="" style={{ width:"100%", height:"100%", objectFit:"cover", filter:"brightness(.65)" }}/>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── 4. BIRTHDAY WISH + BORN-TO-NOW VIDEO ───────────────────────────────── */
function BirthdayWish() {
  const ref = useReveal();
  const [celebrated, setCelebrated] = useState(false);
  const [showVideo, setShowVideo] = useState(false);

  const handleCelebrate = () => {
    setCelebrated(true);
    setTimeout(() => setCelebrated(false), 4000);
  };

  return (
    <section id="wish" ref={ref} style={{ minHeight:"100vh", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"120px 24px", position:"relative", overflow:"hidden", textAlign:"center" }}>
      {/* BG image */}
      <div style={{ position:"absolute", inset:0, zIndex:0 }}>
        <img src="https://images.unsplash.com/photo-1547153760-18fc86324498?w=1600&q=80" alt="" style={{ width:"100%", height:"100%", objectFit:"cover", filter:"brightness(.12) saturate(.45)" }}/>
        <div style={{ position:"absolute", inset:0, background:"radial-gradient(ellipse at center,rgba(191,141,60,.09) 0%,rgba(8,8,8,.88) 70%)" }}/>
      </div>

      {/* Particles */}
      {celebrated && (
        <div style={{ position:"absolute", inset:0, pointerEvents:"none", overflow:"hidden", zIndex:5 }}>
          {Array.from({length:40}).map((_,i)=>(
            <div key={i} style={{ position:"absolute", left:`${Math.random()*100}%`, bottom:0, width:`${4+Math.random()*6}px`, height:`${4+Math.random()*6}px`, background:["#BF8D3C","#F0C97A","#E8B86D","#F2EDE4","#C8963A","#FFD700"][Math.floor(Math.random()*6)], borderRadius:Math.random()>.5?"50%":"1px", animation:`particleFloat ${2+Math.random()*3}s ease-out both`, animationDelay:`${Math.random()*1.5}s` }}/>
          ))}
        </div>
      )}

      <div className="reveal" style={{ position:"relative", zIndex:2, maxWidth:"860px", width:"100%" }}>
        <p style={{ fontSize:"10px", letterSpacing:".4em", color:"#BF8D3C", textTransform:"uppercase", marginBottom:"32px" }}>🎂 A Heartfelt Wish</p>
        <h2 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"clamp(48px,10vw,96px)", fontWeight:300, color:"#F2EDE4", letterSpacing:"-0.03em", lineHeight:1.05, marginBottom:"20px" }}>
          Happy<br/><span className="gold-text" style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"clamp(56px,12vw,120px)", fontWeight:500, fontStyle:"italic" }}>Birthday</span>
        </h2>
        <GoldDivider style={{ marginBottom:"48px" }}/>
        <p style={{ fontSize:"clamp(15px,2vw,18px)", color:"#9E9588", lineHeight:1.9, fontWeight:300, letterSpacing:".01em", marginBottom:"40px" }}>
          On this special day, may your life continue to shine with happiness, success, and love. May your passion for dance and your dedication to fitness never fade. You are living proof that no matter where you start, you can transform your life with <em style={{ fontStyle:"italic", color:"#BF8D3C" }}>determination</em> and <em style={{ fontStyle:"italic", color:"#BF8D3C" }}>belief</em>.
        </p>
        <div style={{ padding:"32px 48px", border:"0.5px solid rgba(191,141,60,.3)", borderRadius:"2px", background:"rgba(8,8,8,.65)", backdropFilter:"blur(12px)", marginBottom:"48px" }}>
          <p style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"clamp(18px,3vw,24px)", fontStyle:"italic", color:"#F2EDE4", lineHeight:1.7 }}>
            "Happy Birthday to someone truly special — your story inspires, your strength motivates, and your journey reminds us that <em style={{ color:"#BF8D3C" }}>greatness is built, not given. 💫✨</em>"
          </p>
        </div>

        <div style={{ display:"flex", gap:"16px", justifyContent:"center", flexWrap:"wrap", marginBottom:"64px" }}>
          <button onClick={handleCelebrate} style={{ padding:"16px 40px", background:"linear-gradient(135deg,#BF8D3C,#C8963A)", border:"none", borderRadius:"2px", color:"#080808", fontSize:"11px", letterSpacing:".3em", textTransform:"uppercase", fontWeight:500, cursor:"pointer", fontFamily:"'Jost',sans-serif", transition:"all .3s ease" }} onMouseEnter={e=>e.currentTarget.style.transform="scale(1.04)"} onMouseLeave={e=>e.currentTarget.style.transform="scale(1)"}>🎉 Celebrate!</button>
          <div style={{ padding:"16px 32px", border:"0.5px solid rgba(191,141,60,.4)", borderRadius:"2px", fontSize:"11px", letterSpacing:".3em", textTransform:"uppercase", color:"#BF8D3C", display:"flex", alignItems:"center", gap:"8px", background:"rgba(8,8,8,.5)", backdropFilter:"blur(8px)" }}>💫 A Self-Made Legend</div>
        </div>

        {/* ── BORN TO NOW VIDEO ── */}
        <div style={{ textAlign:"left" }}>
          <GoldDivider style={{ marginBottom:"40px" }}/>
          <div style={{ textAlign:"center", marginBottom:"36px" }}>
            <p style={{ fontSize:"10px", letterSpacing:".4em", color:"#BF8D3C", textTransform:"uppercase", marginBottom:"12px" }}>🎬 &nbsp; The Journey</p>
            <h3 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"clamp(28px,5vw,52px)", fontWeight:300, color:"#F2EDE4", fontStyle:"italic" }}>
              Born to <em style={{ color:"#BF8D3C" }}>Now</em>
            </h3>
            <p style={{ fontSize:"clamp(13px,2vw,16px)", color:"#9E9588", lineHeight:1.8, maxWidth:"520px", margin:"12px auto 0" }}>
              From the first breath to this very moment — watch the full story of a man who turned every challenge into a chapter worth living.
            </p>
          </div>

          <CinematicPlayer
            src={BORN_TO_NOW_VIDEO}
            poster="https://images.unsplash.com/photo-1488702765232-3e95a9f4a12d?w=1200&q=80"
            title="Born to Now — The Full Journey"
            subtitle="🎬 Life Story"
          />

          {/* Quote beneath the video */}
          <div style={{ marginTop:"28px", display:"grid", gridTemplateColumns:"1fr 1fr", gap:"24px" }}>
            {[
              { icon:"✨", text:"\"Every scar is a chapter. Every victory, a verse. This is his complete story.\"" },
              { icon:"🔥", text:"\"From a child who was waiting to be seen — to a man the world cannot ignore.\"" },
            ].map(({icon,text},i)=>(
              <div key={i} style={{ padding:"24px 28px", background:"rgba(191,141,60,.04)", border:"0.5px solid rgba(191,141,60,.18)", borderRadius:"2px", display:"flex", gap:"14px", alignItems:"flex-start" }}>
                <span style={{ fontSize:"22px", flexShrink:0 }}>{icon}</span>
                <p style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"16px", fontStyle:"italic", color:"#9E9588", lineHeight:1.7 }}>{text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── FOOTER ─────────────────────────────────────────────────────────────── */
function Footer() {
  return (
    <footer style={{ padding:"40px 24px", borderTop:"0.5px solid rgba(191,141,60,.15)", textAlign:"center", background:"#050505" }}>
      <GoldDivider style={{ maxWidth:"300px", margin:"0 auto 24px" }}/>
      <p style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"18px", fontStyle:"italic", color:"#BF8D3C", marginBottom:"8px" }}>Built by pain. Driven by passion. Defined by discipline.</p>
      <p style={{ fontSize:"10px", letterSpacing:".3em", color:"rgba(158,149,136,.5)", textTransform:"uppercase" }}>✦ With Love & Admiration ✦</p>
    </footer>
  );
}

/* ─── APP ────────────────────────────────────────────────────────────────── */
export default function App() {
  return (
    <>
      <style>{globalStyles}</style>
      <MusicToggle />
      <Navbar />
      <HeroSection />
      <CountdownSection />
      <StorySection />
      <GymSection />
      <GymReelSection />
      <QuotesSection />
      <FriendsSection />
      <TimelineSection />
      <BirthdayWish />
      <Footer />
    </>
  );
}