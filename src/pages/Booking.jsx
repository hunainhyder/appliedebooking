// src/pages/Booking.jsx
import { useState } from "react";
import { api } from "../api";
import Ticket from "../components/Ticket";
import html2canvas from "html2canvas";

export default function Booking() {
  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const [ticketId, setTicketId] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.bookTicket(form);
      if (res.status === "success") {
        setTicketId(res.ticketId);
      } else {
        alert(res.message || "Booking failed! Please try again.");
      }
    } catch (error) {
      console.error(error);
      alert("Error connecting to server.");
    }
    setLoading(false);
  };

  // --- DOWNLOAD FUNCTION ---
  const downloadTicket = async () => {
    const element = document.getElementById("ticket-node"); // 1. Finds the specific div

    if (!element) {
      alert("Could not find ticket to download");
      return;
    }

    const canvas = await html2canvas(element, {
      scale: 3, // 3x Resolution for crisp text
      windowWidth: 1600, // Fakes a desktop view so it doesn't stack vertically
      backgroundColor: null,
      useCORS: true
    });

    const image = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = image;
    link.download = `Ticket-${form.name}.png`;
    link.click();
  };

  // --- SUCCESS STATE ---
  if (ticketId) {
    return (
      <div style={styles.container}>
        <h2 style={{ color: "#1a0c2d", marginBottom: "20px" }}>🎉 Booking Confirmed!</h2>

        {/* --- CRITICAL FIX: Wrapped Ticket in a div with ID --- */}
        <div id="ticket-node" style={{ padding: '10px' }}>
          <Ticket name={form.name} ticketId={ticketId} />
        </div>

        <div style={{ marginTop: "30px", display: "flex", gap: "15px", flexWrap: "wrap", justifyContent: "center" }}>
          <button onClick={downloadTicket} style={styles.primaryBtn}>
            📥 Download Ticket
          </button>

          <button onClick={() => window.location.reload()} style={styles.secondaryBtn}>
            Book Another
          </button>
        </div>
      </div>
    );
  }

  // --- FORM STATE ---
  return (
    <div style={styles.formCard}>
      <h1 style={{ textAlign: "center", color: "#333", marginBottom: "20px" }}>University Event Booking</h1>

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
        <input
          required
          placeholder="Full Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          style={styles.input}
        />
        <input
          required
          type="email"
          placeholder="Email Address"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          style={styles.input}
        />
        <input
          required
          placeholder="Phone Number"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
          style={styles.input}
        />

        <button disabled={loading} style={{ ...styles.primaryBtn, width: '100%', marginTop: '10px', opacity: loading ? 0.7 : 1 }}>
          {loading ? "Processing..." : "Get Ticket"}
        </button>
      </form>
    </div>
  );
}

// Cleaned up styles object
const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "40px 20px",
    background: "#f4f4f4",
    minHeight: "100vh"
  },
  formCard: {
    maxWidth: "500px",
    margin: "50px auto",
    padding: "30px",
    boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
    borderRadius: "10px",
    background: "white"
  },
  input: {
    padding: "12px",
    fontSize: "16px",
    borderRadius: "5px",
    border: "1px solid #ddd"
  },
  primaryBtn: {
    padding: "12px 24px",
    fontSize: "16px",
    cursor: "pointer",
    background: "#1a0c2d",
    color: "white",
    border: "none",
    borderRadius: "5px",
    fontWeight: "bold"
  },
  secondaryBtn: {
    padding: "12px 24px",
    fontSize: "16px",
    cursor: "pointer",
    background: "transparent",
    color: "#1a0c2d",
    border: "2px solid #1a0c2d",
    borderRadius: "5px"
  }
};