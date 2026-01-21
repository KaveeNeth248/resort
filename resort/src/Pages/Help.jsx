import React, { useEffect, useState } from "react";

const HELP_API = "http://localhost:8080/api/help";

function Help() {
  const [helpText, setHelpText] = useState("");

  // GET /api/help
  useEffect(() => {
    fetch(HELP_API)
      .then((res) => res.text())
      .then((data) => setHelpText(data));
  }, []);

  return (
    <>
      {/* Animated background shapes */}
      <div className="bg-shape one"></div>
      <div className="bg-shape two"></div>

      <div className="container">
        {/* HERO SECTION */}
        <section className="hero">
          <div>
            <h1>
              Need <span>Help?</span>
            </h1>
            <p>
              Welcome to the Ocean View Resort system. Below is a quick guide
              to help you navigate and use the system efficiently.
            </p>
          </div>

          {/* HELP CARD */}
          <div className="card">
            <h2>System Guide</h2>

            <pre
              style={{
                whiteSpace: "pre-wrap",
                color: "var(--muted)",
                fontFamily: "Poppins, sans-serif",
                fontSize: "14px",
                lineHeight: "1.6",
                marginTop: "10px",
              }}
            >
              {helpText}
            </pre>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="footer">
          © {new Date().getFullYear()} Ocean View Resort. All rights reserved.
        </footer>
      </div>
    </>
  );
}

export default Help;
