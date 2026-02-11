import React, { useEffect, useState } from "react";
import api from "../api/api";
import "./theme.css";

function StaffHelp() {
  const [helpText, setHelpText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStaffHelp = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await api.get("/help/staff"); 
        setHelpText(res.data);
      } catch (err) {
        setError(
          err.response?.data || err.message || "Failed to load staff help."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchStaffHelp();
  }, []);

  return (
    <div className="dashboard-container" style={{ minHeight: "100vh" }}>
      <div
        className="help-card"
        style={{
          background: "rgba(255, 255, 255, 0.05)",
          backdropFilter: "blur(12px) saturate(180%)",
          WebkitBackdropFilter: "blur(12px) saturate(180%)",
          border: "1px solid rgba(255, 255, 255, 0.2)",
          borderRadius: "20px",
          padding: "40px 30px",
          boxShadow: "0 15px 40px rgba(0, 0, 0, 0.2)",
          maxWidth: "800px",
          margin: "auto"
        }}
      >
        <h2
          style={{
            fontSize: "28px",
            fontWeight: "700",
            color: "#fff",
            textAlign: "center",
            marginBottom: "25px"
          }}
        >
          🧑‍💼 Staff Help
        </h2>

        {loading ? (
          <p className="loading-text">⏳ Loading staff help...</p>
        ) : error ? (
          <p className="error-text">{error}</p>
        ) : (
          <pre className="help-text" style={{ color: "#f0f0f0" }}>
            {helpText}
          </pre>
        )}
      </div>

      <footer style={{ textAlign: "center", marginTop: "60px", color: "#ccc" }}>
        ©️ {new Date().getFullYear()} Ocean View Resort. All rights reserved.
      </footer>
    </div>
  );
}

export default StaffHelp;
