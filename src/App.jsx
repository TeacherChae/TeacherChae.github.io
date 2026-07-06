import { useRef, useState } from 'react';
import Opening from './components/editorial/sections/Opening.jsx';
import Hero from './components/editorial/sections/Hero.jsx';
import DateVenue from './components/editorial/sections/DateVenue.jsx';
import Dday from './components/editorial/sections/Dday.jsx';
import Invitation from './components/editorial/sections/Invitation.jsx';
import Gallery from './components/editorial/sections/Gallery.jsx';
import Location from './components/editorial/sections/Location.jsx';
import RSVP from './components/editorial/sections/RSVP.jsx';
import Account from './components/editorial/sections/Account.jsx';
import Guestbook from './components/editorial/sections/Guestbook.jsx';
import Footer from './components/editorial/sections/Footer.jsx';
import ScrollProgress from './components/editorial/ui/ScrollProgress.jsx';
import Bgm from './components/editorial/ui/Bgm.jsx';

// BGM 음원은 Supabase Storage('assets' 공개 버킷)에 둔다. ref 하드코딩 없이 env 에서 조립.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const bgmSrc = supabaseUrl
  ? `${supabaseUrl}/storage/v1/object/public/assets/bgm.mp3`
  : '/audio/bgm.mp3';

export default function App() {
  const [openingDone, setOpeningDone] = useState(false);
  const bgmRef = useRef(null);

  return (
    <main className="page">
      <div className="grain" aria-hidden="true" />
      <Bgm ref={bgmRef} src={bgmSrc} />
      {!openingDone ? (
        <Opening
          onEnter={() => bgmRef.current?.start()}
          onComplete={() => setOpeningDone(true)}
        />
      ) : (
        <>
          <ScrollProgress />
          <Hero />
          <DateVenue />
          <Invitation />
          <Gallery />
          <Location />
          <RSVP />
          <Guestbook />
          <Account />
          <Dday />
          <Footer />
        </>
      )}
    </main>
  );
}
