import React, { useState, useEffect } from "react";
import api from "../api/api";
import "./theme.css";

const AdminManageStaff = () => {
  const [staffList, setStaffList] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    fullName: "",
    username: "",
    password: "",
    active: true,
  });
  const [showForm, setShowForm] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [showPasswords, setShowPasswords] = useState({}); // track password visibility per staff

  // Load staff
  const loadStaff = async () => {
    try {
      const res = await api.get("/staff");
      setStaffList(res.data);
    } catch (err) {
      console.error("Failed to load staff", err);
    }
  };

  useEffect(() => {
    loadStaff();
  }, []);

  // Add / Update staff
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/staff/${editingId}`, form);
        setSuccessMsg("Staff updated successfully!");
      } else {
        await api.post("/staff", form);
        setSuccessMsg("Staff added successfully!");
      }
      setForm({ fullName: "", username: "", password: "", active: true });
      setEditingId(null);
      setShowForm(false);
      loadStaff();
    } catch (err) {
      console.error("Failed to submit staff", err);
    }
  };

  const handleEdit = (staff) => {
    setEditingId(staff.id);
    setForm({
      fullName: staff.fullName,
      username: staff.username,
      password: "",
      active: staff.active,
    });
    setShowForm(true);
  };

  const deleteStaff = async (id) => {
    if (window.confirm("Are you sure you want to delete this staff?")) {
      try {
        await api.delete(`/staff/${id}`);
        setSuccessMsg("Staff deleted successfully!");
        loadStaff();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const toggleActive = async (staff) => {
    try {
      await api.put(`/staff/${staff.id}`, { ...staff, active: !staff.active });
      setSuccessMsg(`Staff ${staff.active ? "deactivated" : "activated"}!`);
      loadStaff();
    } catch (err) {
      console.error(err);
    }
  };

  const togglePasswordVisibility = (id) => {
    setShowPasswords((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="dashboard-container">
      <h2 className="dashboard-header" style={{ textAlign: "center" }}>
        Manage Staff
      </h2>

      {/* Success Message */}
      {successMsg && (
        <div className="success-msg" onClick={() => setSuccessMsg("")}>
          {successMsg} (click to close)
        </div>
      )}

      {/* Add / Edit Form */}
      {showForm && (
        <div className="form-container">
          <h3>{editingId ? "Edit Staff" : "Add Staff"}</h3>
          <form onSubmit={handleSubmit}>
            <input
              placeholder="Full Name"
              value={form.fullName}
              onChange={(e) => setForm({ ...form, fullName: e.target.value })}
              required
            />
            <input
              placeholder="Username"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              {...(!editingId && { required: true })}
            />
            <label>
              <input
                type="checkbox"
                checked={form.active}
                onChange={(e) => setForm({ ...form, active: e.target.checked })}
              />{" "}
              Active
            </label>
            <div style={{ marginTop: "10px" }}>
              <button className="add-btn" type="submit">
                {editingId ? "Update" : "Add"}
              </button>
              {editingId && (
                <button
                  className="cancel-btn"
                  type="button"
                  onClick={() => {
                    setEditingId(null);
                    setForm({ fullName: "", username: "", password: "", active: true });
                    setShowForm(false);
                  }}
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>
      )}

      {/* Staff Table */}
      <table
        border="1"
        cellPadding="5"
        style={{ marginTop: 20, width: "100%", borderCollapse: "collapse" }}
      >
        <thead style={{ background: "#42a5f5", color: "#fff" }}>
          <tr>
            <th>ID</th>
            <th>Full Name</th>
            <th>Username</th>
            <th>Password</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {staffList.map((staff) => (
            <tr key={staff.id}>
              <td>{staff.id}</td>
              <td>{staff.fullName}</td>
              <td>{staff.username}</td>
              <td>
                {showPasswords[staff.id] ? staff.password || "******" : "******"}{" "}
                <button
                  className="toggle-btn"
                  style={{ padding: "2px 5px", marginLeft: 5 }}
                  onClick={() => togglePasswordVisibility(staff.id)}
                >
                  {showPasswords[staff.id] ? "Hide" : "Show"}
                </button>
              </td>
              <td>{staff.active ? "Active" : "Inactive"}</td>
              <td>
                <button className="edit-btn" onClick={() => handleEdit(staff)}>
                  Edit
                </button>
                <button className="delete-btn" onClick={() => deleteStaff(staff.id)}>
                  Delete
                </button>
                <button className="toggle-btn" onClick={() => toggleActive(staff)}>
                  {staff.active ? "Deactivate" : "Activate"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {!showForm && (
        <button className="add-btn" style={{ marginTop: 15 }} onClick={() => setShowForm(true)}>
          + Add Staff
        </button>
      )}
    </div>
  );
};

export default AdminManageStaff;
