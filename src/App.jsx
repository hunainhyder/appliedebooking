import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Booking from "./pages/Booking";
import Admin from "./pages/Admin";

function App() {
  return (
    <BrowserRouter>
      <nav style={{ padding: '1rem', borderBottom: '1px solid #ccc', marginBottom: '2rem' }}>
        <Link to="/" style={{ marginRight: '20px' }}>🎟️ Buy Ticket</Link>
        <Link to="/admin">🔒 Admin Panel</Link>
      </nav>

      <div className="container" style={{ maxWidth: '800px', margin: '0 auto', padding: '1rem' }}>
        <Routes>
          <Route path="/" element={<Booking />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;