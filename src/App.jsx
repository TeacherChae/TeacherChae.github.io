import MoonjarHero from './components/moonjar/MoonjarHero.jsx';
import { DateObject, VenueObject } from './components/moonjar/Sections.jsx';

export default function App() {
  return (
    <main className="bg-bone min-h-screen">
      <MoonjarHero />
      <DateObject />
      <VenueObject />
      <footer className="py-10 text-center text-[10px] tracking-[0.2em] uppercase text-ink/25 font-sans bg-bone">
        채건희 &amp; 이주경 · 2026
      </footer>
    </main>
  );
}
