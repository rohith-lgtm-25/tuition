function Sidebar({ setPage }) {
  return (
    <div className="sidebar">
      <h2>Tuition App</h2>

      <button onClick={() => setPage("dashboard")}>
        Dashboard
      </button>

      <button onClick={() => setPage("students")}>
        Students
      </button>

      <button onClick={() => setPage("fees")}>
        Fees
      </button>
    </div>
  );
}

export default Sidebar;