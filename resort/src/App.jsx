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
import Homepage from "./Pages/HomePage";
import AdminManageStaff from "./Pages/AdminManageStaff";
import StaffLogin from "./Pages/StaffLogin";
import StaffDashboard from "./Pages/StaffDashboard";
import ManageReservation from "./Pages/ManageReservation";
import StaffHelp from "./Pages/StaffHelp";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/login" element={<Login />} />
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
        <Route path="/admin/staff" element={<AdminManageStaff />} />
        <Route path="/staff-login" element={<StaffLogin />} />
        <Route path="/staff-dashboard" element={<StaffDashboard />} />
        <Route path="/manage-reservations" element={<ManageReservation />} />
        <Route path="/help/staff" element={<StaffHelp />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;