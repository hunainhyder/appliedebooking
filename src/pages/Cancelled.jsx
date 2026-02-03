import { useEffect, useState } from "react";
import { api } from "../api";

export default function Cancelled() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [processingId, setProcessingId] = useState(null);

  const adminSecret = import.meta.env.VITE_API_SECRET;

  useEffect(() => {
    loadCancelled();
  }, []);

  const loadCancelled = async () => {
    setLoading(true);
    try {
      const res = await api.getBookings(adminSecret || undefined);

      if (res?.data) {
        const cancelledOnly = res.data.filter(
          b => (b.Status || b.status) === "Cancelled"
        );
        setBookings(cancelledOnly);
      }
    } catch (err) {
      console.error("Failed to load cancelled bookings", err);
    }
    setLoading(false);
  };

  const handleRebook = async (ticketId, name) => {
    if (!ticketId) return;

    const ok = window.confirm(
      `Re-book ticket for ${name || "this user"}?`
    );
    if (!ok) return;

    setProcessingId(ticketId);
    try {
      const res = await api.bookTicketAgain(ticketId, adminSecret);

      if (res?.status === "success") {
        await loadCancelled(); // refresh table
      } else {
        alert(res?.message || "Re-book failed");
      }
    } catch (err) {
      console.error("Re-book error", err);
      alert("Error while re-booking");
    }
    setProcessingId(null);
  };

  const formatDateTime = (value) => {
    if (!value) return "-";

    const date = new Date(value);
    if (isNaN(date.getTime())) return "-";

    return `${date.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' })}`;
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Cancelled Bookings</h1>

      <div style={styles.tableWrapper}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Ticket ID</th>
              <th style={styles.th}>Timestamp</th>
              <th style={styles.th}>Name</th>
              <th style={styles.th}>Email</th>
              <th style={styles.th}>Phone</th>
              <th style={styles.th}>Action</th>
            </tr>
          </thead>

          <tbody>
            {bookings.length > 0 ? (
              bookings.map((b, i) => {
                const ticketId = b["Ticket ID"] || b.ticketId;
                return (
                  <tr key={ticketId || i}>
                    <td style={styles.tdMono}>
                      {ticketId}
                    </td>
                    <td style={styles.td}>{formatDateTime(b.Timestamp || b.timestamp)}</td>
                    <td style={styles.td}><strong>{b.Name || b.name}</strong></td>
                    <td style={styles.td}>{b.Email || b.email}</td>
                    <td style={styles.td}>{b.Phone || b.phone}</td>
                    <td style={styles.td}>
                      <button
                        disabled={processingId === ticketId}
                        onClick={() =>
                          handleRebook(ticketId, b.Name || b.name)
                        }
                        style={styles.rebookBtn(processingId === ticketId)}
                      >
                        {processingId === ticketId ? "Re-booking..." : "Re-Book"}
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="6" style={styles.empty}>
                  {loading
                    ? "Loading cancelled bookings..."
                    : "No cancelled bookings found"}
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
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "20px",
  },
  title: {
    fontSize: "28px",
    fontWeight: "900",
    marginBottom: "24px",
    color: "#1a0c2d",
  },
  tableWrapper: {
    overflowX: "auto",
    borderRadius: "16px",
    border: "1px solid #e5e7eb",
    background: "#fff",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  th: {
    padding: "16px",
    background: "#f9fafb",
    textAlign: "left",
    fontSize: "12px",
    fontWeight: "800",
    textTransform: "uppercase",
    color: "#4b5563",
    borderBottom: "1px solid #e5e7eb",
  },
  td: {
    padding: "16px",
    borderBottom: "1px solid #f1f5f9",
    fontSize: "14px",
  },
  tdMono: {
    padding: "16px",
    fontFamily: "monospace",
    fontSize: "13px",
    color: "#6b7280",
    borderBottom: "1px solid #f1f5f9",
  },
  empty: {
    padding: "60px",
    textAlign: "center",
    color: "#6b7280",
  },
  rebookBtn: (disabled) => ({
    padding: "8px 14px",
    borderRadius: "8px",
    border: "none",
    cursor: disabled ? "not-allowed" : "pointer",
    background: disabled ? "#9ca3af" : "#16a34a",
    color: "#fff",
    fontWeight: "700",
    fontSize: "13px",
  }),
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
