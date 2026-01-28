import { useState, useEffect } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import { api } from "../api";

export default function Admin() {
  const [secret, setSecret] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [bookings, setBookings] = useState([]);
  const [view, setView] = useState("dashboard");

  const ADMIN_USERNAME = import.meta.env.VITE_APP_USERNAME; 
  const ADMIN_PASSWORD = import.meta.env.VITE_APP_PASSWORD; 

  const handleLogin = () => {
    if (secret === ADMIN_PASSWORD) {
      setIsLoggedIn(true);
      loadData();
    } else {
      alert("Wrong password");
    }
  };

  const loadData = async () => {
    const res = await api.getBookings(secret);
    if (res.data) setBookings(res.data);
  };

  return (
    <div>
      {!isLoggedIn ? (
        <div>
          <h1>Admin Login</h1>
          <input 
            type="password" 
            placeholder="Enter Admin Secret" 
            onChange={(e) => setSecret(e.target.value)} 
          />
          <button onClick={handleLogin}>Login</button>
        </div>
      ) : (
        <div>
          <div style={{ marginBottom: "20px" }}>
            <button onClick={() => setView("dashboard")} style={{ marginRight: "10px" }}>📊 Dashboard</button>
            <button onClick={() => setView("scanner")}>📷 Scan QR</button>
            <button onClick={loadData} style={{ marginLeft: "10px" }}>🔄 Refresh Data</button>
          </div>

          {view === "dashboard" ? (
            <Dashboard bookings={bookings} />
          ) : (
            <QRScanner secret={secret} />
          )}
        </div>
      )}
    </div>
  );
}

function Dashboard({ bookings }) {
  const totalRev = bookings.length * 10;
  
  return (
    <div>
      <h3>Total Bookings: {bookings.length} | Revenue: ${totalRev}</h3>
      <table border="1" cellPadding="10" style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ background: "#eee" }}>
            <th>Name</th>
            <th>Email</th>
            <th>Status</th>
            <th>Attended?</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((b) => (
            <tr key={b["Ticket ID"]}>
              <td>{b.Name}</td>
              <td>{b.Email}</td>
              <td>{b.Status}</td>
              <td style={{ color: b.Attendance === "TRUE" ? "green" : "red" }}>
                {b.Attendance === "TRUE" ? "YES" : "NO"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function QRScanner({ secret }) {
  useEffect(() => {
    const scanner = new Html5QrcodeScanner("reader", { fps: 10, qrbox: 250 });
    
    scanner.render(async (decodedText) => {
      scanner.pause();
      
      const res = await api.verifyTicket(decodedText, secret);
      
      if (res.status === "success") {
        alert(`✅ Verified! Welcome ${res.guest}`);
      } else {
        alert(`❌ ERROR: ${res.message}`);
      }
      
      scanner.resume();
    }, (err) => {

    });

    return () => scanner.clear();
  }, []);

  return (
    <div>
      <h3>Scan Attendee Ticket</h3>
      <div id="reader" style={{ width: "100%", maxWidth: "500px" }}></div>
    </div>
  );
}