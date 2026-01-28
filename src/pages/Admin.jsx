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
        <h1 className="admin-title" style={styles.title}>Admin Dashboard</h1>
        <button className="admin-refresh-btn" onClick={loadData} style={styles.refreshBtn}>
          {loading ? "Loading..." : "🔄 Refresh Data"}
        </button>
      </div>

      <div style={styles.statsRow}>
        <div className="admin-stat-card" style={styles.statCard}>
          <span style={styles.statLabel}>Total Bookings</span>
          <span className="admin-stat-value" style={styles.statValue}>{bookings.length}</span>
        </div>
        <div className="admin-stat-card" style={styles.statCard}>
          <span style={styles.statLabel}>Total Revenue (Booked Only)</span>
          <span className="admin-stat-value" style={styles.statValue}>Rs. {totalRevenue.toLocaleString()}</span>
        </div>
        <div className="admin-stat-card" style={styles.statCard}>
          <span style={styles.statLabel}>Ticket Price</span>
          <span className="admin-stat-value" style={styles.statValue}>Rs. {ticketPrice}</span>
        </div>
      </div>

      <div style={styles.tableWrapper}>
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
                      <td className="ticket-id-cell" style={styles.td}>{bTicketId?.substring(0, 12)}...</td>
                      <td style={styles.td}>{b.Timestamp || b.timestamp}</td>
                      <td style={styles.td}><strong>{b.Name || b.name}</strong></td>
                      <td style={styles.td}>{b.Email || b.email}</td>
                      <td style={styles.td}>{b.Phone || b.phone}</td>
                      <td style={styles.td}>
                        <select
                          className="status-select"
                          style={styles.statusSelect(bStatus)}
                          value={bStatus}
                          onChange={(e) => handleStatusChange(bTicketId, bStatus, e.target.value)}
                        >
                          <option value="Booked">Booked</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </td>
                      <td style={styles.td}>
                        <span style={{
                          color: b.Attendance === "TRUE" ? "#16a34a" : "#dc2626",
                          fontWeight: "800",
                          fontSize: "12px",
                          backgroundColor: b.Attendance === "TRUE" ? "#f0fdf4" : "#fef2f2",
                          padding: "4px 10px",
                          borderRadius: "6px",
                          textTransform: "uppercase"
                        }}>
                          {b.Attendance === "TRUE" ? "PRESENT" : "ABSENT"}
                        </span>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="7" style={{ ...styles.td, textAlign: "center", padding: "60px" }}>
                    {loading ? "Fetching records..." : "No bookings found"}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
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
    backgroundColor: "rgba(255,255,255,0.85)",
    zIndex: 1000,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    backdropFilter: "blur(8px)"
  },
  overlayText: {
    marginTop: "24px",
    color: "#1a0c2d",
    fontWeight: "700",
    fontSize: "20px"
  },
  loader: {
    width: "56px",
    height: "56px",
    border: "6px solid #f3f4f6",
    borderBottomColor: "#1a0c2d",
    borderRadius: "50%",
    animation: "rotation 1s linear infinite",
  },
  container: {
    padding: "0 20px 60px",
    maxWidth: "1200px",
    margin: "0 auto",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "40px",
    paddingTop: "20px",
    gap: "20px",
    flexWrap: "wrap",
  },
  title: {
    fontSize: "32px",
    fontWeight: "900",
    color: "#1a0c2d",
    margin: 0,
    letterSpacing: "-1px",
  },
  refreshBtn: {
    padding: "12px 24px",
    backgroundColor: "#fff",
    border: "2px solid #e5e7eb",
    borderRadius: "12px",
    cursor: "pointer",
    fontWeight: "700",
    fontSize: "15px",
    color: "#374151",
    transition: "all 0.3s ease",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  statsRow: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "24px",
    marginBottom: "48px",
  },
  statCard: {
    backgroundColor: "#fff",
    padding: "32px",
    borderRadius: "24px",
    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
    border: "1px solid #f3f4f6",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    transition: "transform 0.3s ease",
  },
  statLabel: {
    fontSize: "13px",
    color: "#6b7280",
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: "0.1em"
  },
  statValue: {
    fontSize: "32px",
    color: "#1a0c2d",
    fontWeight: "900"
  },
  tableWrapper: {
    width: "100%",
    overflowX: "auto",
    borderRadius: "24px",
    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.05), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
    backgroundColor: "#fff",
    border: "1px solid #f3f4f6",
  },
  tableContainer: {
    minWidth: "100%", // Ensures it takes full width of scroll container
  },
  table: {
    width: "100%",
    borderCollapse: "separate",
    borderSpacing: 0,
    textAlign: "left",
  },
  th: {
    padding: "20px 24px",
    backgroundColor: "#f9fafb",
    borderBottom: "2px solid #f3f4f6",
    fontSize: "12px",
    fontWeight: "800",
    color: "#4b5563",
    textTransform: "uppercase",
    whiteSpace: "nowrap",
    letterSpacing: "0.05em",
  },
  td: {
    padding: "20px 24px",
    fontSize: "15px",
    color: "#111827",
    borderBottom: "1px solid #f3f4f6",
    verticalAlign: "middle",
  },
  altRow: {
    backgroundColor: "#fcfcfc"
  },
  statusSelect: (status) => ({
    padding: "6px 14px",
    borderRadius: "9999px",
    fontSize: "12px",
    fontWeight: "800",
    border: "none",
    cursor: "pointer",
    backgroundColor: status === "Booked" ? "#dcfce7" : "#fee2e2",
    color: status === "Booked" ? "#166534" : "#991b1b",
    outline: "none",
    transition: "all 0.2s ease",
    textTransform: "uppercase",
  })
};

// Global styles for animation and responsiveness
const styleSheet = document.createElement("style");
styleSheet.innerText = `
  @keyframes rotation {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  .admin-refresh-btn:hover {
    border-color: #1a0c2d !important;
    color: #1a0c2d !important;
    transform: translateY(-2px);
  }

  /* Custom Scrollbar for Table */
  div::-webkit-scrollbar {
    height: 8px;
  }
  div::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 10px;
  }
  div::-webkit-scrollbar-thumb {
    background: #d1d5db;
    border-radius: 10px;
  }
  div::-webkit-scrollbar-thumb:hover {
    background: #9ca3af;
  }

  /* Responsive Stats */
  @media (max-width: 640px) {
    .admin-title {
      font-size: 24px !important;
    }
    .admin-stat-card {
      padding: 20px !important;
    }
    .admin-stat-value {
      font-size: 24px !important;
    }
  }

  /* Table Cell Styling */
  .ticket-id-cell {
    font-family: monospace;
    color: #6b7280;
    font-size: 13px;
  }
`;
document.head.appendChild(styleSheet);
