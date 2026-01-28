import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/api";
import "./theme.css";
import { Chart } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import "./theme.css";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function Dashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const [reservations, setReservations] = useState([]);
  const [loadingReservations, setLoadingReservations] = useState(true);
  const [reservationError, setReservationError] = useState("");
  const navigate = useNavigate();

  // Fetch dashboard stats
  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await api.get("/dashboard");
        setDashboardData(res.data);
      } catch (error) {
        console.error("Error fetching dashboard:", error);
      }
    };
    fetchDashboard();
  }, []);

  // Fetch reservations
  useEffect(() => {
    loadReservations();
  }, []);

  const loadReservations = async () => {
    try {
      const res = await api.get("/reservations");
      setReservations(res.data);
    } catch (err) {
      setReservationError("Failed to load reservations");
    } finally {
      setLoadingReservations(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await api.patch(`/reservations/${id}/status`, null, {
        params: { status },
      });
      loadReservations();
    } catch (err) {
      alert("Status update failed");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  // Prepare chart data
  const chartData = {
    labels: reservations.map((r) => r.checkIn),
    datasets: [
      {
        label: "Total Bill (₹)",
        data: reservations.map((r) => r.totalBill),
        backgroundColor: "rgba(75, 192, 192, 0.6)",
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: "Daily Reservations Progress" },
    },
  };

  const totalRevenue = reservations.reduce((acc, r) => acc + (r.totalBill || 0), 0);

  return (
    <div className="dashboard-container">
      {/* ---------- NAV BAR ---------- */}
      <nav className="dashboard-nav">
        <h1 className="nav-title">Welcome Back 👋</h1>
        <div className="nav-links">
          <Link to="/help/admin" className="nav-btn">❓ Help</Link>
          <button className="nav-btn" onClick={handleLogout}>Logout</button>
        </div>
      </nav>

      {/* ---------- DASHBOARD STATS ---------- */}
      {dashboardData && (
        <div className="stats-grid">
          <div className="stat-card blue">
            <p>Total Rooms</p>
            <h2>{dashboardData.totalRooms}</h2>
          </div>
          <div className="stat-card green">
            <p>Occupied</p>
            <h2>{dashboardData.occupiedRooms}</h2>
          </div>
          <div className="stat-card orange">
            <p>Available</p>
            <h2>{dashboardData.availableRooms}</h2>
          </div>
          <div className="stat-card yellow">
            <p>Booked</p>
            <h2>{dashboardData.bookedRooms}</h2>
          </div>
          <div className="stat-card red">
            <p>Maintenance</p>
            <h2>{dashboardData.maintenanceRooms}</h2>
          </div>
          <div className="stat-card purple">
            <p>Revenue</p>
            <h2>₹ {totalRevenue}</h2>
          </div>
        </div>
      )}

         {/* ---------- ADMIN OPERATIONS ---------- */}
<h2 style={{ margin: "30px 0 15px 0", color: "var(--accent)", textAlign: "center" }}>
  🛠 Admin Operations
</h2>

<div className="stats-grid">

  <Link
    to="/rooms/add"
    className="stat-card blue"
    style={{
      textDecoration: "none",
      backgroundImage:
        "url('https://th.bing.com/th/id/R.a1651abc706f064d27495aedbbff78f7?rik=6g5nmzf96tWZ%2bw&riu=http%3a%2f%2fwww.ankurlighting.com%2fcdn%2fshop%2farticles%2fwhat-is-the-best-lighting-for-a-dark-room-ankur-lighting.jpg%3fv%3d1695131066%26width%3d2048&ehk=HfBxIADIMuDcra1sw7FbqGIdeyr35mlElxxUAf0s%2bPA%3d&risl=&pid=ImgRaw&r=0')",
      backgroundSize: "cover",
      backgroundPosition: "center",
    }}
  >
    <p style={{ color: "white", fontWeight: "600", fontSize: "16px" }}>
      Add / Update Room
    </p>
    <h2>🏨</h2>
  </Link>

  <Link
    to="/reservations/add"
    className="stat-card green"
    style={{
      textDecoration: "none",
      backgroundImage:
        "url('https://tse4.mm.bing.net/th/id/OIP.ZJ6hCfKGMfcE5QIrvmzhhQHaE8?rs=1&pid=ImgDetMain&o=7&rm=3')",
      backgroundSize: "cover",
      backgroundPosition: "center",
    }}
  >
    <p style={{ color: "white", fontWeight: "600", fontSize: "16px" }}>
      Add / Update Reservation
    </p>
    <h2>📅</h2>
  </Link>

  <Link
    to="/rooms"
    className="stat-card orange"
    style={{
      textDecoration: "none",
      backgroundImage:
        "url('https://img.freepik.com/premium-photo/dark-hotel-room-with-clock-digital_1015255-180624.jpg')",
      backgroundSize: "cover",
      backgroundPosition: "center",
    }}
  >
    <p style={{ color: "white", fontWeight: "600", fontSize: "16px" }}>
      View All Rooms
    </p>
    <h2>🔍</h2>
  </Link>

  <Link
    to="/reservations"
    className="stat-card purple"
    style={{
      textDecoration: "none",
      backgroundImage:
        "url('https://tse2.mm.bing.net/th/id/OIP.Nso8gWI3PIQ0zxIj8Ji9IgHaJQ?rs=1&pid=ImgDetMain&o=7&rm=3')",
      backgroundSize: "cover",
      backgroundPosition: "center",
    }}
  >
    <p style={{ color: "white", fontWeight: "600", fontSize: "16px" }}>
      View All Reservations
    </p>
    <h2>📋</h2>
  </Link>

</div>

      {/* ---------- RESERVATION REPORT ---------- */}
      <h2 style={{ margin: "30px 0 15px 0", color: "var(--accent)", textAlign: "center" }}>
        📊 Reservation Report
      </h2>

      {loadingReservations ? (
        <p className="loading-text">Loading reservation report...</p>
      ) : reservationError ? (
        <p className="error-text">{reservationError}</p>
      ) : (
        <>
          <div className="stats-grid">
            {reservations.map((r) => (
              <div className="stat-card" key={r.reservationId}>
                <div className="reservation-info">
                  <p><strong>Reservation ID:</strong> {r.reservationId}</p>
                  <p><strong>Guest:</strong> {r.user?.name || "N/A"}</p>
                  <p><strong>Room No:</strong> {r.room?.roomNumber}</p>
                  <p><strong>Room Type:</strong> {r.room?.roomType}</p>
                  <p><strong>Check-In:</strong> {r.checkIn}</p>
                  <p><strong>Check-Out:</strong> {r.checkOut}</p>
                  <p><strong>Total Bill:</strong> ₹ {r.totalBill}</p>
                  <p>
                    <strong>Status:</strong>{" "}
                    <span
                      style={{
                        color:
                          r.status === "APPROVED"
                            ? "green"
                            : r.status === "REJECTED"
                            ? "#e74c3c"
                            : "#f39c12",
                        fontWeight: "bold",
                      }}
                    >
                      {r.status}
                    </span>
                  </p>
                </div>

                {r.status === "PENDING" && (
                  <div className="reservation-actions">
                    <button
                      className="add-btn"
                      onClick={() => updateStatus(r.reservationId, "APPROVED")}
                    >
                      Approve
                    </button>
                    <button
                      className="delete-btn"
                      onClick={() => updateStatus(r.reservationId, "REJECTED")}
                    >
                      Reject
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Chart for daily reservation progress */}
          {reservations.length > 0 && (
            <div style={{ marginTop: 40 }}>
              <Chart type="bar" data={chartData} options={chartOptions} />
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default Dashboard;