import { useRef, useState } from 'react';
import Opening from './components/editorial/Opening.jsx';
import Hero from './components/editorial/Hero.jsx';
import DateVenue from './components/editorial/DateVenue.jsx';
import Dday from './components/editorial/Dday.jsx';
import Invitation from './components/editorial/Invitation.jsx';
import Gallery from './components/editorial/Gallery.jsx';
import Location from './components/editorial/Location.jsx';
import RSVP from './components/editorial/RSVP.jsx';
import Account from './components/editorial/Account.jsx';
import Guestbook from './components/editorial/Guestbook.jsx';
import Footer from './components/editorial/Footer.jsx';
import ScrollProgress from './components/editorial/ScrollProgress.jsx';
import Bgm from './components/editorial/Bgm.jsx';

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
