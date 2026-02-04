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
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const today = new Date().toISOString().split("T")[0];

  // Load users and rooms
  useEffect(() => {
    api.get("/auth/users")
      .then((res) => setUsers(res.data.filter(u => u.role === "CUSTOMER")))
      .catch(() => setErrors(prev => ({ ...prev, general: "Failed to load users" })));

    api.get("/rooms")
      .then((res) => setRooms(res.data))
      .catch(() => setErrors(prev => ({ ...prev, general: "Failed to load rooms" })));
  }, []);

  // Load reservation if editing
  useEffect(() => {
    if (!reservationId) return;
    setLoading(true);
    api.get(`/reservations/${reservationId}`)
      .then((res) => {
        setReservation({
          user: { id: res.data.user.id },
          room: { roomId: res.data.room.roomId },
          checkIn: res.data.checkIn,
          checkOut: res.data.checkOut,
        });
      })
      .catch(() => setErrors(prev => ({ ...prev, general: "Failed to load reservation" })))
      .finally(() => setLoading(false));
  }, [reservationId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "userId") setReservation(prev => ({ ...prev, user: { id: value } }));
    else if (name === "roomId") setReservation(prev => ({ ...prev, room: { roomId: value } }));
    else setReservation(prev => ({ ...prev, [name]: value }));

    // Clear field-specific error
    setErrors(prev => ({ ...prev, [name]: "" }));
  };

  // Validate fields
  const validate = () => {
    const newErrors = {};

    if (!reservation.user.id) newErrors.userId = "Customer is required";
    if (!reservation.room.roomId) newErrors.roomId = "Room is required";
    if (!reservation.checkIn) newErrors.checkIn = "Check-in date is required";
    if (!reservation.checkOut) newErrors.checkOut = "Check-out date is required";
    if (reservation.checkIn && reservation.checkOut && reservation.checkOut <= reservation.checkIn) {
      newErrors.checkOut = "Check-out must be after check-in";
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setSubmitting(true);
    setErrors({});

    const payload = {
      user: { id: Number(reservation.user.id) },
      room: { roomId: Number(reservation.room.roomId) },
      checkIn: reservation.checkIn,
      checkOut: reservation.checkOut,
    };

    try {
      if (reservationId) {
        await api.put(`/reservations/${reservationId}`, payload);
        alert("✅ Reservation Updated Successfully");
      } else {
        await api.post("/reservations", payload);
        alert("✅ Reservation Added Successfully");
      }
      onSuccess?.();
      setReservation({ user: { id: "" }, room: { roomId: "" }, checkIn: "", checkOut: "" });
    } catch (err) {
      setErrors({ general: err.response?.data?.message || "Reservation failed" });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <p className="loading-text">Loading...</p>;

  return (
    <div className="form-container">
      <h3 style={{ textAlign: "center", marginBottom: "20px" }}>
        {reservationId ? "Update Reservation" : "Add Reservation"}
      </h3>

      {errors.general && <p className="error-text">{errors.general}</p>}

      <form onSubmit={handleSubmit}>
        <div className="formGroup">
          <label>Customer</label>
          <select name="userId" value={reservation.user.id} onChange={handleChange}>
            <option value="">Select Customer</option>
            {users.map(u => <option key={u.id} value={u.id}>{u.username}</option>)}
          </select>
          {errors.userId && <p className="error-text">{errors.userId}</p>}
        </div>

        <div className="formGroup">
          <label>Room</label>
          <select name="roomId" value={reservation.room.roomId} onChange={handleChange}>
            <option value="">Select Room</option>
            {rooms.map(r => (
              <option key={r.roomId} value={r.roomId}>
                {r.roomType} - ₹{r.pricePerNight} ({r.status})
              </option>
            ))}
          </select>
          {errors.roomId && <p className="error-text">{errors.roomId}</p>}
        </div>

        <div className="formGroup">
          <label>Check-In</label>
          <input
            type="date"
            name="checkIn"
            value={reservation.checkIn}
            onChange={handleChange}
            min={today}
          />
          {errors.checkIn && <p className="error-text">{errors.checkIn}</p>}
        </div>

        <div className="formGroup">
          <label>Check-Out</label>
          <input
            type="date"
            name="checkOut"
            value={reservation.checkOut}
            onChange={handleChange}
            min={reservation.checkIn || today}
          />
          {errors.checkOut && <p className="error-text">{errors.checkOut}</p>}
        </div>

        <button type="submit" className="submitBtn" disabled={submitting}>
          {submitting ? "Processing..." : reservationId ? "Update Reservation" : "Add Reservation"}
        </button>
      </form>
    </div>
  );
};

export default ReservationForm;
