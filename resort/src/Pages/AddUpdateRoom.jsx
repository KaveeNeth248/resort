import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/api";
import "./theme.css";

const INITIAL_ROOM_STATE = {
  roomNumber: "",
  roomType: "",
  pricePerNight: "",
  status: "",
  imageUrl: "",
  description: ""
};

const FORM_FIELDS = [
  { name: "roomNumber", placeholder: "Room Number", type: "text" },
  { name: "roomType", placeholder: "Room Type", type: "text" },
  { name: "pricePerNight", placeholder: "Price Per Night", type: "number" },
  { name: "status", placeholder: "Status (Available / Booked)", type: "text" },
  { name: "imageUrl", placeholder: "Image URL", type: "url" }
];

export default function AddUpdateRoom() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  // 📦 STATE MANAGEMENT
  const [room, setRoom] = useState(INITIAL_ROOM_STATE);
  const [loading, setLoading] = useState(isEdit);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // 🔄 FETCH ROOM DATA WHEN EDITING
  useEffect(() => {
    if (!isEdit) return;

    const fetchRoom = async () => {
      try {
        setLoading(true);
        setError("");
        console.log(`Fetching room with ID: ${id}`);
        const res = await api.get(`/rooms/${id}`);
        console.log("Room data fetched:", res.data);
        
        const roomData = res.data?.room || res.data;
        console.log("Room data parsed:", roomData);
        
        const populatedRoom = {
          roomNumber: roomData?.roomNumber || "",
          roomType: roomData?.roomType || "",
          pricePerNight: roomData?.pricePerNight || "",
          status: roomData?.status || "",
          imageUrl: roomData?.imageUrl || "",
          description: roomData?.description || ""
        };
        console.log("Room state set:", populatedRoom);
        
        setRoom(populatedRoom);
      } catch (err) {
        setError("Failed to load room. Please try again.");
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRoom();
  }, [id, isEdit]);

  // ✏️ HANDLE INPUT CHANGE
  const handleChange = (e) => {
    const { name, value } = e.target;
    setRoom(prev => ({ ...prev, [name]: value }));
  };

  // 💾 HANDLE SUBMIT
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!room.roomNumber?.trim() || !room.roomType?.trim()) {
      setError("Room Number and Room Type are required");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      if (isEdit) {
        await api.put(`/rooms/${id}`, room);
        alert("✅ Room Updated Successfully");
      } else {
        await api.post("/rooms", room);
        alert("✅ Room Added Successfully");
      }
      navigate("/rooms");
    } catch (err) {
      setError(isEdit ? "Failed to update room" : "Failed to add room");
      console.error("Submit error:", err);
    } finally {
      setSubmitting(false);
    }
  };

  // 🔄 RENDER LOADING STATE
  if (loading) {
    return (
      <div className="form-container">
        <p className="loading-text">Loading room data...</p>
      </div>
    );
  }

  // 🎨 RENDER FORM
  console.log("Current room state:", room);
  console.log("Is Edit:", isEdit);
  console.log("Loading:", loading);
  
  return (
    <div className="form-container">
      <h2>{isEdit ? "Update Room" : "Add Room"}</h2>
      
      {error && <p className="error-text">{error}</p>}

      <form onSubmit={handleSubmit}>
        {FORM_FIELDS.map(field => (
          <input
            key={field.name}
            type={field.type}
            name={field.name}
            placeholder={field.placeholder}
            value={room[field.name] || ""}
            onChange={handleChange}
            required={field.name === "roomNumber" || field.name === "roomType"}
          />
        ))}

        <textarea
          name="description"
          placeholder="Room Description"
          value={room.description || ""}
          onChange={handleChange}
          rows="5"
        />

        <button type="submit" disabled={submitting}>
          {submitting ? "Processing..." : isEdit ? "Update Room" : "Add Room"}
        </button>
      </form>
    </div>
  );
}