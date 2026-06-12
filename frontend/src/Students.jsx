import { useEffect, useState } from "react";

function Students() {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");
  
  // Form state
  const [editingStudentId, setEditingStudentId] = useState(null);
  const [name, setName] = useState("");
  const [parentName, setParentName] = useState("");
  const [phone, setPhone] = useState("");
  const [admissionDate, setAdmissionDate] = useState("");
  const [monthlyFee, setMonthlyFee] = useState("");
  
  // Modal visibility
  const [showModal, setShowModal] = useState(false);

  const loadStudents = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/students");
      const data = await response.json();
      setStudents(data);
    } catch (err) {
      console.error("Failed to load students", err);
    }
  };

  useEffect(() => {
    loadStudents();
  }, []);

  const openAddModal = () => {
    setEditingStudentId(null);
    setName("");
    setParentName("");
    setPhone("");
    setAdmissionDate("");
    setMonthlyFee("");
    setShowModal(true);
  };

  const openEditModal = (student) => {
    setEditingStudentId(student.id);
    setName(student.name);
    setParentName(student.parent_name);
    setPhone(student.phone);
    setAdmissionDate(student.admission_date);
    setMonthlyFee(student.monthly_fee.toString());
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const studentData = {
      name,
      parent_name: parentName,
      phone,
      admission_date: admissionDate,
      monthly_fee: Number(monthlyFee),
    };

    try {
      if (editingStudentId) {
        // Edit student
        await fetch(`http://127.0.0.1:8000/students/${editingStudentId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(studentData),
        });
      } else {
        // Add student
        await fetch("http://127.0.0.1:8000/students", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(studentData),
        });
      }
      
      setShowModal(false);
      loadStudents();
    } catch (err) {
      console.error("Failed to save student", err);
    }
  };

  const deleteStudent = async (id) => {
    if (!confirm("Are you sure you want to delete this student?")) return;
    try {
      await fetch(`http://127.0.0.1:8000/students/${id}`, {
        method: "DELETE",
      });
      loadStudents();
    } catch (err) {
      console.error("Failed to delete student", err);
    }
  };

  // Filter students based on search query
  const filteredStudents = students.filter((student) => {
    const term = search.toLowerCase();
    return (
      student.name.toLowerCase().includes(term) ||
      student.parent_name.toLowerCase().includes(term) ||
      student.phone.includes(term)
    );
  });

  return (
    <div>
      <div className="content-header">
        <div>
          <h1>Students Directory</h1>
          <p>Manage tuition classes, view and register student profiles.</p>
        </div>
        <button className="btn btn-primary" onClick={openAddModal}>
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          Add Student
        </button>
      </div>

      {/* Search Input Bar */}
      <div className="search-bar-container">
        <div className="search-input-wrapper">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input
            placeholder="Search by name, parent's name, or phone number..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Students List Table */}
      <div className="glass-panel table-wrapper">
        <table className="modern-table">
          <thead>
            <tr>
              <th>Student Details</th>
              <th>Parent / Contact</th>
              <th>Admission Date</th>
              <th>Monthly Fee</th>
              <th style={{ textAlign: "right" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.length === 0 ? (
              <tr>
                <td colSpan="5" style={{ textAlign: "center", padding: "40px", color: "var(--text-muted)" }}>
                  No students found matching your search.
                </td>
              </tr>
            ) : (
              filteredStudents.map((student, index) => {
                const initials = student.name ? student.name.split(" ").map(n => n[0]).join("").toUpperCase().substring(0, 2) : "S";
                return (
                  <tr key={student.id}>
                    <td>
                      <div className="student-meta-cell">
                        <div className="student-avatar">{initials}</div>
                        <div>
                          <div style={{ fontWeight: "600" }}>{student.name}</div>
                          <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>ID: #{index + 1}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div style={{ fontWeight: "500" }}>{student.parent_name}</div>
                      <div style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>{student.phone}</div>
                    </td>
                    <td>
                      <div>{student.admission_date || "N/A"}</div>
                    </td>
                    <td>
                      <div style={{ fontWeight: "600", color: "var(--accent-hover)" }}>₹{student.monthly_fee}</div>
                    </td>
                    <td>
                      <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}>
                        <button className="btn btn-secondary" style={{ padding: "8px 14px", fontSize: "0.85rem" }} onClick={() => openEditModal(student)}>
                          Edit
                        </button>
                        <button className="btn btn-danger" style={{ padding: "8px 14px", fontSize: "0.85rem" }} onClick={() => deleteStudent(student.id)}>
                          Delete
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

      {/* Edit/Add Overlay Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="glass-panel modal-content">
            <div className="modal-header">
              <h2>{editingStudentId ? "Edit Student Profile" : "Register New Student"}</h2>
              <button className="close-btn" onClick={() => setShowModal(false)}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="form-grid">
              <div className="form-group form-group-full">
                <label>Student Name</label>
                <input
                  required
                  placeholder="Enter full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Parent Name</label>
                <input
                  required
                  placeholder="Enter parent's name"
                  value={parentName}
                  onChange={(e) => setParentName(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Phone Number</label>
                <input
                  required
                  placeholder="Enter phone number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Admission Date</label>
                <input
                  required
                  type="date"
                  value={admissionDate}
                  onChange={(e) => setAdmissionDate(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Monthly Tuition Fee</label>
                <input
                  required
                  type="number"
                  placeholder="Fee amount in ₹"
                  value={monthlyFee}
                  onChange={(e) => setMonthlyFee(e.target.value)}
                />
              </div>

              <div className="form-group-full form-actions" style={{ marginTop: "16px" }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingStudentId ? "Save Changes" : "Register Student"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Students;