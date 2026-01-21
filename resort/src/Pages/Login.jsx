import { useState } from "react";
import api from "../api/api"; // Axios instance with baseURL
import { useNavigate } from "react-router-dom";

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
      const res = await api.post("/login", {
        username,
        password
      });

      if (res.data.message === "Login Successful") {
        localStorage.setItem("user", res.data.username);
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Login error:", error);

      if (error.response?.status === 401) {
        alert("Invalid Credentials");
      } else {
        alert("Login failed. Please try again.");
      }
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
      </div>
    </div>
  );
}

export default Login;
