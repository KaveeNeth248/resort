import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/api";

function UpdateCustomerDetails() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [address, setAddress] = useState("");
  const [idType, setIdType] = useState("PASSPORT");
  const [idDocument, setIdDocument] = useState(null);
  const [existingDocumentName, setExistingDocumentName] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { userId } = useParams();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get("/auth/users");
        const user = res.data.find((u) => u.id === parseInt(userId));
        if (user) {
          setFullName(user.fullName || "");
          setEmail(user.email || "");
          setContactNumber(user.contactNumber || "");
          setAddress(user.address || "");
          setIdType(user.idType || "PASSPORT");
          if (user.idDocumentPath) {
            const parts = user.idDocumentPath.split("/");
            setExistingDocumentName(parts[parts.length - 1]);
          }
        } else {
          alert("User not found");
          navigate("/");
        }
      } catch (error) {
        console.error("Failed to fetch user:", error);
        alert("Failed to load user data");
      }
    };
    fetchUser();
  }, [userId, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!fullName || !email || !contactNumber || !address || !idType) {
      alert("Please fill all fields");
      return;
    }

    const formData = new FormData();
    formData.append("fullName", fullName);
    formData.append("email", email);
    formData.append("contactNumber", contactNumber);
    formData.append("address", address);
    formData.append("idType", idType);
    if (idDocument) {
      formData.append("idDocument", idDocument);
    }

    setLoading(true);

    try {
      const res = await api.put(`/auth/update/${userId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Details updated successfully!");
      localStorage.setItem("user", JSON.stringify(res.data));
      navigate("/customer-dashboard");
    } catch (error) {
      console.error("Update failed:", error);
      alert("Failed to update details");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Update Personal Details</h2>
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <div className="form-group">
            <input
              placeholder="Full Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <input
              placeholder="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <input
              placeholder="Contact Number"
              value={contactNumber}
              onChange={(e) => setContactNumber(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <input
              placeholder="Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <select
              value={idType}
              onChange={(e) => setIdType(e.target.value)}
              required
            >
              <option value="PASSPORT">Passport</option>
              <option value="LICENSE">License</option>
              <option value="NATIONAL_ID">National ID</option>
            </select>
          </div>

          <div className="form-group">
            <label>
              Upload ID Document (PDF or Image)
              {existingDocumentName && (
                <span
                  style={{
                    display: "block",
                    marginTop: "5px",
                    fontSize: "0.9em",
                    color: "#ccc",
                  }}
                >
                  Current file: {existingDocumentName}
                </span>
              )}
            </label>
            <input
              type="file"
              accept=".pdf,image/*"
              onChange={(e) => setIdDocument(e.target.files[0])}
            />
          </div>

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? "Updating..." : "Update Details"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default UpdateCustomerDetails;
