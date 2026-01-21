import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/api";
import "./theme.css";

function Dashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const navigate = useNavigate();

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

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <div className="dashboard-container">
      {/* Header */}
      <header className="dashboard-header">
        <h1>Welcome Back 👋</h1>
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </header>

      {/* Stats */}
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

          <div className="stat-card purple">
            <p>Revenue</p>
            <h2>₹ {dashboardData.revenue}</h2>
          </div>
        </div>
      )}

      {/* Admin Operations */}
      <h2 style={{ margin: "30px 0 15px 0", color: "var(--accent)" }}>
        🛠 Admin Operations
      </h2>
      <div className="stats-grid">
        {/* Add/Update Room */}
        <Link
          to="/rooms/add"
          className="stat-card blue"
          style={{
            textDecoration: "none",
            color: "white",
            backgroundImage:
              "url('https://th.bing.com/th/id/R.a1651abc706f064d27495aedbbff78f7?rik=6g5nmzf96tWZ%2bw&riu=http%3a%2f%2fwww.ankurlighting.com%2fcdn%2fshop%2farticles%2fwhat-is-the-best-lighting-for-a-dark-room-ankur-lighting.jpg%3fv%3d1695131066%26width%3d2048&ehk=HfBxIADIMuDcra1sw7FbqGIdeyr35mlElxxUAf0s%2bPA%3d&risl=&pid=ImgRaw&r=0')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <p>Add / Update Room</p>
          <h2>🏨</h2>
        </Link>

        {/* Add/Update Reservation */}
        <Link
          to="/reservations/add"
          className="stat-card green"
          style={{
            textDecoration: "none",
            color: "white",
            backgroundImage:
              "url('https://images.unsplash.com/photo-1576675787175-0c74d9978287?auto=format&fit=crop&w=600&q=60')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <p>Add / Update Reservation</p>
          <h2>📅</h2>
        </Link>

        {/* View All Rooms */}
        <Link
          to="/rooms"
          className="stat-card orange"
          style={{
            textDecoration: "none",
            color: "white",
            backgroundImage:
              "url('https://images.unsplash.com/photo-1560347876-aeef00ee58a1?auto=format&fit=crop&w=600&q=60')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <p>View All Rooms</p>
          <h2>🔍</h2>
        </Link>

        {/* View All Reservations */}
        <Link
          to="/reservations"
          className="stat-card purple"
          style={{
            textDecoration: "none",
            color: "white",
            backgroundImage:
              "url('https://tse4.mm.bing.net/th/id/OIP.ZJ6hCfKGMfcE5QIrvmzhhQHaE8?rs=1&pid=ImgDetMain&o=7&rm=3')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <p>View All Reservations</p>
          <h2>📋</h2>
        </Link>
      </div>

      {/* Navigation */}
      <div className="nav-links">
        <Link to="/help">❓ Help</Link>
      </div>
    </div>
  );
}

export default Dashboard;
