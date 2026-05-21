import Hero from './components/Hero.jsx';
import Greeting from './components/Greeting.jsx';
import Gallery from './components/Gallery.jsx';
import Location from './components/Location.jsx';
import Account from './components/Account.jsx';
import RSVP from './components/RSVP.jsx';
import Guestbook from './components/Guestbook.jsx';

export default function App() {
  return (
    <main className="page">
      <Hero />
      <Greeting />
      <Gallery />
      <Location />
      <Account />
      <RSVP />
      <Guestbook />
      <footer className="px-6 py-10 text-center text-xs text-forest/40">
        with love · 2026
      </footer>
    </main>
  );
}
