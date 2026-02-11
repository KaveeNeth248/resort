import { useEffect, useState } from "react";
import api from "../api/api";
import "./theme.css";


export default function ManageReservation() {
  const [reservations, setReservations] = useState([]);

  useEffect(() => {
    api.get("/reservations")
      .then(res => setReservations(res.data));
  }, []);

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Manage Reservations</h1>
      </div>

      <div className="stats-grid">
        {reservations.map(res => (
          <div className="stat-card" key={res.reservationId}>
            <div className="reservation-info">
              <p><strong>ID:</strong> {res.reservationId}</p>
              <p><strong>Status:</strong> {res.status}</p>
            </div>

            <div className="reservation-actions">
              <button className="edit-btn">Approve</button>
              <button className="delete-btn">Reject</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
