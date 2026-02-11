import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import "./theme.css";

export default function StaffLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    api.post("/staff/login", {
      username,
      password
    })
    .then(res => {
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("fullName", res.data.fullName);
      navigate("/staff-dashboard");
    })
    .catch(() => setError("Invalid credentials"));
  };

  return (
    <div className="form-container">
      <h2>Staff Login</h2>

      {error && <div className="error-text">{error}</div>}

      <form onSubmit={handleLogin}>
        <input
          placeholder="Username"
          value={username}
          onChange={e => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}
