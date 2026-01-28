import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login({ setAuth }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    const envUsername = import.meta.env.VITE_APP_USERNAME;
    const envPassword = import.meta.env.VITE_APP_PASSWORD;

    if (username === envUsername && password === envPassword) {
      localStorage.setItem("isLoggedIn", "true");
      setAuth(true);
      navigate("/");
    } else {
      setError("Invalid username or password");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Admin Access</h1>
        <p style={styles.subtitle}>Enter credentials to manage bookings</p>

        {error && <div style={styles.error}>{error}</div>}

        <form onSubmit={handleLogin} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={styles.input}
              placeholder="Enter username"
              required
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={styles.input}
              placeholder="Enter password"
              required
            />
          </div>

          <button type="submit" style={styles.button}>
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    background: "linear-gradient(135deg, #1a0c2d 0%, #3d1c63 100%)",
    padding: "20px",
  },
  card: {
    width: "100%",
    maxWidth: "420px",
    padding: "48px 40px",
    borderRadius: "24px",
    backgroundColor: "rgba(255, 255, 255, 0.98)",
    boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
    textAlign: "center",
    backdropFilter: "blur(10px)",
  },
  title: {
    fontSize: "28px",
    fontWeight: "800",
    color: "#1a0c2d",
    marginBottom: "12px",
    letterSpacing: "-0.5px",
  },
  subtitle: {
    fontSize: "15px",
    color: "#6b7280",
    marginBottom: "36px",
    lineHeight: "1.5",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "24px",
    textAlign: "left",
  },
  inputGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  label: {
    fontSize: "14px",
    fontWeight: "700",
    color: "#374151",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
  },
  input: {
    padding: "14px 18px",
    fontSize: "16px",
    borderRadius: "12px",
    border: "2px solid #e5e7eb",
    outline: "none",
    transition: "all 0.3s ease",
    backgroundColor: "#f9fafb",
  },
  button: {
    marginTop: "16px",
    padding: "16px",
    fontSize: "16px",
    fontWeight: "800",
    color: "#fff",
    backgroundColor: "#1a0c2d",
    border: "none",
    borderRadius: "12px",
    cursor: "pointer",
    transition: "transform 0.2s, box-shadow 0.2s, background-color 0.2s",
    boxShadow: "0 4px 12px rgba(26, 12, 45, 0.2)",
  },
  error: {
    backgroundColor: "#fef2f2",
    border: "1px solid #fee2e2",
    color: "#dc2626",
    padding: "12px 16px",
    borderRadius: "12px",
    fontSize: "14px",
    fontWeight: "600",
    marginBottom: "24px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
  },
};

// CSS for input focus and button hover
const styleSheet = document.createElement("style");
styleSheet.innerText = `
  input:focus {
    border-color: #1a0c2d !important;
    background-color: #fff !important;
    box-shadow: 0 0 0 4px rgba(26, 12, 45, 0.1);
  }
  button:hover {
    background-color: #2d164d !important;
    transform: translateY(-2px);
    box-shadow: 0 6px 15px rgba(26, 12, 45, 0.25);
  }
  button:active {
    transform: translateY(0);
  }
`;
document.head.appendChild(styleSheet);
