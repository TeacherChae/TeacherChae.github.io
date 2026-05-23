import TrainTicket from './components/train/TrainTicket.jsx';
import Itinerary from './components/train/Itinerary.jsx';
import TransitGuide from './components/train/TransitGuide.jsx';

export default function App() {
  return (
    <main className="page">
      <TrainTicket />
      <Itinerary />
      <TransitGuide />
      <footer className="bg-ktx-navy px-6 py-8 text-center text-xs text-korail-turquoise/50 font-mono tracking-widest uppercase">
        KORAIL FOREVER · ALL ABOARD · 2026
      </footer>
    </main>
  );
}
