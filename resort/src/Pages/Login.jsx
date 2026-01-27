import { useState } from "react";
import api from "../api/api";
import { useNavigate, Link } from "react-router-dom";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const login = async () => {
    if (!username || !password) {
      alert("Please enter username and password");
      return;
    }

    setLoading(true);

    try {
      const res = await api.post("/auth/login", {
        username,
        password
      });

      const user = res.data;

      // store logged-in user
      localStorage.setItem("user", JSON.stringify(user));

      // role-based redirect
      if (user.role === "ADMIN") {
        navigate("/dashboard"); // ADMIN dashboard
      } else {
        navigate("/customer-dashboard"); // CUSTOMER dashboard
      }

    } catch (error) {
      alert("Invalid Credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Ocean View Resort Login</h2>

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

        {/* ✅ New Customer Link */}
        <p style={{ marginTop: "12px", textAlign: "center" }}>
          Are you a new customer?{" "}
          <Link to="/register">Register here</Link>
        </p>
      </div>
    </div>
  );
}export default Login;