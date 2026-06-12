import { useState } from "react";
import { API_BASE_URL } from "../config";

function Login({ onLoginSuccess }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [shake, setShake] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Authentication failed");
      }

      // Successful login
      onLoginSuccess(data.token);
    } catch (err) {
      setError(err.message);
      setShake(true);
      setTimeout(() => setShake(false), 500); // Reset shake animation
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        width: "100vw",
        background: "var(--bg-gradient)",
        padding: "20px",
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 9999,
      }}
    >
      <div
        className={`glass-panel fade-in ${shake ? "shake" : ""}`}
        style={{
          width: "100%",
          maxWidth: "420px",
          padding: "40px",
          borderRadius: "var(--radius-lg)",
          boxShadow: "var(--shadow-lg)",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: "60px",
              height: "60px",
              borderRadius: "50%",
              background: "var(--accent-light)",
              color: "var(--accent-hover)",
              marginBottom: "16px",
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="30"
              height="30"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </div>
          <h2 style={{ fontSize: "1.75rem", fontWeight: "700" }}>Welcome Back</h2>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", marginTop: "6px" }}>
            Sign in to manage your tuition system
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {error && (
            <div
              style={{
                background: "var(--danger-light)",
                color: "#f87171",
                border: "1px solid rgba(239, 68, 68, 0.2)",
                padding: "12px 16px",
                borderRadius: "var(--radius-md)",
                fontSize: "0.85rem",
                lineHeight: "1.4",
              }}
            >
              {error}
            </div>
          )}

          <div className="form-group">
            <label style={{ fontSize: "0.85rem", fontWeight: "500", color: "var(--text-secondary)" }}>Username</label>
            <input
              type="text"
              required
              placeholder="Enter username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoFocus
            />
          </div>

          <div className="form-group">
            <label style={{ fontSize: "0.85rem", fontWeight: "500", color: "var(--text-secondary)" }}>Password</label>
            <input
              type="password"
              required
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: "100%", padding: "14px", marginTop: "8px" }} disabled={loading}>
            {loading ? "Authenticating..." : "Sign In"}
          </button>
        </form>

        <div style={{ textAlign: "center", marginTop: "24px" }}>
          <p style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
            Default Credentials: <code style={{ fontSize: "0.8rem" }}>admin</code> / <code style={{ fontSize: "0.8rem" }}>admin123</code>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
