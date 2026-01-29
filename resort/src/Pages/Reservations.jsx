import React, { useState, useEffect } from "react";
import api from "../api/api";
import jsPDF from "jspdf";
import ReservationForm from "./ReservationForm";
import "./theme.css";

const Reservation = () => {
  const [reservations, setReservations] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  // Fetch all reservations
  const fetchReservations = async () => {
    try {
      const res = await api.get("/reservations");
      setReservations(res.data);
    } catch (err) {
      console.error("Error loading reservations", err);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  // Delete reservation
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this reservation?")) {
      try {
        await api.delete(`/reservations/${id}`);
        setSuccessMsg("Reservation deleted successfully!");
        fetchReservations();
      } catch (err) {
        console.error(err);
      }
    }
  };

  // Approve / Reject
  const handleStatus = async (id, status) => {
    try {
      await api.patch(`/reservations/${id}/status?status=${status}`);
      setSuccessMsg(`Reservation ${status.toLowerCase()} successfully!`);
      fetchReservations();
    } catch (err) {
      console.error(err);
    }
  };

  const handlePDF = async (reservation) => {
  const doc = new jsPDF("p", "mm", "a4");

  // Helper: convert image URL to Base64
  const getBase64ImageFromUrl = async (url) => {
    const res = await fetch(url);
    const blob = await res.blob();
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.readAsDataURL(blob);
    });
  };

  // Background image (converted to Base64 first)
  try {
    const bgBase64 = await getBase64ImageFromUrl(
      "https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg?cs=srgb&dl=pexels-pixabay-258154.jpg&fm=jpg"
    );
    doc.addImage(bgBase64, "JPEG", 0, 0, 210, 297); // full-page background
  } catch (err) {
    console.error("Background load failed", err);
  }

  // Glass-style card overlay
  doc.setFillColor(255, 255, 255, 0.06);
  doc.setDrawColor(255, 255, 255, 0.14);
  doc.roundedRect(15, 25, 180, 247, 22, 22, "FD");

  // Logo image
  try {
    const logoBase64 = await getBase64ImageFromUrl(
      "https://www.bing.com/th/id/OIG1.1NOl9hAY_HzmKy2eK7xu?w=286&h=286&c=6&r=0&o=5&dpr=1.3&pid=ImgGn"
    );
    doc.addImage(logoBase64, "PNG", 85, 35, 40, 40); // centered logo
  } catch (err) {
    console.error("Logo load failed", err);
  }

  // Title
  doc.setFontSize(22);
  doc.setTextColor(224, 184, 74); // gold accent
  doc.text("Ocean View Resort", 105, 85, { align: "center" });

  doc.setFontSize(14);
  doc.setTextColor(201, 161, 255); // purple accent
  doc.text("Reservation Bill", 105, 95, { align: "center" });

  // Reservation details
  const details = [
    ["Reservation ID", reservation.reservationId],
    ["Guest Name", reservation.user?.fullName || reservation.user?.username || "N/A"],
    ["Room Type", reservation.room.roomType],
    ["Check-In", reservation.checkIn],
    ["Check-Out", reservation.checkOut],
    ["Total Bill", `$${reservation.totalBill.toFixed(2)}`],
    ["Status", reservation.status],
    ["Address", reservation.user?.address || "N/A"],
  ];

  let y = 115;
  details.forEach(([label, value]) => {
    doc.setFontSize(12);
    doc.setTextColor(242, 242, 242); // var(--text)
    doc.text(`${label}:`, 25, y);
    doc.setTextColor(180, 180, 180); // var(--muted)
    doc.text(`${value}`, 80, y);
    y += 14;
  });

  // APPROVED Seal (unchanged)
  if (reservation.status === "APPROVED") {
    try {
      const sealBase64 = await getBase64ImageFromUrl(
        "https://static.vecteezy.com/system/resources/previews/027/570/215/original/approved-rubber-stamp-approved-icon-seal-of-approval-tested-and-verified-badge-with-check-mark-accepted-sign-authorized-badge-design-with-grunge-texture-illustration-vector.jpg"
      );
      doc.addImage(sealBase64, "JPEG", 140, 180, 50, 50); // bottom-right placement
    } catch (err) {
      console.error("Seal load failed", err);
    }
  }

  // Footer
  doc.setFontSize(11);
  doc.setTextColor(180, 180, 180);
  doc.text("Thank you for choosing Ocean View Resort!", 105, 280, { align: "center" });

  doc.save(`Reservation_${reservation.reservationId}.pdf`);
};
  return (
    <div className="dashboard-container">
      <h2 className="dashboard-header" style={{ textAlign: "center" }}>
        Reservations
      </h2>

      {/* Success Message */}
      {successMsg && (
        <div className="success-msg" onClick={() => setSuccessMsg("")}>
          {successMsg} (click to close)
        </div>
      )}

      {/* Add / Edit Form */}
      {showForm && (
        <ReservationForm
          reservationId={editingId}
          onSuccess={() => {
            setShowForm(false);
            setEditingId(null);
            setSuccessMsg(
              editingId ? "Reservation updated successfully!" : "Reservation added successfully!"
            );
            fetchReservations();
          }}
        />
      )}

      <button
        className="add-btn"
        style={{ margin: "15px 0" }}
        onClick={() => {
          setEditingId(null);
          setShowForm(true);
        }}
      >
        + Add Reservation
      </button>

      <table
        border="1"
        cellPadding="5"
        style={{ marginTop: 20, width: "100%", borderCollapse: "collapse" }}
      >
        <thead style={{ background: "#ffb300", color: "#fff" }}>
          <tr>
            <th>ID</th>
            <th>User</th>
            <th>Room</th>
            <th>Check-In</th>
            <th>Check-Out</th>
            <th>Total Bill</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {reservations.map((r) => (
            <tr key={r.reservationId}>
              <td>{r.reservationId}</td>
              <td>{r.user?.name || r.user?.username}</td>
              <td>{r.room.roomType}</td>
              <td>{r.checkIn}</td>
              <td>{r.checkOut}</td>
              <td>Rs.{r.totalBill?.toFixed(2)}</td>
              <td>{r.status}</td>
              <td>
                <button
                  className="edit-btn"
                  onClick={() => {
                    setEditingId(r.reservationId);
                    setShowForm(true);
                  }}
                >
                  Update
                </button>
                <button
                  className="delete-btn"
                  onClick={() => handleDelete(r.reservationId)}
                >
                  Delete
                </button>
                {r.status === "PENDING" && (
                  <>
                    <button
                      className="approve-btn"
                      onClick={() => handleStatus(r.reservationId, "APPROVED")}
                    >
                      Approve
                    </button>
                    <button
                      className="reject-btn"
                      onClick={() => handleStatus(r.reservationId, "REJECTED")}
                    >
                      Reject
                    </button>
                  </>
                )}
                {r.status === "APPROVED" && (
                  <button className="add-btn" onClick={() => handlePDF(r)}>
                    PDF
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Reservation;