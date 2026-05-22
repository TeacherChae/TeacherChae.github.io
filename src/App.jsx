import BoardingPass from './components/cards/BoardingPass.jsx';
import WelcomeLetter from './components/cards/WelcomeLetter.jsx';
import DepartureLog from './components/cards/DepartureLog.jsx';
import TerminalMap from './components/cards/TerminalMap.jsx';
import Receipt from './components/cards/Receipt.jsx';
import Confirmation from './components/cards/Confirmation.jsx';
import Postcard from './components/cards/Postcard.jsx';
import { JourneyMarker } from './components/cards/_shared.jsx';

export default function App() {
  return (
    <main className="ticket-page">
      <BoardingPass />
      <JourneyMarker withPlane />
      <WelcomeLetter />
      <JourneyMarker />
      <DepartureLog />
      <JourneyMarker withPlane />
      <TerminalMap />
      <JourneyMarker />
      <Receipt />
      <JourneyMarker />
      <Confirmation />
      <JourneyMarker withPlane />
      <Postcard />
      <footer className="px-6 py-10 text-center font-mono text-[10px] tracking-[0.25em] text-forest/40 uppercase">
        ✈ Forever Airlines · with love · 2026
      </footer>
    </main>
  );
}
