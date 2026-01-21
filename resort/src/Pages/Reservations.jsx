import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import "./theme.css";


function Reservations() {
  const [reservations, setReservations] = useState([]);
  const navigate = useNavigate();

  // Load all reservations
  const loadReservations = async () => {
    try {
      const res = await api.get("/reservations");
      setReservations(res.data);
    } catch (error) {
      console.error("Error loading reservations:", error);
    }
  };

  useEffect(() => {
    loadReservations();
  }, []);

  // Delete reservation by ID
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this reservation?")) return;

    try {
      await api.delete(`/reservations/${id}`);
      setReservations(reservations.filter((res) => res.id !== id));
    } catch (error) {
      console.error("Error deleting reservation:", error);
    }
  };

  return (
    <div className="dashboard-container">
      <h1 style={{ color: 'var(--accent)', marginBottom: '30px' }}>
        Reservation Management
      </h1>
      
      <div className="stats-grid">
        {reservations.map(res => (
          <div key={res.id} className="stat-card">
            <div className="stat-label">Guest: {res.guest}</div>
            <div style={{ marginBottom: '10px' }}>
              <strong>Room:</strong> {res.room}
            </div>
            <div style={{ marginBottom: '10px', color: 'var(--muted)' }}>
              <strong>Check-in:</strong> {res.checkIn}<br/>
              <strong>Check-out:</strong> {res.checkOut}
            </div>

            {/* Delete button at the bottom of card */}
            <button 
              className="delete-btn"
              onClick={() => handleDelete(res.id)}
            >
              Delete
            </button>
          </div>
        ))}
      </div>

      <button 
        onClick={() => navigate("/dashboard")}
        style={{
          marginTop: '30px',
          padding: '12px 24px',
          background: 'linear-gradient(135deg, var(--accent), #E8C550)',
          border: 'none',
          borderRadius: '8px',
          color: '#000',
          fontWeight: '600',
          cursor: 'pointer'
        }}
      >
        Back to Dashboard
      </button>
    </div>
  );
}

export default Reservations;
