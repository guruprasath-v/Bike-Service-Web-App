import { Routes, Route } from "react-router-dom"
import './App.css';
import Home from './components/Home';
import Register from './components/Register';
import Login from './components/Login';
import UserDashboard from "./components/UserDashboard";
import AdminDashboard from "./components/AdminDashbaord";
import AllBookings from "./components/AllBookings";
import CreateBooking from "./components/CreateBooking";
import AllServices from "./components/AllServices";
import CreateService from "./components/CreateService";
import Logout from "./components/Logout";


function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={ <Home/> } />
        <Route path="/register" element={ <Register/> } />
        <Route path="/auth/login" element={ <Login/> } />
        <Route path="/users/me" element={ <UserDashboard/> } />
        <Route path="/users/me/bookservice" element={ <CreateBooking/> } />
        <Route path="/users/admin" element={ <AdminDashboard/> } />
        <Route path="/users/admin/allbookings" element={ <AllBookings/> } />
        <Route path="/users/admin/services" element={ <AllServices/> } />
        <Route path="/users/admin/newservice" element={ <CreateService/> } />
        <Route path="/users/logout" element={ <Logout/> } />
      </Routes>
    </div>
  )
}

export default App;
