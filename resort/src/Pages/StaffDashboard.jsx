import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import "./theme.css";

export default function StaffDashboard() {
  const navigate = useNavigate();
  const fullName = localStorage.getItem("fullName");

  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("ALL"); // Filter state

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      const res = await api.get("/rooms");
      setRooms(res.data);
    } catch (err) {
      console.error(err);
      setError("Failed to load rooms.");
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("fullName");
    navigate("/");
  };

  // Filter rooms based on selected filter
  const filteredRooms = rooms.filter((room) => {
    if (filter === "ALL") return true;
    return room.status.toLowerCase() === filter.toLowerCase();
  });

  return (
    <div className="dashboard-container">

      {/* Navigation */}
      <div className="dashboard-nav">
        <div className="nav-title">OceanView Staff</div>
        <div className="nav-links">
          <button className="nav-btn" onClick={() => navigate("/manage-reservations")}>
            Manage Reservations
          </button>
          <button className="nav-btn" onClick={() => navigate("/help/staff")}>
            Help
          </button>
          <button className="nav-btn" onClick={logout}>
            Logout
          </button>
        </div>
      </div>

      {/* Header */}
      <div className="dashboard-header">
        <h1>Welcome, {fullName}</h1>
      </div>

      {/* Rooms Section Header */}
      <div className="dashboard-header">
        <h2>All Rooms 🏨</h2>

        {/* Filter Buttons */}
        <div style={{ marginTop: "10px", display: "flex", gap: "10px", justifyContent: "center" }}>
          <button
            className={`add-btn ${filter === "ALL" ? "active-filter" : ""}`}
            onClick={() => setFilter("ALL")}
          >
            All
          </button>
          <button
            className={`add-btn ${filter === "AVAILABLE" ? "active-filter" : ""}`}
            onClick={() => setFilter("AVAILABLE")}
          >
            Available
          </button>
          <button
            className={`delete-btn ${filter === "BOOKED" ? "active-filter" : ""}`}
            onClick={() => setFilter("BOOKED")}
          >
            Booked
          </button>
        </div>
      </div>

      {loading && <p className="loading-text">Loading rooms...</p>}
      {error && <p className="error-text">{error}</p>}

      <div className="stats-grid">
        {filteredRooms.map((room) => (
          <div key={room.roomId} className="stat-card room-card">
            <img
              src={room.imageUrl || "https://via.placeholder.com/300x200"}
              alt={room.roomType}
              className="room-image"
            />
            <h3>{room.roomType}</h3>
            <p>{room.description}</p>
            <p>
              <strong>Price/Night:</strong> ₹{room.pricePerNight}
            </p>

            {/* Status button */}
            <div className="reservation-actions">
              <button
                className={room.status.toLowerCase() === "available" ? "add-btn" : "delete-btn"}
              >
                {room.status.toUpperCase() === "AVAILABLE" ? "Available" : "Booked"}
              </button>
            </div>
          </div>
        ))}

        {filteredRooms.length === 0 && !loading && (
          <p className="loading-text">No rooms found for this filter.</p>
        )}
      </div>
    </div>
  );
}
