import React, { useState, useEffect } from "react";
import api from "../api/api"
import "./theme.css";

const ReservationForm = ({ reservationId, onSuccess }) => {
  const [reservation, setReservation] = useState({
    user: { userId: "" },
    room: { roomId: "" },
    checkIn: "",
    checkOut: "",
  });

  const [users, setUsers] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // Fetch users and rooms
    api.get("/users").then(res => setUsers(res.data));
    api.get("/rooms").then(res => setRooms(res.data));

    // If editing
    if (reservationId) {
      setLoading(true);
      api.get(`/reservations/${reservationId}`)
        .then(res => {
          setReservation({
            user: { userId: res.data.user.userId },
            room: { roomId: res.data.room.roomId },
            checkIn: res.data.checkIn,
            checkOut: res.data.checkOut,
          });
        })
        .catch(err => setError("Failed to load reservation"))
        .finally(() => setLoading(false));
    }
  }, [reservationId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "userId" || name === "roomId") {
      setReservation(prev => ({
        ...prev,
        [name === "userId" ? "user" : "room"]: { [name]: value },
      }));
    } else {
      setReservation(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (reservationId) {
        await api.put(`/reservations/${reservationId}`, reservation);
      } else {
        await api.post("/reservations", reservation);
      }
      onSuccess();
    } catch (err) {
      console.error(err);
      setError("Error saving reservation");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <h2>{reservationId ? "Update" : "Add"} Reservation</h2>

      {error && <div className="error-text">{error}</div>}
      {loading && <div className="loading-text">Loading...</div>}

      <form>
        <div className="formGroup">
          <label>User</label>
          <select name="userId" value={reservation.user.userId} onChange={handleChange} required>
            <option value="">Select User</option>
            {users.map(u => (
              <option key={u.userId} value={u.userId}>{u.name}</option>
            ))}
          </select>
        </div>

        <div className="formGroup">
          <label>Room</label>
          <select name="roomId" value={reservation.room.roomId} onChange={handleChange} required>
            <option value="">Select Room</option>
            {rooms.map(r => (
              <option key={r.roomId} value={r.roomId}>
                {r.roomType} - {r.status}
              </option>
            ))}
          </select>
        </div>

        <div className="formGroup">
          <label>Check-In</label>
          <input type="date" name="checkIn" value={reservation.checkIn} onChange={handleChange} required />
        </div>

        <div className="formGroup">
          <label>Check-Out</label>
          <input type="date" name="checkOut" value={reservation.checkOut} onChange={handleChange} required />
        </div>

        <button type="submit" className="submitBtn" onClick={handleSubmit} disabled={loading}>
          {reservationId ? "Update" : "Add"} Reservation
        </button>
      </form>
    </div>
  );
};

export default ReservationForm;
