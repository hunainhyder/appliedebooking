import { BrowserRouter, Routes, Route, Link, Navigate, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Booking from "./pages/Booking";
import Admin from "./pages/Admin";
import Verify from "./pages/Verify";
import Login from "./pages/Login";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem("isLoggedIn") === "true");

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    setIsLoggedIn(false);
  };

  return (
    <BrowserRouter>
      {isLoggedIn && (
        <nav style={styles.nav}>
          <div style={styles.navLinks}>
            <Link to="/" style={styles.link}>🎟️ Create Booking</Link>
            <Link to="/admin" style={styles.link}>📊 Admin Dashboard</Link>
          </div>
          <button onClick={handleLogout} style={styles.logoutBtn}>Logout</button>
        </nav>
      )}

      <div className="container" style={styles.container}>
        <Routes>
          <Route
            path="/login"
            element={isLoggedIn ? <Navigate to="/" /> : <Login setAuth={setIsLoggedIn} />}
          />
          <Route
            path="/"
            element={isLoggedIn ? <Booking /> : <Navigate to="/login" />}
          />
          <Route
            path="/admin"
            element={isLoggedIn ? <Admin /> : <Navigate to="/login" />}
          />
          <Route path="/verify/:id" element={<Verify />} />
          <Route path="*" element={<Navigate to={isLoggedIn ? "/" : "/login"} />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

const styles = {
  nav: {
    padding: '1rem 2rem',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderBottom: '1px solid #f3f4f6',
    marginBottom: '2rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
    backdropFilter: 'blur(10px)',
    position: 'sticky',
    top: 0,
    zIndex: 100,
  },
  navLinks: {
    display: 'flex',
    gap: '32px'
  },
  link: {
    color: '#1a0c2d',
    textDecoration: 'none',
    fontWeight: '700',
    fontSize: '14px',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    transition: 'color 0.2s',
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  logoutBtn: {
    padding: '10px 20px',
    backgroundColor: '#fff',
    color: '#ef4444',
    border: '2px solid #fee2e2',
    borderRadius: '12px',
    cursor: 'pointer',
    fontWeight: '700',
    fontSize: '13px',
    transition: 'all 0.2s',
    textTransform: 'uppercase',
  },
  container: {
    maxWidth: '1280px',
    margin: '0 auto',
    padding: '0 1rem'
  }
};

// CSS for navbar link hover
const styleSheet = document.createElement("style");
styleSheet.innerText = `
  a:hover {
    color: #4c1d95 !important;
  }
  button:hover {
    background-color: #fef2f2 !important;
    border-color: #fecaca !important;
  }
`;
document.head.appendChild(styleSheet);

export default App;