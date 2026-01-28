import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Ticket from "../components/Ticket";

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

      <div style={styles.statusSection}>
        <div style={styles.statusCard}>
          <span style={styles.statusLabel}>Booking Status</span>
          <span style={styles.statusValue}>{data.status}</span>
        </div>
        <div style={styles.statusCard}>
          <span style={styles.statusLabel}>Attendance</span>
          <span style={styles.statusValue(data.used)}>
            {data.used ? 'ALREADY CHECKED IN' : 'VALID FOR ENTRY'}
          </span>
        </div>
      </div>
      
      <div style={styles.ticketSection}>
        <Ticket name={data.name} ticketId={id} />
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
    padding: "20px"
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
  statusSection: {
    display: "flex",
    gap: "20px",
    marginBottom: "40px"
  },
  statusCard: {
    flex: 1,
    padding: "20px",
    backgroundColor: "#fff",
    borderRadius: "12px",
    border: "1px solid #edf2f7",
    display: "flex",
    flexDirection: "column",
    gap: "8px"
  },
  statusLabel: {
    fontSize: "12px",
    fontWeight: "700",
    color: "#718096",
    textTransform: "uppercase"
  },
  statusValue: (used) => ({
    fontSize: "18px",
    fontWeight: "800",
    color: used ? "#e53e3e" : "#1a0c2d"
  }),
  ticketSection: {
    transform: "scale(0.95)",
    transformOrigin: "top center"
  },
  footer: {
    marginTop: "60px",
    textAlign: "center",
    color: "#a0aec0",
    fontSize: "12px"
  }
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