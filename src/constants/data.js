// ─────────────────────────────────────────────────────────────────────────────
//  DATA — all static content arrays used across sections
// ─────────────────────────────────────────────────────────────────────────────

// ── Local image imports ───────────────────────────────────────────────────────
import silverStone from "../assets/images/silver-stone.jpg";
import whiteShirtMidYr from "../assets/images/white-shirt-midyr.jpg";
import varkala from "../assets/images/varkala.jpeg";
import blackShirt from "../assets/images/black-shirt.jpg";
import sidelook from "../assets/images/sidelook.webp";
import garderPic from "../assets/images/garderPic.jpg";
import greenSky from "../assets/images/greenSky.jpeg";
import beach from "../assets/images/beach.jpeg";
import earPieceWhite from "../assets/images/earPieceWhite.jpeg";
import thalapathystyle from "../assets/images/thalapathystyle.jpeg";
import car from "../assets/images/car.jpeg";
import theatre from "../assets/images/theatre.jpeg";
import babypic from "../assets/images/babypic.jpeg";
import school from "../assets/images/update-childhood.png";
import dance from "../assets/images/dance.jpg";
import gym1 from "../assets/images/gym1.jpeg";
import gym2 from "../assets/images/gym2.jpeg";
import gym3 from "../assets/images/gym3.jpeg";
import gym4 from "../assets/images/gym4.jpeg";
import gym5 from "../assets/images/gym5.jpg";
import gym6 from "../assets/images/gym6.jpeg";
import gym7 from "../assets/images/gym7.jpeg";
import gym8 from "../assets/images/gym8.jpeg";
import chandra from "../assets/images/chandra.jpg";
import brothers from "../assets/images/brothers.jpg";
import bike from "../assets/images/bike.jpg";
import fav from "../assets/images/fav.webp";

// ── Hero ──────────────────────────────────────────────────────────────────────
export const HERO_BG_IMAGES = [
  blackShirt,
  beach,
  varkala,
  garderPic,
  theatre,
];

export const HERO_BADGES = [
  { icon: "💪", label: "Fighter" },
  { icon: "💃", label: "Dancer" },
  { icon: "🏋️", label: "Builder" },
  { icon: "🌟", label: "Legend" },
];

// ── Story chapters ────────────────────────────────────────────────────────────
export const STORY_CHAPTERS = [
  {
    num: "01",
    title: "The Miracle of His Beginning",
    icon: "✨",
    date: "A Dream Fulfilled",
    img: babypic,
    content: "After nearly two decades of waiting, hope, and countless prayers, he arrived as a blessing — their only child, their greatest joy. His birthday is not just a date; it's a celebration of patience, love, and a dream finally fulfilled. Every year, this day reminds everyone around him of how special his existence truly is.",
  },
  {
    num: "02",
    title: "The Childhood That Shaped Him",
    icon: "🌱",
    date: "A Foundation of Resilience",
    img: school,
    content: "As a child, he was adorably chubby — full of innocence and charm. Some misunderstood him. Those moments may have been difficult, but they quietly built a strong foundation within him. Instead of breaking him, those experiences shaped his resilience — teaching him that self-worth comes from within, not from others' opinions.",
  },
  {
    num: "03",
    title: "An Average Student with Extraordinary Passion",
    icon: "💃",
    date: "Dance — His Voice, His Soul",
    img: fav,
    content: "Academically, he was just like many others. But what made him stand out was something far more powerful: his love for dance. Dance wasn't just a hobby; it was his escape, his strength, his voice. When words failed, his movements spoke. When confidence shook, dance lifted him up.",
  },
];

// ── Gym section ───────────────────────────────────────────────────────────────
export const GYM_IMAGES = [gym1, gym8, gym7];

export const GYM_EQUATION_SLIDES = [
  { label: "Sad?", result: "Gym" },
  { label: "Happy?", result: "Gym" },
  { label: "Broken?", result: "Gym" },
];

export const GYM_STATS = [
  { icon: "🏋️", val: "Daily", label: "Gym visits" },
  { icon: "💪", val: "365+", label: "Days of grind" },
  { icon: "🔥", val: "Zero", label: "Days of giving up" },
  { icon: "⚡", val: "∞", label: "Willpower" },
];

// ── Gym reel — single Before & After video ────────────────────────────────────
// Add your video path in src/constants/config.js → GYM_BEFORE_AFTER_VIDEO
export const GYM_REEL = {
  title: "Before & After — The Real Transformation",
  subtitle: "🎬 His Journey · Then vs Now",
  poster: blackShirt,
};

