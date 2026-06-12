import { useEffect, useState } from "react";

function Fees() {
  const [students, setStudents] = useState([]);
  const [fees, setFees] = useState([]);
  
  // Form input states
  const [studentId, setStudentId] = useState("");
  const [month, setMonth] = useState("");
  const [amount, setAmount] = useState("");
  const [status, setStatus] = useState("Paid");
  
  // Filter states
  const [filterStudent, setFilterStudent] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const loadStudents = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/students");
      const data = await response.json();
      setStudents(data);
    } catch (err) {
      console.error("Failed to load students", err);
    }
  };

  const loadFees = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/fees");
      const data = await response.json();
      setFees(data);
    } catch (err) {
      console.error("Failed to load fees history", err);
    }
  };

  useEffect(() => {
    loadStudents();
    loadFees();
    
    // Default to current month name
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const currentMonth = months[new Date().getMonth()];
    setMonth(currentMonth);
  }, []);

  // When a student is selected, auto-fill the fee amount field with their monthly tuition fee rate
  const handleStudentChange = (e) => {
    const selectedId = e.target.value;
    setStudentId(selectedId);
    
    if (selectedId) {
      const selectedStudent = students.find(s => s.id === Number(selectedId));
      if (selectedStudent) {
        setAmount(selectedStudent.monthly_fee.toString());
      }
    } else {
      setAmount("");
    }
  };

  const addFee = async (e) => {
    e.preventDefault();

    if (!studentId) {
      alert("Please select a student");
      return;
    }

    try {
      await fetch("http://127.0.0.1:8000/fees", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          student_id: Number(studentId),
          month,
          amount: Number(amount),
          status
        }),
      });

      alert("Fee payment recorded successfully");
      setStudentId("");
      setAmount("");
      setStatus("Paid");
      loadFees();
    } catch (err) {
      console.error("Failed to save fee", err);
    }
  };

  const toggleFeeStatus = async (feeId, currentStatus) => {
    const newStatus = currentStatus === "Paid" ? "Pending" : "Paid";
    try {
      await fetch(`http://127.0.0.1:8000/fees/${feeId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      loadFees();
    } catch (err) {
      console.error("Failed to update fee status", err);
    }
  };

  // Maps student IDs to student objects for quick name lookup in the fee logs
  const studentMap = {};
  students.forEach(s => {
    studentMap[s.id] = s;
  });

  // Filtered fee history
  const filteredFees = fees.filter(fee => {
    const student = studentMap[fee.student_id];
    const nameMatch = !filterStudent || (student && student.name.toLowerCase().includes(filterStudent.toLowerCase()));
    const statusMatch = filterStatus === "all" || fee.status === filterStatus;
    return nameMatch && statusMatch;
  });

  const monthsList = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  return (
    <div>
      <div className="content-header">
        <div>
          <h1>Fees Management</h1>
          <p>Record payments, track outstanding fees, and view collection logs.</p>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "30px", alignItems: "start" }}>
        
        {/* Record Fee Form Card */}
        <div className="glass-panel form-card" style={{ width: "100%", maxWidth: "100%", margin: 0 }}>
          <h2 style={{ fontSize: "1.2rem", marginBottom: "20px" }}>Record Payment</h2>
          <form onSubmit={addFee} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            
            <div className="form-group">
              <label>Select Student</label>
              <select value={studentId} onChange={handleStudentChange} required>
                <option value="">-- Choose Student --</option>
                {students.map(s => (
                  <option key={s.id} value={s.id}>
                    {s.name} (ID: #{s.id}, Fee: ₹{s.monthly_fee})
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Month</label>
              <select value={month} onChange={(e) => setMonth(e.target.value)} required>
                {monthsList.map(m => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Amount (₹)</label>
              <input
                required
                type="number"
                placeholder="Enter amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Status</label>
              <select value={status} onChange={(e) => setStatus(e.target.value)}>
                <option value="Paid">Paid</option>
                <option value="Pending">Pending</option>
              </select>
            </div>

            <button type="submit" className="btn btn-primary" style={{ marginTop: "8px" }}>
              Save Payment Record
            </button>
          </form>
        </div>

        {/* Payment History and Filters */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          
          {/* History Filters */}
          <div className="glass-panel" style={{ padding: "20px", display: "flex", gap: "16px", flexWrap: "wrap", alignItems: "center" }}>
            <div style={{ flex: 1, minWidth: "150px" }}>
              <input
                placeholder="Filter by student name..."
                value={filterStudent}
                onChange={(e) => setFilterStudent(e.target.value)}
                style={{ padding: "10px 14px", fontSize: "0.85rem" }}
              />
            </div>
            
            <div style={{ width: "150px" }}>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                style={{ padding: "10px 14px", fontSize: "0.85rem" }}
              >
                <option value="all">All Statuses</option>
                <option value="Paid">Paid Only</option>
                <option value="Pending">Pending Only</option>
              </select>
            </div>
          </div>

          {/* Fee Logs Table */}
          <div className="glass-panel table-wrapper">
            <table className="modern-table">
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Month</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th style={{ textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredFees.length === 0 ? (
                  <tr>
                    <td colSpan="5" style={{ textAlign: "center", padding: "40px", color: "var(--text-muted)" }}>
                      No payment records found.
                    </td>
                  </tr>
                ) : (
                  filteredFees.map((fee) => {
                    const student = studentMap[fee.student_id];
                    return (
                      <tr key={fee.id}>
                        <td>
                          <div style={{ fontWeight: "600" }}>{student ? student.name : `Student ID: #${fee.student_id}`}</div>
                          <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>
                            {student ? `Parent: ${student.parent_name}` : "N/A"}
                          </div>
                        </td>
                        <td>
                          <div>{fee.month}</div>
                        </td>
                        <td>
                          <div style={{ fontWeight: "600" }}>₹{fee.amount.toLocaleString()}</div>
                        </td>
                        <td>
                          <span className={`badge ${fee.status === "Paid" ? "badge-success" : "badge-warning"}`}>
                            {fee.status}
                          </span>
                        </td>
                        <td>
                          <div style={{ display: "flex", justifyContent: "flex-end" }}>
                            <button
                              className="btn btn-secondary"
                              style={{ padding: "6px 12px", fontSize: "0.8rem" }}
                              onClick={() => toggleFeeStatus(fee.id, fee.status)}
                            >
                              Mark {fee.status === "Paid" ? "Pending" : "Paid"}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

        </div>

      </div>
    </div>
  );
}

export default Fees;