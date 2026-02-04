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

  const [room, setRoom] = useState(INITIAL_ROOM_STATE);
  const [loading, setLoading] = useState(isEdit);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // Fetch room data if editing
  useEffect(() => {
    if (!isEdit) return;

    const fetchRoom = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/rooms/${id}`);
        const roomData = res.data?.room || res.data;
        setRoom({
          roomNumber: roomData?.roomNumber || "",
          roomType: roomData?.roomType || "",
          pricePerNight: roomData?.pricePerNight || "",
          status: roomData?.status || "",
          imageUrl: roomData?.imageUrl || "",
          description: roomData?.description || ""
        });
      } catch (err) {
        setErrors({ general: "Failed to load room. Please try again." });
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchRoom();
  }, [id, isEdit]);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setRoom(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: "" })); // Clear field error on change
  };

  // Validate form
  const validate = () => {
    const newErrors = {};

    if (!room.roomNumber.trim()) newErrors.roomNumber = "Room Number is required";
    if (!room.roomType.trim()) newErrors.roomType = "Room Type is required";
    if (!room.pricePerNight || Number(room.pricePerNight) <= 0) newErrors.pricePerNight = "Price must be a positive number";
    if (!["Available", "Booked"].includes(room.status)) newErrors.status = "Status must be 'Available' or 'Booked'";
    if (room.imageUrl && !/^https?:\/\/.+\..+/.test(room.imageUrl)) newErrors.imageUrl = "Invalid URL";

    return newErrors;
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setSubmitting(true);
    setErrors({});

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
      setErrors({ general: isEdit ? "Failed to update room" : "Failed to add room" });
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="form-container">
        <p className="loading-text">Loading room data...</p>
      </div>
    );
  }

  return (
    <div className="form-container">
      <h2>{isEdit ? "Update Room" : "Add Room"}</h2>
      
      {errors.general && <p className="error-text">{errors.general}</p>}

      <form onSubmit={handleSubmit}>
        {FORM_FIELDS.map(field => (
          <div key={field.name} className="form-field">
            <input
              type={field.type}
              name={field.name}
              placeholder={field.placeholder}
              value={room[field.name] || ""}
              onChange={handleChange}
            />
            {errors[field.name] && <p className="error-text">{errors[field.name]}</p>}
          </div>
        ))}

        <div className="form-field">
          <textarea
            name="description"
            placeholder="Room Description"
            value={room.description || ""}
            onChange={handleChange}
            rows="5"
          />
        </div>

        <button type="submit" disabled={submitting}>
          {submitting ? "Processing..." : isEdit ? "Update Room" : "Add Room"}
        </button>
      </form>
    </div>
  );
}
