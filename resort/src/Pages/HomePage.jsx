import React from "react";
import { Link } from "react-router-dom";
import { FaFacebookF, FaWhatsapp, FaEnvelope, FaMapMarkerAlt, FaGlobe, FaUser } from "react-icons/fa";

const Homepage = () => {
  const currentYear = new Date().getFullYear();

  return (
    <div className="dashboard-container" style={{ color: "var(--text)" }}>
      {/* Navigation Bar */}
      <nav className="dashboard-nav" style={{ marginBottom: 30 }}>
        <h1 className="nav-title">🌊 Ocean View Resort - Thalawathugoda</h1>
        <div className="nav-links">
          <Link to="/login" className="nav-btn" title="Login">
            <FaUser size={20} style={{ verticalAlign: "middle", marginRight: 6 }} />
            Login
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section
        style={{
          textAlign: "center",
          marginBottom: "40px",
          padding: "40px 20px",
          borderRadius: "12px",
          background: "var(--card)",
          boxShadow: "var(--shadow)",
          backdropFilter: "blur(10px)",
        }}
      >
        <h2 style={{ color: "var(--accent)", marginBottom: 16 }}>
          Welcome to Ocean View Resort 🏖️
        </h2>
        <p style={{ fontSize: "1.15rem", lineHeight: 1.6, maxWidth: 720, margin: "0 auto" }}>
          Experience luxury and comfort at our 5-star resort nestled in the beautiful Thalawathugoda area.
          Enjoy stunning ocean views, multiple room types to suit your needs, and exclusive seasonal promotions.
          Relax and rejuvenate with our world-class amenities.
        </p>
      </section>

      {/* Promotion Section */}
      <section
        style={{
          marginBottom: "40px",
          background: "var(--card)",
          padding: "25px 20px",
          borderRadius: "12px",
          boxShadow: "var(--shadow)",
          backdropFilter: "blur(10px)",
        }}
      >
        <h3 style={{ color: "var(--accent)", marginBottom: 20, textAlign: "center" }}>
          Seasonal Promotions 🌟
        </h3>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
            gap: 20,
            color: "var(--text)",
          }}
        >
          <div className="stat-card" style={{ height: "auto" }}>
            <h4>Summer Splash Discount</h4>
            <p>Book a Deluxe or Suite room between June and August and get 20% off your stay.</p>
          </div>
          <div className="stat-card" style={{ height: "auto" }}>
            <h4>Winter Wellness Package</h4>
            <p>Enjoy complimentary spa treatments and wellness sessions for bookings in December and January.</p>
          </div>
          <div className="stat-card" style={{ height: "auto" }}>
            <h4>Family Holiday Special</h4>
            <p>Kids stay free with every family suite booking during school holidays.</p>
          </div>
          <div className="stat-card" style={{ height: "auto" }}>
            <h4>Romantic Getaway Offer</h4>
            <p>Celebrate love with a special dinner and room upgrade from February to March.</p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section
        style={{
          marginBottom: "40px",
          background: "var(--card)",
          padding: "25px 20px",
          borderRadius: "12px",
          boxShadow: "var(--shadow)",
          backdropFilter: "blur(10px)",
          maxWidth: 900,
          marginLeft: "auto",
          marginRight: "auto",
          color: "var(--text)",
        }}
      >
        <h3 style={{ color: "var(--accent)", marginBottom: 20, textAlign: "center" }}>
          Contact Us
        </h3>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-around",
            gap: "30px",
            fontSize: "1.1rem",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <FaMapMarkerAlt color="var(--accent)" size={22} />
            <span>Thalawathugoda, Colombo, Sri Lanka</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <FaEnvelope color="var(--accent)" size={22} />
            <a
              href="mailto:contact@oceanviewresort.lk"
              style={{ color: "var(--text)", textDecoration: "none" }}
            >
              contact@oceanviewresort.lk
            </a>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <FaWhatsapp color="var(--accent)" size={22} />
            <a
              href="https://wa.me/94771234567"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "var(--text)", textDecoration: "none" }}
            >
              +94 77 123 4567
            </a>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <FaFacebookF color="var(--accent)" size={22} />
            <a
              href="https://facebook.com/oceanviewresort"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "var(--text)", textDecoration: "none" }}
            >
              facebook.com/oceanviewresort
            </a>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <FaGlobe color="var(--accent)" size={22} />
            <a
              href="https://oceanviewresort.lk"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "var(--text)", textDecoration: "none" }}
            >
              oceanviewresort.lk
            </a>
          </div>
        </div>
      </section>

      {/* Embedded Google Map */}
      <section style={{ marginBottom: "40px", borderRadius: "12px", overflow: "hidden" }}>
        <iframe
          title="Ocean View Resort Location"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d63323.14186528197!2d79.96304050745223!3d6.865972859976353!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae25354dbf0fa77%3A0x70c24c0ec7bb7d81!2sThalawathugoda!5e0!3m2!1sen!2slk!4v1672748452677!5m2!1sen!2slk"
          width="100%"
          height="350"
          style={{ border: 0 }}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </section>

      {/* Footer */}
      <footer
        style={{
          textAlign: "center",
          padding: "20px 10px",
          color: "var(--muted)",
          borderTop: "1px solid var(--border)",
          fontSize: "0.9rem",
        }}
      >
        &copy; {currentYear} Ocean View Resort, Thalawathugoda — All rights reserved.
      </footer>
    </div>
  );
};

export default Homepage;