export const GYM_TRANSFORMATION_QUOTES = [
  {
    phase: "Before",
    icon: "🌱",
    title: "The Boy Who Started",
    text: "He walked in unsure, carrying the weight of doubt and the eyes of people who never believed he could change. But he showed up anyway.",
  },
  {
    phase: "After",
    icon: "🔥",
    title: "The Man Who Arrived",
    text: "He didn't just lose weight. He shed every version of himself that had been holding him back — and built someone the world wasn't ready for.",
  },
];

// ── Cinematic captions / quotes ───────────────────────────────────────────────
export const QUOTES = [
  {
    text: "From waiting… to becoming.\nFrom being judged… to being respected.\nFrom pain… to power.\n\nHe didn't just grow — he transformed.",
    label: "Option I — Strong & Emotional",
  },
  {
    text: "Built by pain.\nDriven by passion.\nDefined by discipline.\n\nGym is his escape.\nDance is his identity.\n\nThis is his story.",
    label: "Option II — Short & Punchy",
  },
  {
    text: "If life hits him…\nhe lifts harder.\n\nIf life tests him…\nhe comes back stronger.\n\nNot born strong —\nbut became unstoppable.",
    label: "Option III — Mass Hero Vibe",
  },
];

export const VOICEOVER = `"They saw a boy… but he saw a future.\nThey laughed… but he worked.\nThey doubted… but he believed.\n\nWhen life got heavy…\nhe lifted heavier.\n\nThis isn't just a birthday…\nthis is the rise of a man who built himself."`;

// ── Friends & brotherhood ─────────────────────────────────────────────────────
export const FRIENDS = [
  {
    img: chandra,
    icon: "🩷",
    name: "Chandra",
    role: "Once Senior · Now Soulmate Friend",
    label: "Best Friend",
    quote: "What started unexpectedly has turned into a collection of unforgettable memories.",
    body: "Though she was once his senior, time transformed their connection into a deep and meaningful friendship. Even after working together for over three years, they weren't initially close. But recently, something changed — and they found comfort, laughter, and understanding in each other.",
    reverse: false,
  },
  {
    img: brothers,
    icon: "🤝",
    name: "The Brotherhood",
    role: "Triplet Bhaii · Gundama · Mukesh",
    label: "Brotherhood",
    quote: "Together, they created moments no camera could ever fully capture.",
    body: "Weekends alive with temple visits, outings, movies, and evenings over coffee — these three are not just friends but a family of their own. Evening breaks with coffee turn into deep talks and endless memories. A bond that is simple, real, and truly priceless.",
    reverse: true,
  },
];

// ── Story slides carousel ─────────────────────────────────────────────────────

export const STORY_SLIDES = [
  { slide: "01", text: "From Waiting…\nto Wonder…", img: thalapathystyle },
  { slide: "02", text: "A dream his parents waited\n20 years to hold", img: babypic },
  { slide: "03", text: "Once judged…\nonce misunderstood…", img: school },
  { slide: "04", text: "But he never gave up\non himself", img: gym4 },
  { slide: "05", text: "Dance became his voice\nwhen words failed", img: dance },
  { slide: "06", text: "Gym became his world\nSad? Happy? Broken? → Gym", img: gym5 },
  { slide: "07", text: "Pain is not pain for him…\nit's happiness.", img: gym2 },
  { slide: "08", text: "He didn't change…\nHe transformed.", img: sidelook },
  { slide: "09", text: "Friends. Memories. Brotherhood.\nMoments that matter", img: brothers },
  { slide: "10", text: "Still rising…\nStill chasing…\nStill becoming…", img: greenSky },
];

// ── Birthday wish section ─────────────────────────────────────────────────────
export const WISH_VIDEO_QUOTES = [
  { icon: "✨", text: '"Every scar is a chapter. Every victory, a verse. This is his complete story."' },
  { icon: "🔥", text: '"From a child who was waiting to be seen — to a man the world cannot ignore."' },
];

// ── Named exports — all images available for any future section ───────────────
export {
  silverStone, whiteShirtMidYr, varkala, blackShirt, sidelook,
  garderPic, greenSky, beach, earPieceWhite, thalapathystyle,
  car, theatre, babypic, school, dance,
  gym1, gym2, gym3, gym4, gym5, gym6, gym7, gym8,
  chandra, brothers, bike,
};
