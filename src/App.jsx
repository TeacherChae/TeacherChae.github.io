import { useState } from 'react';
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

export default function App() {
  const [openingDone, setOpeningDone] = useState(false);

  return (
    <main className="page">
      <div className="grain" aria-hidden="true" />
      {!openingDone ? (
        <Opening onComplete={() => setOpeningDone(true)} />
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
