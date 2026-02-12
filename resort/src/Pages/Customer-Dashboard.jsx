import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/api";
import jsPDF from "jspdf";
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

  // ===== LOGOUT WITH CONFIRMATION =====
  const handleLogout = () => {
    const confirmLogout = window.confirm("Are you sure you want to exit?");
    if (confirmLogout) {
      localStorage.removeItem("user");
      navigate("/"); // Redirect to home page
    }
    // If Cancel, do nothing
  };

  // ===== DELETE RESERVATION =====
  const handleDeleteReservation = async (reservationId) => {
    if (!window.confirm("Are you sure you want to delete this reservation?"))
      return;

    try {
      await api.delete(`/reservations/${reservationId}`);
      setReservations((prev) =>
        prev.filter((r) => r.reservationId !== reservationId)
      );
    } catch (err) {
      console.error(err);
      alert("Failed to delete reservation");
    }
  };

  // ===== PDF FUNCTION =====
  const handlePDF = async (reservation) => {
    const doc = new jsPDF("p", "mm", "a4");

    const getBase64ImageFromUrl = async (url) => {
      const res = await fetch(url);
      const blob = await res.blob();
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(blob);
      });
    };

    try {
      const bgBase64 = await getBase64ImageFromUrl(
        "https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg?cs=srgb&dl=pexels-pixabay-258154.jpg&fm=jpg"
      );
      doc.addImage(bgBase64, "JPEG", 0, 0, 210, 297);
    } catch (err) {
      console.error("Background load failed", err);
    }

    doc.setFillColor(255, 255, 255, 0.06);
    doc.setDrawColor(255, 255, 255, 0.14);
    doc.roundedRect(15, 25, 180, 247, 22, 22, "FD");

    try {
      const logoBase64 = await getBase64ImageFromUrl(
        "https://www.bing.com/th/id/OIG1.1NOl9hAY_HzmKy2eK7xu?w=286&h=286&c=6&r=0&o=5&dpr=1.3&pid=ImgGn"
      );
      doc.addImage(logoBase64, "PNG", 85, 35, 40, 40);
    } catch (err) {
      console.error("Logo load failed", err);
    }

    doc.setFontSize(22);
    doc.setTextColor(224, 184, 74);
    doc.text("Ocean View Resort", 105, 85, { align: "center" });

    doc.setFontSize(14);
    doc.setTextColor(201, 161, 255);
    doc.text("Reservation Bill", 105, 95, { align: "center" });

    const details = [
      ["Reservation ID", reservation.reservationId],
      ["Guest Name", user?.fullName || user?.username || "N/A"],
      ["Room Type", reservation.room?.roomType],
      ["Check-In", reservation.checkIn],
      ["Check-Out", reservation.checkOut],
      ["Total Bill", `Rs. ${Number(reservation.totalBill).toFixed(2)}`],
      ["Status", reservation.status],
    ];

    let y = 115;
    details.forEach(([label, value]) => {
      doc.setFontSize(12);
      doc.setTextColor(242, 242, 242);
      doc.text(`${label}:`, 25, y);
      doc.setTextColor(180, 180, 180);
      doc.text(`${value}`, 80, y);
      y += 14;
    });

    if (reservation.status === "APPROVED") {
      try {
        const sealBase64 = await getBase64ImageFromUrl(
          "https://static.vecteezy.com/system/resources/previews/027/570/215/original/approved-rubber-stamp-approved-icon-seal-of-approval-tested-and-verified-badge-with-check-mark-accepted-sign-authorized-badge-design-with-grunge-texture-illustration-vector.jpg"
        );
        doc.addImage(sealBase64, "JPEG", 140, 180, 50, 50);
      } catch (err) {
        console.error("Seal load failed", err);
      }
    }

    doc.setFontSize(11);
    doc.setTextColor(180, 180, 180);
    doc.text("Thank you for choosing Ocean View Resort!", 105, 280, {
      align: "center",
    });

    doc.save(`Reservation_${reservation.reservationId}.pdf`);
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
            backgroundImage:
              "url('https://static.vecteezy.com/system/resources/previews/044/637/644/large_2x/modern-hotel-facade-illuminated-at-dusk-with-warm-lighting-landscaping-and-clear-skies-suitable-for-business-travel-and-tourism-concepts-photo.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <p>View Rooms</p>
          <h2>🔍</h2>
        </Link>
      </div>

      {/* UPDATE CUSTOMER DETAILS */}
      {user && (
        <Link
          to={`/updateCustomer/${user.id}`}
          className="stat-card green"
          style={{
            textDecoration: "none",
            color: "white",
            backgroundImage:
              "url('https://images.pexels.com/photos/3184295/pexels-photo-3184295.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <p>Your Details</p>
          <h2>📝</h2>
        </Link>
      )}

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

                <p>
                  <strong>Reservation ID:</strong> {r.reservationId}
                </p>
                <p>
                  <strong>Room Type:</strong> {r.room?.roomType}
                </p>
                <p>
                  <strong>Price Per Night:</strong> Rs. {r.room?.pricePerNight}
                </p>
                <p>
                  <strong>Check-In:</strong> {r.checkIn}
                </p>
                <p>
                  <strong>Check-Out:</strong> {r.checkOut}
                </p>
                <p>
                  <strong>Total Bill:</strong> Rs. {r.totalBill}
                </p>
                <p>
                  <strong>Status:</strong> {r.status}
                </p>

                {/* PDF BUTTON ONLY IF APPROVED */}
                {r.status === "APPROVED" && (
                  <button
                    className="add-btn"
                    style={{ marginTop: "10px" }}
                    onClick={() => handlePDF(r)}
                  >
                    PDF
                  </button>
                )}

                {/* DELETE BUTTON (ADDED) */}
                {r.status !== "APPROVED" && (
                  <button
                    className="add-btn"
                    style={{
                      marginTop: "10px",
                      backgroundColor: "#e74c3c",
                    }}
                    onClick={() => handleDeleteReservation(r.reservationId)}
                  >
                    🗑 Delete
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default CustomerDashboard;
