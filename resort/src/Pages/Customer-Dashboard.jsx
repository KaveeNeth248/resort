import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/api";
import "./theme.css";

function CustomerDashboard() {
  const [user, setUser] = useState(null);
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loggedUser = JSON.parse(localStorage.getItem("user"));

    if (!loggedUser) {
      navigate("/");
      return;
    }

    setUser(loggedUser);
    fetchMyReservations(loggedUser.id);
  }, []);

  const fetchMyReservations = async (userId) => {
    try {
      const res = await api.get(`/reservations/user/${userId}`);
      setReservations(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <div className="dashboard-container">
      {/* NAVBAR */}
      <nav className="dashboard-nav">
        <h1 className="nav-title">
          Welcome, {user?.username || "Customer"} 👋
        </h1>

        <div className="nav-links">
          <Link to="/help/customer" className="nav-btn">
            ❓ Help
          </Link>
          <button className="nav-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </nav>

      {/* CUSTOMER OPERATIONS */}
      <h2 style={{ margin: "30px 0 15px 0", color: "var(--accent)" }}>
        🏨 Customer Operations
      </h2>

      <div className="stats-grid">
        <Link
          to="/rooms1"
          className="stat-card blue"
          style={{
            textDecoration: "none",
            color: "white",
            backgroundImage: "url('https://static.vecteezy.com/system/resources/previews/044/637/644/large_2x/modern-hotel-facade-illuminated-at-dusk-with-warm-lighting-landscaping-and-clear-skies-suitable-for-business-travel-and-tourism-concepts-photo.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <p>View Rooms</p>
          <h2>🔍</h2>
        </Link>

        {/* Book Reservation card removed */}
      </div>

      {/* MY RESERVATIONS */}
      <h2 style={{ margin: "30px 0 15px 0", color: "var(--accent)" }}>
        📋 My Reservations
      </h2>

      {loading ? (
        <p className="loading-text">Loading your reservations...</p>
      ) : (
        <div className="stats-grid">
          {reservations.length === 0 ? (
            <p>No reservations found</p>
          ) : (
            reservations.map((r) => (
              <div className="stat-card" key={r.reservationId}>
                {/* ROOM IMAGE */}
                <img
                  src={r.room?.imageUrl || "https://via.placeholder.com/200"}
                  alt={r.room?.roomType || "Room"}
                  style={{
                    width: "100%",
                    height: "160px",
                    objectFit: "cover",
                    marginBottom: "10px",
                    borderRadius: "5px",
                  }}
                />

                <p><strong>Reservation ID:</strong> {r.reservationId}</p>
                <p><strong>Room Type:</strong> {r.room?.roomType}</p>
                <p><strong>Price Per Night:</strong> ₹ {r.room?.pricePerNight}</p>
                <p><strong>Check-In:</strong> {r.checkIn}</p>
                <p><strong>Check-Out:</strong> {r.checkOut}</p>
                <p><strong>Total Bill:</strong> ₹ {r.totalBill}</p>
                <p><strong>Status:</strong> {r.status}</p>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default CustomerDashboard;
