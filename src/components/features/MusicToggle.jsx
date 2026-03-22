import { useState, useEffect, useRef } from "react";
import { BACKGROUND_MUSIC } from "../../constants/config";
import { onBgPause, onBgResume } from "../../utils/audioEvents";
import mashaAllah from "../../assets/audio/mashaAllah.mp3";

const FALLBACK_MUSIC = mashaAllah;
const BAR_SPEEDS = [1, 1.4, 0.7, 1.2, 0.9];

/**
 * MusicToggle
 *
 * AUDIO BEHAVIOUR:
 *  • Starts playing mashaAllah on first user interaction (muted-autoplay trick)
 *  • Listens for "bg-pause"  → pauses  (called when Chandra letter opens)
 *  • Listens for "bg-resume" → resumes (called when user scrolls away from letter)
 *  • Button toggles pause / resume manually at any time
 */
export default function MusicToggle() {
  const [playing, setPlaying] = useState(false);
  const [started, setStarted] = useState(false);
  const [pausedByEvent, setPausedByEvent] = useState(false); // paused by Chandra letter
  const audioRef = useRef(null);
  const startedRef = useRef(false);
  const pausedByRef = useRef(false); // ref copy for event listeners

  // ── Build audio element once ───────────────────────────────────────────────
  useEffect(() => {
    const audio = new Audio();
    audio.loop = true;
    audio.volume = 0.3;
    audio.src = BACKGROUND_MUSIC || FALLBACK_MUSIC;
    audioRef.current = audio;
    return () => { audio.pause(); audio.src = ""; };
  }, []);

  // ── Muted-autoplay: start on page load ────────────────────────────────────
  useEffect(() => {
    const startMuted = () => {
      const audio = audioRef.current;
      if (!audio || startedRef.current) return;

      audio.muted = true;
      audio.play()
        .then(() => {
          audio.muted = false;
          startedRef.current = true;
          setStarted(true);
          setPlaying(true);
        })
        .catch(() => {
          audio.muted = false;
          // fallback: wait for first interaction
          startOnInteraction();
        });
    };

    const startOnInteraction = () => {
      const EVENTS = ["click", "scroll", "keydown", "touchstart", "pointerdown"];
      const resume = () => {
        if (startedRef.current) return;
        const audio = audioRef.current;
        if (!audio) return;
        audio.play()
          .then(() => { startedRef.current = true; setStarted(true); setPlaying(true); })
          .catch(() => { });
        EVENTS.forEach((e) => window.removeEventListener(e, resume, true));
      };
      EVENTS.forEach((e) =>
        window.addEventListener(e, resume, { capture: true, passive: true })
      );
    };

    const audio = audioRef.current;
    if (!audio) return;
    audio.addEventListener("canplaythrough", startMuted, { once: true });
    if (audio.readyState >= 3) startMuted();
  }, []);

  // ── Listen for Chandra letter events ──────────────────────────────────────
  useEffect(() => {
    const handlePause = () => {
      const audio = audioRef.current;
      if (!audio || !startedRef.current) return;
      audio.pause();
      pausedByRef.current = true;
      setPausedByEvent(true);
      setPlaying(false);
    };

    const handleResume = () => {
      const audio = audioRef.current;
      if (!audio || !startedRef.current || !pausedByRef.current) return;
      audio.play()
        .then(() => {
          pausedByRef.current = false;
          setPausedByEvent(false);
          setPlaying(true);
        })
        .catch(() => { });
    };

    const offPause = onBgPause(handlePause);
    const offResume = onBgResume(handleResume);
    return () => { offPause(); offResume(); };
  }, []);

  // ── Manual button toggle ───────────────────────────────────────────────────
  const toggle = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (!started) {
      // Direct manual start as last resort
      audio.play()
        .then(() => { startedRef.current = true; setStarted(true); setPlaying(true); })
        .catch(() => { });
      return;
    }

    if (playing) {
      audio.pause();
      setPlaying(false);
      // Clear the "paused by event" flag if user manually pauses
      pausedByRef.current = false;
      setPausedByEvent(false);
    } else {
      audio.play()
        .then(() => { setPlaying(true); pausedByRef.current = false; setPausedByEvent(false); })
        .catch(() => { });
    }
  };

  return (
    <button
      onClick={toggle}
      title={playing ? "Pause music" : "Play music"}
      style={{
        position: "fixed", bottom: "32px", left: "32px", zIndex: 200,
        width: "52px", height: "52px", borderRadius: "50%",
        background: playing ? "rgba(191,141,60,0.18)" : "rgba(20,18,14,0.9)",
        border: playing ? "1px solid #BF8D3C" : "0.5px solid rgba(191,141,60,0.4)",
        backdropFilter: "blur(12px)",
        display: "flex", alignItems: "center", justifyContent: "center",
        cursor: "pointer",
        transition: "all .35s ease",
        // Subtle pulse when paused by Chandra letter so user knows something changed
        animation: pausedByEvent ? "glowPulse 2s ease-in-out infinite" : "none",
        boxShadow: playing ? "0 0 24px rgba(191,141,60,0.3)" : "none",
      }}
    >
      {playing ? (
        /* Animated equalizer */
        <div style={{ display: "flex", gap: "3px", alignItems: "flex-end", height: "20px" }}>
          {BAR_SPEEDS.map((speed, i) => (
            <div key={i} style={{
              width: "3px", height: "100%",
              background: "#BF8D3C", borderRadius: "2px",
              transformOrigin: "bottom",
              animation: `musicBounce ${0.5 * speed}s ease-in-out infinite alternate`,
              animationDelay: `${i * 0.08}s`,
            }} />
          ))}
        </div>
      ) : (
        /* Music note icon */
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
          stroke="#BF8D3C" strokeWidth="1.5" strokeLinecap="round">
          <path d="M9 18V5l12-2v13" />
          <circle cx="6" cy="18" r="3" />
          <circle cx="18" cy="16" r="3" />
        </svg>
      )}
    </button>
  );
}