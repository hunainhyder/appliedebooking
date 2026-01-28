import { useState, useEffect } from "react";
import { api } from "../api";

export default function Admin() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const adminSecret = import.meta.env.VITE_API_SECRET;

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      // Pass adminSecret or undefined to use default in api.js
      const res = await api.getBookings(adminSecret || undefined);
      if (res.data) setBookings(res.data);
    } catch (error) {
      console.error("Failed to load bookings", error);
    }
    setLoading(false);
  };

  const handleStatusChange = async (ticketId, currentStatus, newStatus) => {
    if (currentStatus === newStatus) return;

    const actionText = newStatus === "Cancelled" ? "cancel" : "re-book";
    if (!window.confirm(`Are you sure you want to ${actionText} this ticket?`)) {
      return;
    }

    setProcessing(true);
    try {
      let res;
      if (newStatus === "Cancelled") {
        res = await api.cancelTicket(ticketId, adminSecret);
      } else {
        res = await api.bookTicketAgain(ticketId, adminSecret);
      }

      if (res.status === "success") {
        await loadData(); // Refresh the table
      } else {
        alert(res.message || "Failed to update status");
      }
    } catch (error) {
      console.error("Status update failed", error);
      alert("Error updating status");
    }
    setProcessing(false);
  };

  const ticketPrice = 1600;
  const totalRevenue = bookings
    .filter(b => (b.Status || b.status) === "Booked")
    .length * ticketPrice;

  return (
    <div style={styles.container}>
      {processing && (
        <div style={styles.overlay}>
          <div style={styles.loader}></div>
          <p style={styles.overlayText}>Processing Update...</p>
        </div>
      )}

      <div style={styles.header}>
        <h1 style={styles.title}>Admin Dashboard</h1>
        <button onClick={loadData} style={styles.refreshBtn}>
          {loading ? "Loading..." : "🔄 Refresh Data"}
        </button>
      </div>

      <div style={styles.statsRow}>
        <div style={styles.statCard}>
          <span style={styles.statLabel}>Total Bookings</span>
          <span style={styles.statValue}>{bookings.length}</span>
        </div>
        <div style={styles.statCard}>
          <span style={styles.statLabel}>Total Revenue (Booked Only)</span>
          <span style={styles.statValue}>Rs. {totalRevenue.toLocaleString()}</span>
        </div>
        <div style={styles.statCard}>
          <span style={styles.statLabel}>Ticket Price</span>
          <span style={styles.statValue}>Rs. {ticketPrice}</span>
        </div>
      </div>

      <div style={styles.tableContainer}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Ticket ID</th>
              <th style={styles.th}>Timestamp</th>
              <th style={styles.th}>Name</th>
              <th style={styles.th}>Email</th>
              <th style={styles.th}>Phone</th>
              <th style={styles.th}>Status</th>
              <th style={styles.th}>Attendance</th>
            </tr>
          </thead>
          <tbody>
            {bookings.length > 0 ? (
              bookings.map((b, index) => {
                const bStatus = b.Status || b.status;
                const bTicketId = b["Ticket ID"] || b.ticketId;
                return (
                  <tr key={bTicketId || index} style={index % 2 === 0 ? {} : styles.altRow}>
                    <td style={styles.td}>{bTicketId?.substring(0, 8)}...</td>
                    <td style={styles.td}>{b.Timestamp || b.timestamp}</td>
                    <td style={styles.td}><strong>{b.Name || b.name}</strong></td>
                    <td style={styles.td}>{b.Email || b.email}</td>
                    <td style={styles.td}>{b.Phone || b.phone}</td>
                    <td style={styles.td}>
                      <select
                        style={styles.statusSelect(bStatus)}
                        value={bStatus}
                        onChange={(e) => handleStatusChange(bTicketId, bStatus, e.target.value)}
                      >
                        <option value="Booked">Booked</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td style={styles.td}>
                      <span style={{ color: b.Attendance === "TRUE" ? "#10b981" : "#ef4444", fontWeight: "600" }}>
                        {b.Attendance === "TRUE" ? "PRESENT" : "ABSENT"}
                      </span>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="7" style={{ ...styles.td, textAlign: "center", padding: "40px" }}>
                  {loading ? "Fetching records..." : "No bookings found"}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(255,255,255,0.8)",
    zIndex: 1000,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    backdropFilter: "blur(4px)"
  },
  overlayText: {
    marginTop: "20px",
    color: "#1a0c2d",
    fontWeight: "600",
    fontSize: "18px"
  },
  loader: {
    width: "48px",
    height: "48px",
    border: "5px solid #edf2f7",
    borderBottomColor: "#1a0c2d",
    borderRadius: "50%",
    animation: "rotation 1s linear infinite",
  },
  container: {
    paddingBottom: "40px"
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "30px"
  },
  title: {
    fontSize: "28px",
    fontWeight: "800",
    color: "#1a0c2d",
    margin: 0
  },
  refreshBtn: {
    padding: "10px 20px",
    backgroundColor: "#fff",
    border: "1px solid #ddd",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600"
  },
  statsRow: {
    display: "flex",
    gap: "20px",
    marginBottom: "30px",
    flexWrap: "wrap"
  },
  statCard: {
    flex: 1,
    minWidth: "200px",
    backgroundColor: "#fff",
    padding: "24px",
    borderRadius: "12px",
    boxShadow: "0 4px 6px rgba(0,0,0,0.02)",
    border: "1px solid #edf2f7",
    display: "flex",
    flexDirection: "column",
    gap: "8px"
  },
  statLabel: {
    fontSize: "14px",
    color: "#718096",
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: "0.05em"
  },
  statValue: {
    fontSize: "24px",
    color: "#1a202c",
    fontWeight: "800"
  },
  tableContainer: {
    backgroundColor: "#fff",
    borderRadius: "12px",
    overflow: "hidden",
    boxShadow: "0 4px 6px rgba(0,0,0,0.02)",
    border: "1px solid #edf2f7"
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    textAlign: "left"
  },
  th: {
    padding: "16px 20px",
    backgroundColor: "#f8fafc",
    borderBottom: "1px solid #edf2f7",
    fontSize: "13px",
    fontWeight: "700",
    color: "#4a5568",
    textTransform: "uppercase"
  },
  td: {
    padding: "16px 20px",
    fontSize: "14px",
    color: "#2d3748",
    borderBottom: "1px solid #f1f5f9"
  },
  altRow: {
    backgroundColor: "#fdfdfd"
  },
  statusSelect: (status) => ({
    padding: "4px 10px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "700",
    border: "1px solid #edf2f7",
    cursor: "pointer",
    backgroundColor: status === "Booked" ? "#e0f2fe" : "#fee2e2",
    color: status === "Booked" ? "#0369a1" : "#dc2626",
    outline: "none"
  })
};

// Global styles for animation
const styleSheet = document.createElement("style");
styleSheet.innerText = `
  @keyframes rotation {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;
document.head.appendChild(styleSheet);
