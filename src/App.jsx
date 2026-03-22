import "./index.css";

// Layout
import Navbar  from "./components/layout/Navbar";
import Footer  from "./components/layout/Footer";

// Features (floating / global UI)
import MusicToggle from "./components/features/MusicToggle";

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
      {/* Floating global UI */}
      <MusicToggle />

      {/* Page shell — Navbar now contains the translate pill */}
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