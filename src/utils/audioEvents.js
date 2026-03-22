/**
 * audioEvents.js
 * Lightweight custom-event bus so MusicToggle and ChandraSecretMessage
 * can coordinate without prop-drilling or a global state library.
 *
 * Events dispatched on window:
 *   "bg-pause"  — pause the background music (mashaAllah)
 *   "bg-resume" — resume the background music (mashaAllah)
 */

export const bgPause  = () => window.dispatchEvent(new CustomEvent("bg-pause"));
export const bgResume = () => window.dispatchEvent(new CustomEvent("bg-resume"));

export const onBgPause  = (fn) => { window.addEventListener("bg-pause",  fn); return () => window.removeEventListener("bg-pause",  fn); };
export const onBgResume = (fn) => { window.addEventListener("bg-resume", fn); return () => window.removeEventListener("bg-resume", fn); };