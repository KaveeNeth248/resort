import { useEffect, useState } from "react";
import api from "../api/api";
import "./theme.css";

function ViewRooms() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  const [activeRoomId, setActiveRoomId] = useState(null);
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [total, setTotal] = useState(0);

  const user = JSON.parse(localStorage.getItem("user"));
  const today = new Date().toISOString().split("T")[0];

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

  // Auto calculate total
  useEffect(() => {
    if (!checkIn || !checkOut || !activeRoomId) return;

    const room = rooms.find((r) => r.roomId === activeRoomId);
    if (!room) return;

    const nights =
      (new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24);

    setTotal(nights > 0 ? nights * room.pricePerNight : 0);
  }, [checkIn, checkOut, activeRoomId, rooms]);

  // Create reservation
  const handleReservation = async (room) => {
    try {
      await api.post("/reservations", {
        user: { id: user.id },
        room: { roomId: room.roomId },
        checkIn,
        checkOut,
      });

      alert("Reservation added successfully!");

      setActiveRoomId(null);
      setCheckIn("");
      setCheckOut("");
      setTotal(0);

      // Refresh rooms
      const res = await api.get("/rooms");
      setRooms(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to add reservation");
    }
  };

  return (
    <div className="dashboard-container">
      <h2 style={{ margin: "30px 0", color: "var(--accent)" }}>🏨 Rooms</h2>

      {loading ? (
        <p className="loading-text">Loading rooms...</p>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: "20px",
          }}
        >
          {rooms.map((room) => (
            <div
              key={room.roomId}
              style={{
                backgroundColor: "#1e1e2f",
                borderRadius: "12px",
                boxShadow: "0 2px 10px rgba(0,0,0,0.5)",
                padding: "15px",
                color: "#eee",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                minHeight: "480px",
              }}
            >
              <img
                src={room.imageUrl}
                alt="room"
                style={{
                  width: "100%",
                  height: "180px",
                  objectFit: "cover",
                  borderRadius: "12px",
                  marginBottom: "12px",
                }}
              />

              <div style={{ flexGrow: 1, overflowY: "auto" }}>
                <p>
                  <strong>Room Type:</strong> {room.roomType}
                </p>
                <p>
                  <strong>Price / Night:</strong> ₹ {room.pricePerNight}
                </p>
                <p>
                  <strong>Status:</strong> {room.status}
                </p>
                <p style={{ whiteSpace: "pre-line", fontSize: "0.9rem" }}>
                  <strong>Description:</strong> {room.description}
                </p>
              </div>

              {/* Add Reservation Button */}
              {room.status === "AVAILABLE" && !activeRoomId && (
                <button
                  className="add-btn"
                  style={{
                    marginTop: "15px",
                    background: "#f0c14b",
                    color: "#1a1a1a",
                    fontWeight: "600",
                    borderRadius: "6px",
                    cursor: "pointer",
                    padding: "10px",
                    border: "none",
                    boxShadow: "0 2px 5px rgba(0,0,0,0.15)",
                    transition: "background-color 0.3s",
                  }}
                  onClick={() => setActiveRoomId(room.roomId)}
                  onMouseOver={(e) => (e.currentTarget.style.background = "#ddb347")}
                  onMouseOut={(e) => (e.currentTarget.style.background = "#f0c14b")}
                >
                  Add Reservation
                </button>
              )}

              {/* Not Available Button */}
              {room.status !== "AVAILABLE" && (
                <button
                  className="add-btn"
                  disabled
                  style={{
                    marginTop: "15px",
                    background: "#f0c14b",
                    color: "#1a1a1a",
                    fontWeight: "600",
                    borderRadius: "6px",
                    cursor: "not-allowed",
                    padding: "10px",
                    border: "none",
                    opacity: 0.7,
                  }}
                >
                  Not Available
                </button>
              )}

              {/* Inline Add Reservation Form */}
              {activeRoomId === room.roomId && (
                <div
                  style={{
                    marginTop: "15px",
                    padding: "15px",
                    backgroundColor: "rgba(255 255 255 / 0.1)",
                    borderRadius: "8px",
                    color: "#fff",
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px",
                  }}
                >
                  <label htmlFor={`checkin-${room.roomId}`}>Check-In</label>
                  <input
                    id={`checkin-${room.roomId}`}
                    type="date"
                    value={checkIn}
                    min={today}
                    onChange={(e) => setCheckIn(e.target.value)}
                    style={{
                      padding: "6px",
                      borderRadius: "4px",
                      border: "none",
                      outline: "none",
                    }}
                  />

                  <label htmlFor={`checkout-${room.roomId}`}>Check-Out</label>
                  <input
                    id={`checkout-${room.roomId}`}
                    type="date"
                    value={checkOut}
                    min={checkIn || today}
                    onChange={(e) => setCheckOut(e.target.value)}
                    style={{
                      padding: "6px",
                      borderRadius: "4px",
                      border: "none",
                      outline: "none",
                    }}
                  />

                  <p>
                    <strong>Total: </strong>₹ {total}
                  </p>

                  <button
                    className="add-btn"
                    disabled={!checkIn || !checkOut || total <= 0}
                    style={{
                      backgroundColor: "#f0c14b",
                      color: "#1a1a1a",
                      fontWeight: "600",
                      borderRadius: "6px",
                      cursor: !checkIn || !checkOut || total <= 0 ? "not-allowed" : "pointer",
                      padding: "10px",
                      border: "none",
                      boxShadow: "0 2px 5px rgba(0,0,0,0.15)",
                      transition: "background-color 0.3s",
                    }}
                    onClick={() => handleReservation(room)}
                    onMouseOver={(e) =>
                      (!checkIn || !checkOut || total <= 0
                        ? null
                        : (e.currentTarget.style.backgroundColor = "#ddb347"))
                    }
                    onMouseOut={(e) =>
                      (!checkIn || !checkOut || total <= 0
                        ? null
                        : (e.currentTarget.style.backgroundColor = "#f0c14b"))
                    }
                  >
                    Confirm Reservation
                  </button>

                  <button
                    className="add-btn"
                    style={{
                      marginTop: "6px",
                      backgroundColor: "#f0c14b",
                      color: "#1a1a1a",
                      fontWeight: "600",
                      borderRadius: "6px",
                      cursor: "pointer",
                      padding: "10px",
                      border: "none",
                      boxShadow: "0 2px 5px rgba(0,0,0,0.15)",
                    }}
                    onClick={() => setActiveRoomId(null)}
                    onMouseOver={(e) =>
                      (e.currentTarget.style.backgroundColor = "#ddb347")
                    }
                    onMouseOut={(e) =>
                      (e.currentTarget.style.backgroundColor = "#f0c14b")
                    }
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ViewRooms;
