import ExhibitionCover from './components/museum/ExhibitionCover.jsx';
import CuratorNote from './components/museum/CuratorNote.jsx';
import FloorPlan from './components/museum/FloorPlan.jsx';

export default function App() {
  return (
    <main className="bg-museum-cream" style={{ maxWidth: '460px', margin: '0 auto' }}>
      <ExhibitionCover />
      <CuratorNote />
      <FloorPlan />
      <footer
        className="bg-museum-cream px-8 py-8 text-center"
        style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
      >
        <p className="text-[10px] uppercase tracking-[0.25em] text-museum-ink/35">
          &copy; Gallery Forever &middot; MMXXVI
        </p>
      </footer>
    </main>
  );
}
