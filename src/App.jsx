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
    padding: '1.2rem 2rem',
    backgroundColor: '#fff',
    borderBottom: '1px solid #edf2f7',
    marginBottom: '2rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
  },
  navLinks: {
    display: 'flex',
    gap: '30px'
  },
  link: {
    color: '#1a0c2d',
    textDecoration: 'none',
    fontWeight: '600',
    fontSize: '15px'
  },
  logoutBtn: {
    padding: '8px 16px',
    backgroundColor: '#fef2f2',
    color: '#dc2626',
    border: '1px solid #fecaca',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '14px'
  },
  container: {
    maxWidth: '1100px',
    margin: '0 auto',
    padding: '1rem'
  }
};

export default App;