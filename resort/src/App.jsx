import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./Pages/Login";
import Dashboard from "./Pages/Dashboard";
import Rooms from "./Pages/Rooms";
import Reservations from "./Pages/Reservations";
import Help from "./Pages/Help";
import AddUpdateRoom from "./Pages/AddUpdateRoom";
import ReservationForm from "./Pages/ReservationForm";
import CustomerRegistration from "./Pages/CustomerRegistration";
import CustomerDashboard from "./Pages/Customer-Dashboard";
import ViewRooms from "./Pages/ViewRoom";
import CustomerHelp from "./Pages/CustomerHelp";
import UpdateCustomerDetails from "./Pages/UpdateCustomerDetails";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/rooms" element={<Rooms />} />
        <Route path="/reservations" element={<Reservations />} />
        <Route path="/help/admin" element={<Help />} />
        <Route path="/help/customer" element={<CustomerHelp />} />
        <Route path="/rooms/add" element={<AddUpdateRoom />} />
        <Route path="/rooms/edit/:id" element={<AddUpdateRoom />} />
        <Route path="/rooms/delete/:id" element={<AddUpdateRoom />} />
        <Route path="/reservations/add" element={<ReservationForm />} />
        <Route path="/register" element={<CustomerRegistration />} />
        <Route path="/customer-dashboard" element={<CustomerDashboard />} />
        <Route path="/rooms1" element={<ViewRooms />} />
        <Route path="/updateCustomer/:userId" element={<UpdateCustomerDetails />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;