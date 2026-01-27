import React, { useEffect, useState } from "react";
import api from "../api/api";
import "./theme.css";

const ReservationReport = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all reservations
  const fetchReservations = async () => {
    try {
      const response = await api.get("/reservations");
      setReservations(response.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching reservations:", err);
      setError("Failed to load reservations");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  // Handle status update (Approve / Reject)
  const handleStatusChange = async (reservation_id, status) => {
    try {
      await api.patch(`/reservations/${reservation_id}/status`, null, {
        params: { status },
      });
      fetchReservations(); // Refresh table
    } catch (err) {
      console.error("Error updating status:", err);
      alert("Failed to update reservation status");
    }
  };

  if (loading) return <p>Loading reservations...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h2>Reservation Report</h2>

      {/* Summary section */}
      <div style={{ marginBottom: "20px" }}>
        <strong>Total Reservations:</strong> {reservations.length} |{" "}
        <strong>Total Revenue:</strong> $
        {reservations
          .reduce((acc, r) => acc + (r.total_bill || 0), 0)
          .toFixed(2)}{" "}
        | <strong>Pending:</strong>{" "}
        {reservations.filter((r) => r.status === "PENDING").length} |{" "}
        <strong>Approved:</strong>{" "}
        {reservations.filter((r) => r.status === "APPROVED").length} |{" "}
        <strong>Rejected:</strong>{" "}
        {reservations.filter((r) => r.status === "REJECTED").length}
      </div>

      <table border="1" cellPadding="10" style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Guest Name</th>
            <th>Room Type</th>
            <th>Check-In</th>
            <th>Check-Out</th>
            <th>Total Bill ($)</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {reservations.map((res) => (
            <tr key={res.reservation_id}>
              <td>{res.reservation_id}</td>
              <td>{res.users?.username || "N/A"}</td>
              <td>{res.room?.room_type || "N/A"}</td>
              <td>{new Date(res.check_in).toLocaleDateString()}</td>
              <td>{new Date(res.check_out).toLocaleDateString()}</td>
              <td>{res.total_bill?.toFixed(2) || "0.00"}</td>
              <td>{res.status}</td>
              <td>
                {res.status === "PENDING" && (
                  <>
                    <button
                      style={{ marginRight: "5px" }}
                      onClick={() => handleStatusChange(res.reservation_id, "APPROVED")}
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleStatusChange(res.reservation_id, "REJECTED")}
                    >
                      Reject
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ReservationReport;
