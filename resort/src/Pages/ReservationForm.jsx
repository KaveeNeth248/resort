import React, { useState, useEffect } from "react";
import api from "../api/api";
import "./theme.css";

const ReservationForm = ({ reservationId, onSuccess }) => {
  const [reservation, setReservation] = useState({
    user: { id: "" },
    room: { roomId: "" },
    checkIn: "",
    checkOut: "",
  });

  const [users, setUsers] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successPopup, setSuccessPopup] = useState(""); 

  useEffect(() => {
    api.get("/auth/users")
      .then(res => setUsers(res.data.filter(u => u.role === "CUSTOMER")))
      .catch(() => setError("Failed to load users"));

    api.get("/rooms")
      .then(res => setRooms(res.data))
      .catch(() => setError("Failed to load rooms"));
  }, []);

  useEffect(() => {
    if (reservationId) {
      setLoading(true);
      api.get(`/reservations/${reservationId}`)
        .then(res => {
          setReservation({
            user: { id: res.data.user.id },
            room: { roomId: res.data.room.roomId },
            checkIn: res.data.checkIn,
            checkOut: res.data.checkOut,
          });
        })
        .catch(() => setError("Failed to load reservation"))
        .finally(() => setLoading(false));
    }
  }, [reservationId]);

  const handleChange = e => {
    const { name, value } = e.target;
    if (name === "userId") setReservation(prev => ({ ...prev, user: { id: value } }));
    else if (name === "roomId") setReservation(prev => ({ ...prev, room: { roomId: value } }));
    else setReservation(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccessPopup(""); // reset

    const payload = {
      user: { id: Number(reservation.user.id) },
      room: { roomId: Number(reservation.room.roomId) },
      checkIn: reservation.checkIn,
      checkOut: reservation.checkOut,
    };

    try {
      if (reservationId) {
        await api.put(`/reservations/${reservationId}`, payload);
        showPopup("Reservation updated successfully!");
      } else {
        await api.post("/reservations", payload);
        showPopup("Reservation added successfully!");
      }

      onSuccess?.();
      setReservation({ user: { id: "" }, room: { roomId: "" }, checkIn: "", checkOut: "" });

    } catch (err) {
      setError(err.response?.data?.message || "Reservation failed");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Function to show popup for 3 seconds
  const showPopup = (message) => {
    setSuccessPopup(message);
    setTimeout(() => setSuccessPopup(""), 3000);
  };

  return (
    <div className="form-container">
      <h3 style={{ textAlign: "center", marginBottom: "20px" }}>
        {reservationId ? "Update Reservation" : "Add Reservation"}
      </h3>

      {/* ✅ Popup message */}
      {successPopup && (
      <div className="popup-success">
      {successPopup}
      </div>
       )}

      {error && <p className="error-text">{error}</p>}
      {loading && <p className="loading-text">Loading...</p>}

      <form onSubmit={handleSubmit}>
        <div className="formGroup">
          <label>Customer</label>
          <select name="userId" value={reservation.user.id} onChange={handleChange} required>
            <option value="">Select Customer</option>
            {users.map(u => <option key={u.id} value={u.id}>{u.username}</option>)}
          </select>
        </div>

        <div className="formGroup">
          <label>Room</label>
          <select name="roomId" value={reservation.room.roomId} onChange={handleChange} required>
            <option value="">Select Room</option>
            {rooms.map(r => (
              <option key={r.roomId} value={r.roomId}>
                {r.roomType} - ₹{r.pricePerNight} ({r.status})
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

        <button type="submit" className="submitBtn">
          {reservationId ? "Update Reservation" : "Add Reservation"}
        </button>
      </form>
    </div>
  );
};

export default ReservationForm;