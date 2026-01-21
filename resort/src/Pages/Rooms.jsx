import { useEffect, useState } from "react";
import api from "../api/api";
import "./theme.css";

function Rooms() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this room?")) return;
    try {
      await api.delete(`/rooms/${id}`);
      setRooms(rooms.filter((room) => room.roomId !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete room.");
    }
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Room Management 🏨</h1>
      </header>

      {loading && <p>Loading rooms...</p>}
      {error && <p className="error-text">{error}</p>}

      <div className="stats-grid">
        {rooms.map((room) => (
          <div key={room.roomId} className="stat-card">
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
            <p>
              <strong>Status:</strong>{" "}
              <span
                style={{
                  color:
                    room.status.toLowerCase() === "available"
                      ? "green"
                      : "red",
                  fontWeight: "bold",
                }}
              >
                {room.status}
              </span>
            </p>
            <button
              className="delete-btn"
              onClick={() => handleDelete(room.roomId)}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Rooms;
