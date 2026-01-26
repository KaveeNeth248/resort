import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./Pages/Login";
import Dashboard from "./Pages/Dashboard";
import Rooms from "./Pages/Rooms";
import Reservations from "./Pages/Reservations";
import Help from "./Pages/Help";
import AddUpdateRoom from "./Pages/AddUpdateRoom";
import ReservationForm from "./Pages/ReservationForm";



function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/rooms" element={<Rooms />} />
        <Route path="/reservations" element={<Reservations />} />
        <Route path="/help" element={<Help />} />
        <Route path="/rooms/add" element={<AddUpdateRoom />} />
        <Route path="/rooms/edit/:id" element={<AddUpdateRoom />} />
        <Route path="/rooms/delete/:id" element={<AddUpdateRoom />} />
        <Route path="/reservations/add" element={<ReservationForm />} />
        
      </Routes>
    </BrowserRouter>
  );
}

export default App;