import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/api";
import "./theme.css";

function MakeReservation() {
  const { roomId } = useParams();
  const navigate = useNavigate();

  const [room, setRoom] = useState(null);
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const res = await api.get(`/rooms/${roomId}`);
        setRoom(res.data);
      } catch (err) {
        console.error("Failed to fetch room", err);
      }
    };

    fetchRoom();
  }, [roomId]);

  const bookReservation = async () => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!checkIn || !checkOut) {
      alert("Please select check-in and check-out dates");
      return;
    }

    try {
      await api.post("/reservations", {
        user: { id: user.id },
        room: { roomId: room.roomId },
        checkIn,
        checkOut
      });

      alert("Reservation booked successfully!");
      navigate("/customer-dashboard");
    } catch (err) {
      console.error(err);
      alert("Booking failed");
    }
  };

  return (
    <div className="dashboard-container">
      <h2 style={{ margin: "30px 0", color: "var(--accent)" }}>
        📅 Book Reservation
      </h2>

      {room && (
        <div className="stat-card">
          <img
            src={room.imageUrl}
            alt="room"
            style={{ width: "100%", height: "200px", objectFit: "cover" }}
          />

          <p><strong>Room Type:</strong> {room.roomType}</p>
          <p><strong>Price / Night:</strong> ₹ {room.pricePerNight}</p>
          <p><strong>Description:</strong> {room.description}</p>

          <div className="form-group">
            <label>Check-In</label>
            <input
              type="date"
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Check-Out</label>
            <input
              type="date"
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
            />
          </div>

          <button className="add-btn" onClick={bookReservation}>
            Confirm Booking
          </button>
        </div>
      )}
    </div>
  );
}

export default MakeReservation;
