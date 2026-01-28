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
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

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

  // ---------- Reservation summary counts ----------
  const totalReservations = reservations.length;
  const approvedCount = reservations.filter(r => r.status === "APPROVED").length;
  const pendingCount = reservations.filter(r => r.status === "PENDING").length;
  const rejectedCount = reservations.filter(r => r.status === "REJECTED").length;
  const approvedRevenue = reservations
    .filter(r => r.status === "APPROVED")
    .reduce((sum, r) => sum + (r.totalBill || 0), 0);
  // --------------------------------------------------

  // Prepare chart data
  const chartData = {
    labels: reservations.map((r) => r.checkIn),
    datasets: [
      {
        label: "Total Bill (₹)",
        data: reservations.map((r) => r.totalBill),
        backgroundColor: "rgba(245, 178, 8, 0.83)",
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
              "url('https://img.freepik.com/premium-photo/luxurious-dramatic-bedroom-sense-glamour-opulence-with-palette-rich-saturated_947337-315.jpg')",
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
              "url('https://media.licdn.com/dms/image/D4D12AQEwjiIh5bMaNQ/article-cover_image-shrink_600_2000/0/1695267350942?e=2147483647&v=beta&t=gFfxDrJeRa1HKD4gxSfzlRrpxYkt1R0uI9hnlJQiJLg')",
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
              "url('https://images.squarespace-cdn.com/content/v1/63dde481bbabc6724d988548/bb5b7db2-8f43-46c5-88a9-7bbbd52a8304/6.jpg?format=2500w')",
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
              "url('https://tse1.explicit.bing.net/th/id/OIP.hFJOw35LbeU_rK-S_ahRVwAAAA?rs=1&pid=ImgDetMain&o=7&rm=3')",
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
          {/* ---------- SUMMARY CARDS ONLY WITH IMAGES ---------- */}
<div className="stats-grid">

  <div
    className="stat-card blue"
    style={{
      backgroundImage: "url('https://i.pinimg.com/736x/21/e1/f4/21e1f48bd2665ae0107a02b2342cf3ba.jpg')",
      backgroundSize: "cover",
      backgroundPosition: "center",
      color: "white"
    }}
  >
    <p>Total Reservations</p>
    <h2>{totalReservations}</h2>
  </div>

  <div
    className="stat-card green"
    style={{
      backgroundImage: "url('https://cdn.pixabay.com/photo/2024/10/11/04/32/reserved-9112145_1280.jpg')",
      backgroundSize: "cover",
      backgroundPosition: "center",
      color: "white"
    }}
  >
    <p>Approved</p>
    <h2>{approvedCount}</h2>
  </div>

  <div
    className="stat-card orange"
    style={{
      backgroundImage: "url('https://img.freepik.com/premium-photo/master-bedroom-flat-design-front-view-luxury-theme-animation-vivid_1317319-22872.jpg')",
      backgroundSize: "cover",
      backgroundPosition: "center",
      color: "white"
    }}
  >
    <p>Pending</p>
    <h2>{pendingCount}</h2>
  </div>

  <div
    className="stat-card red"
    style={{
      backgroundImage: "url('https://images.squarespace-cdn.com/content/v1/63dde481bbabc6724d988548/0317e89d-7066-41ee-9aeb-de24a908e881/7.jpeg?format=1000w')",
      backgroundSize: "cover",
      backgroundPosition: "center",
      color: "white"
    }}
  >
    <p>Rejected</p>
    <h2>{rejectedCount}</h2>
  </div>

  <div
    className="stat-card purple"
    style={{
      backgroundImage: "url('https://r2imghtlak.mmtcdn.com/r2-mmt-htl-image/flyfish/raw/NH24052303022324/QS1042/QS1042-Q1/1708692038960.jpeg')",
      backgroundSize: "cover",
      backgroundPosition: "center",
      color: "white"
    }}
  >
    <p>Approved Revenue</p>
    <h2>₹ {approvedRevenue}</h2>
  </div>

</div>

          {/* ---------- CHART ---------- */}
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
