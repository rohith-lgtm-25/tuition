import { useEffect, useState } from "react";

function Dashboard({ setPage }) {
  const [data, setData] = useState({
    total_students: 0,
    paid_fees: 0,
    pending_fees: 0,
    total_collected: 0,
    total_pending_amount: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/dashboard")
      .then((res) => {
        if (!res.ok) throw new Error("Network response was not ok");
        return res.json();
      })
      .then((data) => {
        setData(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load dashboard data", err);
        setLoading(false);
      });
  }, []);

  const totalPossible = data.total_collected + data.total_pending_amount;
  const collectionRate = totalPossible > 0 ? Math.round((data.total_collected / totalPossible) * 100) : 0;

  return (
    <>
      <div className="content-header">
        <div>
          <h1>Dashboard Overview</h1>
          <p>Real-time analytics and student tuition status updates.</p>
        </div>
      </div>

      {/* Stats Cards Grid */}
      <div className="stats-grid">
        {/* Total Students Card */}
        <div className="glass-panel stat-card">
          <div className="stat-info">
            <h3>Total Students</h3>
            <div className="stat-value">{data.total_students}</div>
          </div>
          <div className="stat-icon-wrapper" style={{ background: "rgba(139, 92, 246, 0.15)", color: "#a78bfa" }}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </div>
        </div>

        {/* Collected Fees Card */}
        <div className="glass-panel stat-card">
          <div className="stat-info">
            <h3>Fees Collected</h3>
            <div className="stat-value">₹{data.total_collected.toLocaleString()}</div>
            <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginTop: "4px" }}>
              {data.paid_fees} Transactions
            </p>
          </div>
          <div className="stat-icon-wrapper" style={{ background: "rgba(16, 185, 129, 0.15)", color: "#34d399" }}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="12" y1="1" x2="12" y2="23" />
              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </div>
        </div>

        {/* Pending Fees Card */}
        <div className="glass-panel stat-card">
          <div className="stat-info">
            <h3>Fees Pending</h3>
            <div className="stat-value" style={{ color: "#fbbf24" }}>₹{data.total_pending_amount.toLocaleString()}</div>
            <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginTop: "4px" }}>
              {data.pending_fees} Outstanding
            </p>
          </div>
          <div className="stat-icon-wrapper" style={{ background: "rgba(245, 158, 11, 0.15)", color: "#fbbf24" }}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          </div>
        </div>
      </div>

      <div className="dashboard-sections">
        {/* Progress & Metrics Card */}
        <div className="glass-panel section-card">
          <h2>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ color: "#a78bfa" }}>
              <line x1="18" y1="20" x2="18" y2="10" />
              <line x1="12" y1="20" x2="12" y2="4" />
              <line x1="6" y1="20" x2="6" y2="14" />
            </svg>
            Fee Collection Metrics
          </h2>
          <div style={{ marginTop: "16px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
              <span style={{ color: "var(--text-secondary)", fontSize: "0.95rem" }}>Collection Efficiency Rate</span>
              <span style={{ fontWeight: "600", color: "var(--success)" }}>{collectionRate}%</span>
            </div>
            {/* Custom Progress Bar */}
            <div style={{ height: "12px", background: "rgba(255, 255, 255, 0.05)", borderRadius: "6px", overflow: "hidden", position: "relative" }}>
              <div
                style={{
                  height: "100%",
                  width: `${collectionRate}%`,
                  background: "linear-gradient(90deg, #10b981 0%, #34d399 100%)",
                  borderRadius: "6px",
                  transition: "width 1s ease-in-out"
                }}
              />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "24px", gap: "16px" }}>
              <div style={{ background: "rgba(255,255,255,0.02)", padding: "16px", borderRadius: "var(--radius-md)", flex: 1, border: "1px solid var(--card-border)" }}>
                <div style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: "4px" }}>Total Potential Revenue</div>
                <div style={{ fontSize: "1.25rem", fontWeight: "700" }}>₹{totalPossible.toLocaleString()}</div>
              </div>
              <div style={{ background: "rgba(255,255,255,0.02)", padding: "16px", borderRadius: "var(--radius-md)", flex: 1, border: "1px solid var(--card-border)" }}>
                <div style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: "4px" }}>Collected Ratio</div>
                <div style={{ fontSize: "1.25rem", fontWeight: "700", color: "var(--success)" }}>{data.paid_fees} / {data.paid_fees + data.pending_fees} paid</div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions Panel */}
        <div className="glass-panel section-card">
          <h2>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ color: "#a78bfa" }}>
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
            Quick Actions
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginTop: "16px" }}>
            <button className="btn btn-primary" style={{ width: "100%", padding: "14px" }} onClick={() => setPage("students")}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              Manage Students
            </button>
            <button className="btn btn-secondary" style={{ width: "100%", padding: "14px" }} onClick={() => setPage("fees")}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5">
                <rect x="2" y="4" width="20" height="16" rx="2" />
                <line x1="12" y1="10" x2="12" y2="16" />
                <line x1="8" y1="12" x2="16" y2="12" />
              </svg>
              Record Fee Payment
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default Dashboard;