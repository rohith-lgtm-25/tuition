import { useState } from "react";
import "./App.css";

import Dashboard from "./components/Dashboard";
import Students from "./Students";
import Fees from "./Fees";

function App() {
  const [page, setPage] = useState("dashboard");

  // Modern SVG Icons
  const DashboardIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
      <rect x="3" y="3" width="7" height="9" rx="1" />
      <rect x="14" y="3" width="7" height="5" rx="1" />
      <rect x="14" y="12" width="7" height="9" rx="1" />
      <rect x="3" y="16" width="7" height="5" rx="1" />
    </svg>
  );

  const StudentsIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );

  const FeesIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
      <line x1="12" y1="1" x2="12" y2="23" />
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  );

  return (
    <div className="container">
      {/* Sidebar Layout */}
      <aside className="sidebar">
        <h2>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="28"
            height="28"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            style={{ color: "#a78bfa" }}
          >
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
          </svg>
          <span>Tuition App</span>
        </h2>

        <nav className="sidebar-nav">
          <button
            className={page === "dashboard" ? "active" : ""}
            onClick={() => setPage("dashboard")}
          >
            <DashboardIcon />
            <span>Dashboard</span>
          </button>

          <button
            className={page === "students" ? "active" : ""}
            onClick={() => setPage("students")}
          >
            <StudentsIcon />
            <span>Students</span>
          </button>

          <button
            className={page === "fees" ? "active" : ""}
            onClick={() => setPage("fees")}
          >
            <FeesIcon />
            <span>Fees Management</span>
          </button>
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="content">
        {page === "dashboard" && (
          <div className="fade-in">
            <Dashboard setPage={setPage} />
          </div>
        )}

        {page === "students" && (
          <div className="fade-in">
            <Students />
          </div>
        )}

        {page === "fees" && (
          <div className="fade-in">
            <Fees />
          </div>
        )}
      </main>
    </div>
  );
}

export default App;