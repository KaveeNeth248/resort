import { useState } from "react";
import api from "../api/api";
import { useNavigate } from "react-router-dom";
import "./theme.css";

export default function StaffLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // ✅ Form validation
  const validate = () => {
    if (!username.trim()) return "Username is required";
    if (!password) return "Password is required";
    if (password.length < 6) return "Password must be at least 6 characters";
    return null;
  };

  const login = async () => {
    const errorMessage = validate();
    if (errorMessage) {
      alert(errorMessage);
      return;
    }

    setLoading(true);

    try {
      // Call backend staff login
      const res = await api.post("/staff/login", { username, password });

      const { token, fullName } = res.data;

      // ✅ Save JWT token
      localStorage.setItem("token", token);

      // ✅ Save staff info
      localStorage.setItem("fullName", fullName);

      // Navigate to staff dashboard
      navigate("/staff-dashboard");
    } catch (error) {
      console.error(error);
      alert("Invalid username or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Ocean View Resort Staff Login</h2>

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

        <button onClick={login} className="login-btn" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </div>
    </div>
  );
}
