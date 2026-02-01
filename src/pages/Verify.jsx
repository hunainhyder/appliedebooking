import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Ticket from "../components/Ticket";
import html2canvas from "html2canvas";

const checkTicket = async (id) => {
  const SCRIPT_URL = import.meta.env.VITE_API_URL;
  const url = `${SCRIPT_URL}?action=verify_ticket&ticketId=${id}`;
  const res = await fetch(url);
  return await res.json();
};

export default function Verify() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    checkTicket(id).then((res) => {
      if (res.status === 'success' && res.ticket) {
        setData(res.ticket);
      } else {
        setError(true);
      }
      setLoading(false);
    }).catch(() => {
      setError(true);
      setLoading(false);
    });
  }, [id]);

  const downloadTicket = async () => {
    const element = document.getElementById("ticket-node");
    if (!element) {
      alert("Could not find ticket to download");
      return;
    }

    try {
      const canvas = await html2canvas(element, {
        scale: 3,
        windowWidth: 1600,
        backgroundColor: null,
        useCORS: true
      });

      const image = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = image;
      link.download = `Ticket-${data.name}.png`;
      link.click();
    } catch (err) {
      console.error("Download failed:", err);
      alert("Failed to download ticket. Please try again.");
    }
  };

  if (loading) return (
    <div style={styles.center}>
      <div style={styles.loader}></div>
      <h2 style={styles.loadingText}>Verifying Ticket Integrity...</h2>
    </div>
  );

  if (error || !data) return (
    <div style={styles.center}>
      <div style={styles.errorIcon}>❌</div>
      <h2 style={styles.errorText}>Invalid Ticket ID</h2>
      <p style={styles.errorSubtext}>This ticket could not be found in our database or has been revoked.</p>
    </div>
  );

  return (
    <div style={styles.container}>
      <div style={styles.verifyBadge}>
        <span style={styles.checkIcon}>✓</span>
        <div style={styles.badgeText}>
          <h3 style={styles.badgeTitle}>OFFICIALLY VERIFIED</h3>
          <p style={styles.badgeSub}>Secure University Booking System</p>
        </div>
      </div>

      <div style={styles.tableContainer}>
        <h2 style={styles.tableTitle}>Ticket Details</h2>
        <table style={styles.table}>
          <tbody>
            <tr>
              <td style={styles.tdLabel}>Passenger Name</td>
              <td style={styles.tdValue}>{data.name}</td>
            </tr>
            <tr>
              <td style={styles.tdLabel}>Ticket ID</td>
              <td style={styles.tdValue}>{id}</td>
            </tr>
            <tr>
              <td style={styles.tdLabel}>Booking Status</td>
              <td style={styles.tdValue}>
                <span style={styles.statusBadge(data.status)}>
                  {data.status ? data.status.toUpperCase() : "UNKNOWN"}
                </span>
              </td>
            </tr>
            <tr>
              <td style={styles.tdLabel}>Attendance</td>
              <td style={styles.tdValue}>
                <span style={{ color: data.used ? "#e53e3e" : "#10b981", fontWeight: "bold" }}>
                  {data.used ? 'ALREADY CHECKED IN' : 'VALID FOR ENTRY'}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div style={styles.actionSection}>
        <button onClick={downloadTicket} style={styles.downloadBtn}>
          📥 Download E-Ticket (Pass)
        </button>
      </div>

      {/* Hidden Ticket for Download - Forced PC Style rendering via fixed width container */}
      <div style={{ position: 'absolute', left: '-9999px', top: '0', width: '1200px' }}>
        <div id="ticket-node" style={{ padding: '20px', background: 'white' }}>
          <Ticket name={data.name} ticketId={id} />
        </div>
      </div>

      <div style={styles.footer}>
        <p>© 2026 University Department of Applied Chemistry</p>
      </div>
    </div>
  );
}

const styles = {
  center: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "60vh",
    textAlign: "center"
  },
  loader: {
    width: "48px",
    height: "48px",
    border: "5px solid #edf2f7",
    borderBottomColor: "#1a0c2d",
    borderRadius: "50%",
    animation: "rotation 1s linear infinite",
    marginBottom: "20px"
  },
  loadingText: {
    color: "#4a5568",
    fontSize: "18px",
    fontWeight: "600"
  },
  errorIcon: {
    fontSize: "64px",
    marginBottom: "20px"
  },
  errorText: {
    color: "#e53e3e",
    fontSize: "24px",
    fontWeight: "800",
    marginBottom: "10px"
  },
  errorSubtext: {
    color: "#718096",
    fontSize: "16px"
  },
  container: {
    maxWidth: "900px",
    margin: "0 auto",
    padding: "20px",
    minHeight: "100vh"
  },
  verifyBadge: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
    backgroundColor: "#ecfdf5",
    border: "1px solid #6ee7b7",
    padding: "20px",
    borderRadius: "12px",
    marginBottom: "30px"
  },
  checkIcon: {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    backgroundColor: "#10b981",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "24px",
    fontWeight: "bold"
  },
  badgeText: {
    display: "flex",
    flexDirection: "column"
  },
  badgeTitle: {
    margin: 0,
    color: "#065f46",
    fontSize: "18px",
    fontWeight: "800",
    letterSpacing: "0.5px"
  },
  badgeSub: {
    margin: 0,
    color: "#047857",
    fontSize: "13px",
    fontWeight: "600"
  },
  tableContainer: {
    backgroundColor: "#fff",
    borderRadius: "12px",
    padding: "30px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
    border: "1px solid #edf2f7",
    marginBottom: "30px",
    overflowX: "auto"
  },
  tableTitle: {
    margin: "0 0 20px 0",
    fontSize: "20px",
    color: "#1a0c2d",
    borderBottom: "2px solid #f7fafc",
    paddingBottom: "10px"
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    minWidth: "600px" // Force PC-like width
  },
  tdLabel: {
    padding: "15px",
    textAlign: "left",
    color: "#718096",
    fontWeight: "600",
    borderBottom: "1px solid #f7fafc",
    width: "250px"
  },
  tdValue: {
    padding: "15px",
    textAlign: "left",
    color: "#1a0c2d",
    fontWeight: "500",
    borderBottom: "1px solid #f7fafc"
  },
  statusBadge: (status = "") => ({
    padding: "6px 12px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "800",
    backgroundColor: status.toLowerCase() === 'booked' ? "#ecfdf5" : "#fff5f5",
    color: status.toLowerCase() === 'booked' ? "#10b981" : "#e53e3e",
    border: `1px solid ${status.toLowerCase() === 'booked' ? "#6ee7b7" : "#feb2b2"}`
  }),
  actionSection: {
    display: "flex",
    justifyContent: "center",
    marginTop: "20px"
  },
  downloadBtn: {
    backgroundColor: "#1a0c2d",
    color: "#fff",
    border: "none",
    padding: "15px 30px",
    borderRadius: "8px",
    fontSize: "16px",
    fontWeight: "700",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "10px",
    transition: "all 0.2s ease",
    boxShadow: "0 4px 12px rgba(26, 12, 45, 0.2)"
  },
  footer: {
    marginTop: "60px",
    textAlign: "center",
    color: "#a0aec0",
    fontSize: "12px"
  }
};

// Global styles for animation
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement("style");
  styleSheet.innerText = `
    @keyframes rotation {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `;
  document.head.appendChild(styleSheet);
}
