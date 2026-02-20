import { useState } from "react";
import api from "../api/api";
import { useNavigate } from "react-router-dom";

function CustomerRegistration() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // Email validation
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email.trim());
  };

  // Strong password validation
  const isValidPassword = (password) => {
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  };

  const register = async () => {
    // Trim all input values
    const trimmedUsername = username.trim();
    const trimmedPassword = password.trim();
    const trimmedFullName = fullName.trim();
    const trimmedEmail = email.trim();
    const trimmedContact = contactNumber.trim();
    const trimmedAddress = address.trim();

    if (
      !trimmedUsername ||
      !trimmedPassword ||
      !trimmedFullName ||
      !trimmedEmail ||
      !trimmedContact ||
      !trimmedAddress
    ) {
      alert("Please fill all fields");
      return;
    }

    if (!isValidEmail(trimmedEmail)) {
      alert("Please enter a valid email address");
      return;
    }

    if (!isValidPassword(trimmedPassword)) {
      alert(
        "Password must be at least 8 characters and include uppercase, lowercase, number, and special character"
      );
      return;
    }

    setLoading(true);

    try {
      await api.post("/auth/register", {
        username: trimmedUsername,
        password: trimmedPassword,
        fullName: trimmedFullName,
        email: trimmedEmail,
        contactNumber: trimmedContact,
        address: trimmedAddress,
        role: "CUSTOMER",
      });

      alert("Registration Successful!");
      navigate("/"); // Navigate to login page
    } catch (error) {
      console.error("Registration error:", error.response || error);
      if (error.response?.status === 409) {
        alert("Username already exists!");
      } else {
        alert("Registration Failed! Please check your input or server.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Customer Registration</h2>

        <div className="form-group">
          <input
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <div className="form-group">
          <input
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div className="form-group">
          <input
            placeholder="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
        </div>

        <div className="form-group">
          <input
            placeholder="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="form-group">
          <input
            placeholder="Contact Number"
            value={contactNumber}
            onChange={(e) => setContactNumber(e.target.value)}
          />
        </div>

        <div className="form-group">
          <input
            placeholder="Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </div>

        <button onClick={register} className="login-btn" disabled={loading}>
          {loading ? "Registering..." : "Register"}
        </button>
      </div>
    </div>
  );
}
export default CustomerRegistration;