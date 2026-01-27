import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import "./theme.css";

function ViewRooms() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const res = await api.get("/rooms");
        setRooms(res.data);
      } catch (err) {
        console.error("Error loading rooms", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, []);

  return (
    <div className="dashboard-container">
      <h2 style={{ margin: "30px 0", color: "var(--accent)" }}>
        🏨 Rooms
      </h2>

      {loading ? (
        <p className="loading-text">Loading rooms...</p>
      ) : (
        <div className="stats-grid">
          {rooms.map((room) => (
            <div className="stat-card" key={room.roomId}>
              <img
                src={room.imageUrl}
                alt="room"
                style={{ width: "100%", height: "160px", objectFit: "cover" }}
              />

              <p><strong>Room Type:</strong> {room.roomType}</p>
              <p><strong>Price / Night:</strong> ₹ {room.pricePerNight}</p>
              <p><strong>Status:</strong> {room.status}</p>
              <p><strong>Description:</strong> {room.description}</p>

              {/* ✅ STATUS CHECK */}
              {room.status === "AVAILABLE" ? (
                <button
                  className="add-btn"
                  onClick={() =>
                    navigate(`/reservations/add/${room.roomId}`)
                  }
                >
                  Add Reservation
                </button>
              ) : (
                <button className="add-btn" disabled>
                  Not Available
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ViewRooms;
