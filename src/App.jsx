import "./index.css";

// Layout
import Navbar  from "./components/layout/Navbar";
import Footer  from "./components/layout/Footer";

// Features (floating / global UI)
import MusicToggle    from "./components/features/MusicToggle";
import MidnightReveal from "./components/features/MidnightReveal";

// Sections (top → bottom page order)
import HeroSection      from "./components/sections/HeroSection";
import CountdownSection from "./components/sections/CountdownSection";
import StorySection     from "./components/sections/StorySection";
import GymSection       from "./components/sections/GymSection";
import GymReelSection   from "./components/sections/GymReelSection";
import QuotesSection    from "./components/sections/QuotesSection";
import FriendsSection   from "./components/sections/FriendsSection";
import TimelineSection  from "./components/sections/TimelineSection";
import BirthdayWish     from "./components/sections/BirthdayWish";

export default function App() {
  return (
    <>
      {/* Midnight birthday reveal — renders as full-screen overlay on April 11 */}
      <MidnightReveal />

      {/* Floating global UI */}
      <MusicToggle />

      {/* Page shell — Navbar contains the translate pill */}
      <Navbar />

      {/* Page sections */}
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