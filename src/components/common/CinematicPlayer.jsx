import { useState, useRef } from "react";

/**
 * CinematicPlayer
 * A custom-styled HTML5 video player with cinematic dark styling.
 *
 * Props:
 *   src       — video source URL / path (leave empty to show placeholder)
 *   poster    — poster image URL shown before play
 *   title     — overlay title (top-left corner)
 *   subtitle  — small label above the title
 *   compact   — boolean, reduces player height when true
 */
export default function CinematicPlayer({ src, poster, title, subtitle, compact = false }) {
  const videoRef = useRef(null);

  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [pct, setPct] = useState(0);
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(0);
  const [loading, setLoading] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [showCtrl, setShowCtrl] = useState(true);
  const hideTimer = useRef(null);

  const hasVideo = !!src;

  const fmtTime = (s) => {
    if (!s || isNaN(s)) return "0:00";
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${String(sec).padStart(2, "0")}`;
  };

  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    if (playing) { v.pause(); setPlaying(false); }
    else { v.play(); setPlaying(true); }
  };

  const seek = (e) => {
    const v = videoRef.current;
    if (!v || !v.duration) return;
    const val = parseFloat(e.target.value);
    v.currentTime = (val / 100) * v.duration;
    setPct(val);
  };

  const onTimeUpdate = () => {
    const v = videoRef.current;
    if (!v) return;
    const p = v.duration ? (v.currentTime / v.duration) * 100 : 0;
    setPct(p);
    setCurrent(v.currentTime);
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

  const height = compact ? "280px" : "clamp(240px, 50vw, 520px)";

  return (
    <div
      className="cinema-wrap"
      onMouseMove={onMouseMove}
      onClick={hasVideo && !playing ? togglePlay : undefined}
      style={{
        position: "relative", width: "100%", height,
        background: "#000", borderRadius: "4px", overflow: "hidden",
        border: "0.5px solid rgba(191,141,60,0.3)",
        cursor: playing ? "none" : "pointer",
      }}
    >
      {/* ── Video element ── */}
      {hasVideo ? (
        <video
          ref={videoRef}
          src={src}
          poster={poster}
          muted={muted}
          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
          onTimeUpdate={onTimeUpdate}
          onLoadedMetadata={(e) => setDuration(e.target.duration)}
          onWaiting={() => setLoading(true)}
          onCanPlay={() => setLoading(false)}
          onEnded={() => { setPlaying(false); setPct(0); setCurrent(0); }}
        />
      ) : (
        /* Placeholder — no video src provided yet */
        <div style={{
          width: "100%", height: "100%",
          background: "linear-gradient(160deg, rgba(191,141,60,0.08) 0%, #050401 100%)",
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
          gap: "16px",
        }}>
          {poster && (
            <img src={poster} alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", filter: "brightness(0.2) saturate(0.4)" }} />
          )}
          <div style={{ position: "relative", zIndex: 1, textAlign: "center" }}>
            <div style={{ width: "72px", height: "72px", borderRadius: "50%", border: "1.5px dashed rgba(191,141,60,0.5)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#BF8D3C" strokeWidth="1.5">
                <polygon points="5,3 19,12 5,21" />
              </svg>
            </div>
            <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "20px", fontStyle: "italic", color: "rgba(191,141,60,0.8)", marginBottom: "8px" }}>
              {title || "Video Coming Soon"}
            </p>
            <p style={{ fontSize: "10px", letterSpacing: "0.25em", color: "rgba(158,149,136,0.6)", textTransform: "uppercase" }}>
              Add your video path in src/constants/config.js
            </p>
          </div>
        </div>
      )}

      {/* ── Scanline overlay ── */}
      <div style={{ position: "absolute", inset: 0, background: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.03) 2px, rgba(0,0,0,0.03) 4px)", pointerEvents: "none", zIndex: 1 }} />

      {/* ── Loading spinner ── */}
      {loading && (
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", zIndex: 5 }}>
          <div style={{ width: "40px", height: "40px", borderRadius: "50%", border: "2px solid rgba(191,141,60,0.2)", borderTopColor: "#BF8D3C", animation: "spin .8s linear infinite" }} />
        </div>
      )}

      {/* ── Controls bar ── */}
      {hasVideo && (
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0, zIndex: 10,
          background: "linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 100%)",
          padding: "32px 20px 16px",
          opacity: showCtrl ? 1 : 0,
          transition: "opacity .4s ease",
          pointerEvents: showCtrl ? "auto" : "none",
        }}>
          {/* Progress */}
          <input
            type="range" min="0" max="100" step="0.1"
            value={pct} onChange={seek}
            className="vid-progress"
            style={{ width: "100%", marginBottom: "10px", "--pct": `${pct}%` }}
          />

          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
              {/* Play / Pause */}
              <button onClick={(e) => { e.stopPropagation(); togglePlay(); }} style={{ background: "transparent", border: "none", cursor: "pointer", color: "#F2EDE4", display: "flex", alignItems: "center" }}>
                {playing ? (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="#F2EDE4"><rect x="6" y="4" width="4" height="16" rx="1" /><rect x="14" y="4" width="4" height="16" rx="1" /></svg>
                ) : (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="#F2EDE4"><polygon points="5,3 19,12 5,21" /></svg>
                )}
              </button>

              {/* Mute */}
              <button onClick={(e) => { e.stopPropagation(); if (videoRef.current) { videoRef.current.muted = !muted; setMuted(!muted); } }} style={{ background: "transparent", border: "none", cursor: "pointer", color: "#9E9588" }}>
                {muted ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <polygon points="11,5 6,9 2,9 2,15 6,15 11,19" /><line x1="23" y1="9" x2="17" y2="15" /><line x1="17" y1="9" x2="23" y2="15" />
                  </svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#BF8D3C" strokeWidth="1.5">
                    <polygon points="11,5 6,9 2,9 2,15 6,15 11,19" /><path d="M15.54,8.46a5,5,0,0,1,0,7.07" /><path d="M19.07,4.93a10,10,0,0,1,0,14.14" />
                  </svg>
                )}
              </button>

              {/* Timecode */}
              <span style={{ fontSize: "11px", color: "#9E9588", fontVariantNumeric: "tabular-nums" }}>
                {fmtTime(current)} / {fmtTime(duration)}
              </span>
            </div>

            {/* Fullscreen */}
            <button onClick={(e) => { e.stopPropagation(); toggleFS(); }} style={{ background: "transparent", border: "none", cursor: "pointer", color: "#9E9588" }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                {fullscreen ? (
                  <><path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3" /></>
                ) : (
                  <><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" /></>
                )}
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* ── Big centre play button ── */}
      {hasVideo && !playing && (
        <button
          onClick={(e) => { e.stopPropagation(); togglePlay(); }}
          onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(191,141,60,0.32)"; e.currentTarget.style.transform = "translate(-50%,-50%) scale(1.08)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(191,141,60,0.18)"; e.currentTarget.style.transform = "translate(-50%,-50%) scale(1)"; }}
          style={{
            position: "absolute", top: "50%", left: "50%",
            transform: "translate(-50%,-50%)",
            width: "72px", height: "72px", borderRadius: "50%",
            background: "rgba(191,141,60,0.18)", border: "1.5px solid rgba(191,141,60,0.6)",
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer", zIndex: 8, backdropFilter: "blur(8px)",
            transition: "all .3s ease",
            animation: "glowPulse 3s ease-in-out infinite",
          }}
        >
          <svg width="26" height="26" viewBox="0 0 24 24" fill="#BF8D3C"><polygon points="6,3 20,12 6,21" /></svg>
        </button>
      )}

      {/* ── Title overlay (top-left) ── */}
      {title && (
        <div style={{ position: "absolute", top: "16px", left: "20px", zIndex: 8 }}>
          <p style={{ fontSize: "9px", letterSpacing: "0.3em", color: "#BF8D3C", textTransform: "uppercase" }}>{subtitle}</p>
          <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "16px", fontStyle: "italic", color: "#F2EDE4", marginTop: "2px" }}>{title}</p>
        </div>
      )}
    </div>
  );
}