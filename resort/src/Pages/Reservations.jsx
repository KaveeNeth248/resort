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

 const handlePDF = (reservation) => {
  const doc = new jsPDF("p", "mm", "a4");

  // Background image (CORS-safe proxy)
  const bgUrl =
    "https://corsproxy.io/?" +
    encodeURIComponent("https://wallpaperaccess.com/full/2690753.jpg");

  const img = new Image();
  img.crossOrigin = "anonymous";
  img.src = bgUrl;

  img.onload = () => {
    // ===== BACKGROUND =====
    doc.addImage(img, "JPEG", 0, 0, 210, 297);

    // Dark glass overlay (dashboard-style)
    doc.setFillColor(0, 0, 0);
    doc.setGState(new doc.GState({ opacity: 0.25 }));
    doc.rect(0, 0, 210, 297, "F");
    doc.setGState(new doc.GState({ opacity: 1 }));

    // ===== CARD =====
    const cardX = 20;
    const cardY = 35;
    const cardWidth = 170;
    const cardHeight = 215;

    doc.setFillColor("#ffffff");
    doc.setDrawColor("#e5d7b5"); // soft border
    doc.setLineWidth(1.5);
    doc.roundedRect(cardX, cardY, cardWidth, cardHeight, 12, 12, "FD");

    // ===== HEADER =====
    doc.setFont("helvetica", "bold");
    doc.setFontSize(26);
    doc.setTextColor("#ffb300"); // accent
    doc.text(
      "Ocean View Resort",
      cardX + cardWidth / 2,
      cardY + 28,
      { align: "center" }
    );

    doc.setFont("helvetica", "normal");
    doc.setFontSize(15);
    doc.setTextColor("#777777");
    doc.text(
      "Reservation Invoice",
      cardX + cardWidth / 2,
      cardY + 42,
      { align: "center" }
    );

    // Accent divider
    doc.setDrawColor("#ffb300");
    doc.setLineWidth(0.8);
    doc.line(cardX + 25, cardY + 48, cardX + cardWidth - 25, cardY + 48);

    // ===== CONTENT =====
    doc.setFontSize(14);
    doc.setTextColor("#2c3e50");

    let y = cardY + 70;
    const gap = 14;

    const details = [
      ["Reservation ID", reservation.reservationId],
      ["Guest Name", reservation.user?.name || "N/A"],
      ["Room Type", reservation.room.roomType],
      ["Check-In", reservation.checkIn],
      ["Check-Out", reservation.checkOut],
      ["Total Bill", `$${reservation.totalBill.toFixed(2)}`],
    ];

    details.forEach(([label, value]) => {
      doc.setFont("helvetica", "bold");
      doc.text(`${label}:`, cardX + 25, y);

      doc.setFont("helvetica", "normal");
      doc.text(String(value), cardX + 80, y);

      y += gap;
    });

    // ===== STATUS BADGE (button style) =====
    const status = reservation.status.toUpperCase();
    let statusColor = "#ffb300";

    if (status === "APPROVED") statusColor = "#27ae60";
    if (status === "REJECTED") statusColor = "#e74c3c";

    const badgeW = 65;
    const badgeH = 20;
    const badgeX = cardX + cardWidth - badgeW - 25;
    const badgeY = cardY + cardHeight - 50;

    doc.setFillColor(statusColor);
    doc.roundedRect(badgeX, badgeY, badgeW, badgeH, 8, 8, "F");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor("#ffffff");
    doc.text(
      status,
      badgeX + badgeW / 2,
      badgeY + badgeH / 2 + 4,
      { align: "center" }
    );

    // ===== FOOTER =====
    doc.setFont("helvetica", "italic");
    doc.setFontSize(11);
    doc.setTextColor("#ffffff");
    doc.text(
      "Thank you for choosing Ocean View Resort",
      cardX + cardWidth / 2,
      cardY + cardHeight + 22,
      { align: "center" }
    );

    // ===== SAVE =====
    doc.save(`Reservation_${reservation.reservationId}.pdf`);
  };

  img.onerror = () => {
    alert("Failed to load background image");
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
