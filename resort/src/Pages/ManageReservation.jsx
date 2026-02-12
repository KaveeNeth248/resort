import React, { useEffect, useState } from "react";
import api from "../api/api";
import jsPDF from "jspdf";
import "./theme.css";

const ManageReservation = () => {
  const [reservations, setReservations] = useState([]);
  const [successMsg, setSuccessMsg] = useState("");

  const fetchReservations = async () => {
    try {
      const res = await api.get("/reservations");
      setReservations(res.data);
    } catch (err) {
      console.error("Error fetching reservations", err);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  const handleStatus = async (id, status) => {
    try {
      await api.patch(`/reservations/${id}/status?status=${status}`);
      setSuccessMsg(`Reservation ${status} successfully!`);
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

    // Background image
    try {
      const bgBase64 = await getBase64ImageFromUrl(
        "https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg?cs=srgb&dl=pexels-pixabay-258154.jpg&fm=jpg"
      );
      doc.addImage(bgBase64, "JPEG", 0, 0, 210, 297);
    } catch (err) {
      console.error("Background load failed", err);
    }

    // Glass-style card overlay
    doc.setFillColor(255, 255, 255, 0.06);
    doc.setDrawColor(255, 255, 255, 0.14);
    doc.roundedRect(15, 25, 180, 247, 22, 22, "FD");

    // Logo
    try {
      const logoBase64 = await getBase64ImageFromUrl(
        "https://www.bing.com/th/id/OIG1.1NOl9hAY_HzmKy2eK7xu?w=286&h=286&c=6&r=0&o=5&dpr=1.3&pid=ImgGn"
      );
      doc.addImage(logoBase64, "PNG", 85, 35, 40, 40);
    } catch (err) {
      console.error("Logo load failed", err);
    }

    // Title
    doc.setFontSize(22);
    doc.setTextColor(224, 184, 74);
    doc.text("Ocean View Resort", 105, 85, { align: "center" });

    doc.setFontSize(14);
    doc.setTextColor(201, 161, 255);
    doc.text("Reservation Bill", 105, 95, { align: "center" });

    // Reservation details
    const details = [
      ["Reservation ID", reservation.reservationId],
      ["Guest Name", reservation.user?.fullName || reservation.user?.username || "N/A"],
      ["Room Type", reservation.room.roomType],
      ["Check-In", reservation.checkIn],
      ["Check-Out", reservation.checkOut],
      ["Total Bill", `Rs.${reservation.totalBill?.toFixed(2)}`],
      ["Status", reservation.status],
      ["Address", reservation.user?.address || "N/A"],
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

    // APPROVED Seal
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

    // Footer
    doc.setFontSize(11);
    doc.setTextColor(180, 180, 180);
    doc.text("Thank you for choosing Ocean View Resort!", 105, 280, { align: "center" });

    // Open PDF in new window and trigger print dialog
    const pdfBlob = doc.output("blob");
    const pdfUrl = URL.createObjectURL(pdfBlob);

    const printWindow = window.open(pdfUrl);
    printWindow.onload = function () {
      printWindow.focus();
      printWindow.print(); // opens print dialog
    };
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Manage Reservations</h1>
        <p style={{ color: "var(--muted)" }}>
          Staff Panel – Approve or Reject Pending Reservations
        </p>
      </div>

      {successMsg && (
        <div
          className="success-msg"
          style={{ textAlign: "center", marginBottom: "20px", cursor: "pointer" }}
          onClick={() => setSuccessMsg("")}
        >
          {successMsg}
        </div>
      )}

      <div className="stats-grid">
        {reservations.map((r) => (
          <div key={r.reservationId} className="stat-card room-card">
            
            {/* Room Image */}
            <img
              src={r.room?.imageUrl || "https://via.placeholder.com/400x250"}
              alt={r.room?.roomType}
            />

            <div className="reservation-info">
              <h3 style={{ marginBottom: "10px", color: "var(--accent)" }}>
                Reservation #{r.reservationId}
              </h3>

              <p><strong>Guest:</strong> {r.user?.fullName || r.user?.username}</p>
              <p><strong>Room:</strong> {r.room?.roomType}</p>
              <p><strong>Check-In:</strong> {r.checkIn}</p>
              <p><strong>Check-Out:</strong> {r.checkOut}</p>
              <p><strong>Total:</strong> Rs.{r.totalBill?.toFixed(2)}</p>
              <p>
                <strong>Status:</strong>{" "}
                <span
                  style={{
                    color:
                      r.status === "APPROVED"
                        ? "#2ecc71"
                        : r.status === "REJECTED"
                        ? "#e74c3c"
                        : "#f1c40f",
                    fontWeight: "bold",
                  }}
                >
                  {r.status}
                </span>
              </p>
            </div>

            <div className="reservation-actions">
              {r.status === "PENDING" && (
                <>
                  <button
                    className="add-btn"
                    onClick={() => handleStatus(r.reservationId, "APPROVED")}
                  >
                    Approve
                  </button>

                  <button
                    className="delete-btn"
                    onClick={() => handleStatus(r.reservationId, "REJECTED")}
                  >
                    Reject
                  </button>
                </>
              )}

              {r.status === "APPROVED" && (
                <button
                  className="edit-btn"
                  onClick={() => handlePDF(r)}
                >
                  Print PDF
                </button>
              )}
            </div>

          </div>
        ))}
      </div>
    </div>
  );
};

export default ManageReservation;
