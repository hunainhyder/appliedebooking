import { useState } from "react";
import QRCode from "react-qr-code";
import { api } from "../api";

export default function Booking() {
  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.bookTicket(form);
      if (res.status === "success") {
        setTicket(res.ticketId);
      } else {
        alert("Booking failed!");
      }
    } catch (error) {
      alert("Error connecting to server.");
    }
    setLoading(false);
  };

  if (ticket) {
    return (
      <div style={{ textAlign: "center", border: "2px dashed #333", padding: "2rem" }}>
        <h2>🎉 Ticket Confirmed!</h2>
        <p>Take a screenshot of this screen.</p>
        <div style={{ background: "white", padding: "16px", display: "inline-block" }}>
          <QRCode value={ticket} />
        </div>
        <p><strong>Ticket ID:</strong> {ticket}</p>
        <button onClick={() => window.location.reload()}>Book Another</button>
      </div>
    );
  }

  return (
    <div>
      <h1>University Event Booking</h1>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <input
          required
          placeholder="Full Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          style={{ padding: "10px", fontSize: "16px" }}
        />
        <input
          required
          type="email"
          placeholder="Email Address"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          style={{ padding: "10px", fontSize: "16px" }}
        />
        <input
          required
          placeholder="Phone Number"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
          style={{ padding: "10px", fontSize: "16px" }}
        />
        <button disabled={loading} style={{ padding: "10px", background: "blue", color: "white", cursor: "pointer" }}>
          {loading ? "Processing..." : "Get Ticket"}
        </button>
      </form>
    </div>
  );
}