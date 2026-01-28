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

  // Generate PDF bill
  const handlePDF = (reservation) => {
    const doc = new jsPDF("p", "mm", "a4");

    doc.setFontSize(22);
    doc.text("Ocean View Resort - Reservation Bill", 105, 20, { align: "center" });
    doc.setFontSize(14);

    const details = [
      ["Reservation ID", reservation.reservationId],
      ["Guest Name", reservation.user?.name || reservation.user?.username || "N/A"],
      ["Room Type", reservation.room.roomType],
      ["Check-In", reservation.checkIn],
      ["Check-Out", reservation.checkOut],
      ["Total Bill", `$${reservation.totalBill.toFixed(2)}`],
      ["Status", reservation.status],
    ];

    let y = 40;
    details.forEach(([label, value]) => {
      doc.text(`${label}: ${value}`, 20, y);
      y += 10;
    });

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
              <td>${r.totalBill?.toFixed(2)}</td>
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