import { useState } from "react";
import api from "../api/api";
import { useNavigate, Link } from "react-router-dom";

function Login() {
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
      const res = await api.post("/auth/login", {
        username,
        password,
      });

      const { token, user } = res.data;

      // ✅ Save token separately for API calls
      localStorage.setItem("token", token);

      // ✅ Save user info
      localStorage.setItem("user", JSON.stringify(user));

      // ✅ Role-based navigation
      if (user.role === "ADMIN") {
        navigate("/dashboard");
      } else {
        navigate("/customer-dashboard");
      }
    } catch (error) {
      console.error(error);
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

        <p style={{ marginTop: "12px", textAlign: "center" }}>
          Are you a new customer?{" "}
          <Link to="/register">Register here</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
