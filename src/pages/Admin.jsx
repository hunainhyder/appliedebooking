import { useState, useEffect } from "react";
import { api } from "../api";

export default function Admin() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const adminSecret = import.meta.env.VITE_API_SECRET;

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await api.getBookings(adminSecret);
      if (res.data) setBookings(res.data);
    } catch (error) {
      console.error("Failed to load bookings", error);
    }
    setLoading(false);
  };

  const ticketPrice = 1600;
  const totalRevenue = bookings.length * ticketPrice;

  return (
    <div style={styles.container}>
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
          <span style={styles.statLabel}>Total Revenue</span>
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
              bookings.map((b, index) => (
                <tr key={b["Ticket ID"] || index} style={index % 2 === 0 ? {} : styles.altRow}>
                  <td style={styles.td}>{b["Ticket ID"]?.substring(0, 8)}...</td>
                  <td style={styles.td}>{b.Timestamp}</td>
                  <td style={styles.td}><strong>{b.Name}</strong></td>
                  <td style={styles.td}>{b.Email}</td>
                  <td style={styles.td}>{b.Phone}</td>
                  <td style={styles.td}>
                    <span style={styles.badge(b.Status)}>{b.Status}</span>
                  </td>
                  <td style={styles.td}>
                    <span style={{ color: b.Attendance === "TRUE" ? "#10b981" : "#ef4444", fontWeight: "600" }}>
                      {b.Attendance === "TRUE" ? "PRESENT" : "ABSENT"}
                    </span>
                  </td>
                </tr>
              ))
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
  badge: (status) => ({
    padding: "4px 10px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "700",
    backgroundColor: status === "Booked" ? "#e0f2fe" : "#f1f5f9",
    color: status === "Booked" ? "#0369a1" : "#475569"
  })
};
