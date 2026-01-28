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
    minHeight: "80vh",
  },
  card: {
    width: "100%",
    maxWidth: "400px",
    padding: "40px",
    borderRadius: "16px",
    backgroundColor: "#ffffff",
    boxShadow: "0 10px 25px rgba(0,0,0,0.05)",
    textAlign: "center",
  },
  title: {
    fontSize: "24px",
    fontWeight: "700",
    color: "#1a0c2d",
    marginBottom: "8px",
  },
  subtitle: {
    fontSize: "14px",
    color: "#666",
    marginBottom: "32px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
    textAlign: "left",
  },
  inputGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  label: {
    fontSize: "14px",
    fontWeight: "600",
    color: "#444",
  },
  input: {
    padding: "12px 16px",
    fontSize: "16px",
    borderRadius: "8px",
    border: "1px solid #ddd",
    outline: "none",
    transition: "border-color 0.2s",
  },
  button: {
    marginTop: "12px",
    padding: "14px",
    fontSize: "16px",
    fontWeight: "700",
    color: "#fff",
    backgroundColor: "#1a0c2d",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "opacity 0.2s",
  },
  error: {
    backgroundColor: "#fff1f0",
    border: "1px solid #ffa39e",
    color: "#f5222d",
    padding: "10px",
    borderRadius: "8px",
    fontSize: "14px",
    marginBottom: "20px",
  },
};
