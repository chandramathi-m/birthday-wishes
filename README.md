# 🎂 Birthday Tribute — React App

A cinematic, dark-luxury birthday tribute website built with **React + Vite**.

---

## 📁 Project Structure

```
birthday-tribute/
├── index.html                          Vite HTML entry
├── vite.config.js                      Vite configuration
├── package.json
└── src/
    ├── main.jsx                        React entry point
    ├── App.jsx                         Root component — composes all sections
    ├── index.css                       Global styles, keyframes, utility classes
    │
    ├── constants/
    │   ├── config.js                   🔧 VIDEO PATHS, MUSIC URL, BIRTHDAY DATE
    │   └── data.js                     All static content (chapters, slides, quotes…)
    │
    ├── hooks/
    │   └── useReveal.js                Scroll-reveal IntersectionObserver hook
    │
    └── components/
        ├── common/
        │   ├── GoldDivider.jsx         Decorative gold diamond divider
        │   └── CinematicPlayer.jsx     Custom HTML5 video player with full controls
        │
        ├── layout/
        │   ├── Navbar.jsx              Fixed frosted-glass navigation bar
        │   └── Footer.jsx              Page footer
        │
        ├── features/
        │   ├── MusicToggle.jsx         Floating music button with equalizer animation
        │   └── ChandraSecretMessage.jsx Sealed envelope → letter reveal interaction
        │
        └── sections/
            ├── HeroSection.jsx         Full-screen background slideshow hero
            ├── CountdownSection.jsx    Live birthday countdown timer
            ├── StorySection.jsx        3-chapter alternating story layout
            ├── GymSection.jsx          Gym transformation with photo collage
            ├── GymReelSection.jsx      Dedicated gym video reel section
            ├── QuotesSection.jsx       3 cinematic captions + voiceover
            ├── FriendsSection.jsx      Friends, brotherhood, career + secret letter
            ├── TimelineSection.jsx     10-slide Instagram story carousel
            └── BirthdayWish.jsx        Birthday wish + Born to Now closing video
```

---

## 🚀 Getting Started

```bash
# 1. Install dependencies
npm install

# 2. Start development server
npm run dev

# 3. Build for production
npm run build
```

---

## 🎬 Adding Your Videos

Open **`src/constants/config.js`** and fill in your video paths:

```js
// Born to Now — full life journey video (Birthday Wish section)
export const BORN_TO_NOW_VIDEO = "/videos/born-to-now.mp4";

// Gym clips (Gym Reel section — up to 3 clips)
export const GYM_REEL_1 = "/videos/gym-reel-1.mp4";
export const GYM_REEL_2 = "/videos/gym-reel-2.mp4";
export const GYM_REEL_3 = "/videos/gym-reel-3.mp4";

// Background ambient music (floating music toggle)
export const BACKGROUND_MUSIC = "/music/ambient.mp3";
```

Place your video and audio files in the `public/` folder:

```
birthday-tribute/
└── public/
    ├── videos/
    │   ├── born-to-now.mp4
    │   ├── gym-reel-1.mp4
    │   ├── gym-reel-2.mp4
    │   └── gym-reel-3.mp4
    └── music/
        └── ambient.mp3
```

Files in `public/` are served as-is at the root URL — no imports needed.

---

## 🎵 Background Music

If `BACKGROUND_MUSIC` is left empty, a free CC0 lofi ambient track is used as a fallback.
The music toggle button sits fixed at the **bottom-left** of every page.

---

## 📅 Changing the Birthday Date

In `src/constants/config.js`:

```js
export const NEXT_BIRTHDAY    = new Date("2026-04-11T00:00:00");
export const BIRTHDAY_DISPLAY = "11 April 2026";
```

---

## 🎨 Customising Content

All editable text content lives in **`src/constants/data.js`**:

| Export              | Used in            | What it controls                          |
|---------------------|--------------------|-------------------------------------------|
| `HERO_BG_IMAGES`    | HeroSection        | Slideshow background images               |
| `HERO_BADGES`       | HeroSection        | Fighter / Dancer / Builder / Legend chips |
| `STORY_CHAPTERS`    | StorySection       | Chapter titles, text, images              |
| `GYM_IMAGES`        | GymSection         | Photo collage images                      |
| `GYM_EQUATION_SLIDES` | GymSection       | Sad? → Gym cards                          |
| `GYM_REELS_META`    | GymReelSection     | Reel titles, posters, quotes              |
| `QUOTES`            | QuotesSection      | 3 cinematic caption options               |
| `VOICEOVER`         | QuotesSection      | Cinematic voiceover text                  |
| `FRIENDS`           | FriendsSection     | Friend cards content                      |
| `STORY_SLIDES`      | TimelineSection    | 10 Instagram story slides                 |
| `WISH_VIDEO_QUOTES` | BirthdayWish       | Quote cards beneath the closing video     |