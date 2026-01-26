import React, { useState, useEffect } from "react";
import api from "../api/api"; 
import jsPDF from "jspdf";
import ReservationForm from "./ReservationForm";

const Reservation = () => {
  const [reservations, setReservations] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const fetchReservations = () => {
    api.get("/reservations")
      .then(res => setReservations(res.data))
      .catch(err => console.error(err));
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this reservation?")) {
      api.delete(`/reservations/${id}`)
        .then(() => fetchReservations())
        .catch(err => console.error(err));
    }
  };
  const handlePDF = (reservation) => {
  const doc = new jsPDF("p", "mm", "a4");

  // Background image URL (hotel)
  const bgUrl = "https://wallpaperaccess.com/full/2690753.jpg";
  const img = new Image();
  img.crossOrigin = "anonymous";
  img.src = bgUrl;

  img.onload = () => {
    // Draw full-page background image
    doc.addImage(img, "JPEG", 0, 0, 210, 297);

    // Overlay semi-transparent dark layer for text readability
    doc.setFillColor(0, 0, 0, 0.6);
    doc.rect(0, 0, 210, 297, "F");

    // White card box - centered with shadow effect
    const cardX = 20;
    const cardY = 40;
    const cardWidth = 170;
    const cardHeight = 210;

    // White fill with subtle shadow (simulate shadow with gray border)
    doc.setFillColor("#ffffff");
    doc.setDrawColor("#d1c4a1"); // soft gold border
    doc.setLineWidth(1.5);
    doc.roundedRect(cardX, cardY, cardWidth, cardHeight, 10, 10, "FD");

    // Title - Ocean View Resort (gold color)
    doc.setFont("helvetica", "bold");
    doc.setFontSize(26);
    doc.setTextColor("#ffb300");
    doc.text("Ocean View Resort", cardX + cardWidth / 2, cardY + 25, { align: "center" });

    // Subtitle - Reservation Invoice (centered, muted gray)
    doc.setFont("helvetica", "normal");
    doc.setFontSize(16);
    doc.setTextColor("#555555");
    doc.text("Reservation Invoice", cardX + cardWidth / 2, cardY + 40, { align: "center" });

    // Separator line under subtitle
    doc.setDrawColor("#ffb300");
    doc.setLineWidth(0.7);
    doc.line(cardX + 20, cardY + 45, cardX + cardWidth - 20, cardY + 45);

    // Content details - left aligned with margin inside card
    doc.setFontSize(14);
    doc.setTextColor("#222222");
    const startTextX = cardX + 20;
    let currentY = cardY + 65;
    const lineSpacing = 12;

    const details = [
      `Reservation ID: ${reservation.reservationId}`,
      `Guest Name: ${reservation.user?.name || "N/A"}`,
      `Room Type: ${reservation.room.roomType}`,
      `Check-In: ${reservation.checkIn}`,
      `Check-Out: ${reservation.checkOut}`,
      `Total Bill: $${reservation.totalBill.toFixed(2)}`
    ];

    details.forEach(line => {
      doc.text(line, startTextX, currentY);
      currentY += lineSpacing;
    });

    // Status badge - rounded rectangle on bottom right inside card
    const status = reservation.status.toUpperCase();
    let statusColor = "#ffb300"; // default yellow for pending
    if (status === "APPROVED") statusColor = "#27ae60"; // green
    else if (status === "REJECTED") statusColor = "#e74c3c"; // red

    const badgeWidth = 60;
    const badgeHeight = 18;
    const badgeX = cardX + cardWidth - badgeWidth - 20;
    const badgeY = cardY + cardHeight - 45;

    doc.setFillColor(statusColor);
    doc.roundedRect(badgeX, badgeY, badgeWidth, badgeHeight, 5, 5, "F");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor("#ffffff");
    doc.text(status, badgeX + badgeWidth / 2, badgeY + badgeHeight / 2 + 4, { align: "center" });

    // Footer message centered below card
    doc.setFont("helvetica", "italic");
    doc.setFontSize(11);
    doc.setTextColor("#ffffff");
    doc.text(
      "Thank you for choosing Ocean View Resort. We look forward to welcoming you!",
      cardX + cardWidth / 2,
      cardY + cardHeight + 25,
      { align: "center" }
    );

    // Save PDF
    doc.save(`Reservation_${reservation.reservationId}.pdf`);
  };

  img.onerror = () => {
    console.error("Failed to load background image");
  };
};
  return (
    <div className="dashboard-container">
      <h2 className="dashboard-header">Reservations</h2>

      {editingId && (
        <ReservationForm
          reservationId={editingId}
          onSuccess={() => {
            setEditingId(null);
            fetchReservations();
          }}
        />
      )}

      <table border="1" cellPadding="5" style={{ marginTop: 20, width: "100%", borderCollapse: "collapse" }}>
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
          {reservations.map(r => (
            <tr key={r.reservationId}>
              <td>{r.reservationId}</td>
              <td>{r.user.name}</td>
              <td>{r.room.roomType}</td>
              <td>{r.checkIn}</td>
              <td>{r.checkOut}</td>
              <td>${r.totalBill}</td>
              <td>{r.status}</td>
              <td>
                <button className="edit-btn" onClick={() => setEditingId(r.reservationId)}>Update</button>
                <button className="delete-btn" onClick={() => handleDelete(r.reservationId)}>Delete</button>
                <button className="add-btn" onClick={() => handlePDF(r)}>PDF</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Reservation;
