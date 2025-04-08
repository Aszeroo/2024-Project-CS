import React, { useEffect, useState } from 'react';
import {
  Routes,
  Route,
  Navigate,
  useLocation,
  useNavigate,
} from 'react-router-dom';
import BookingForm from './components/BookingForm';
import RoomPage from './pages/RoomPage';
import Login from './pages/Login';
import Register from './pages/Register';
import EditRoom from './components/EditRoom';
import HomePage from './HomePage';
import Profile from './pages/Profile';
import AdminBookingPage from './pages/AdminBookingPage';
import DashboardPage from './pages/Dashboard';
import MyBookings from './pages/MyBookings';


function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  useEffect(() => {
    const publicPaths = ['/login', '/register']; // ✅ ยกเว้น 2 หน้านี้
    if (!user && !publicPaths.includes(location.pathname)) {
      navigate('/login');
    }
  }, [location.pathname]);
  

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      {/* ผู้ใช้ทั่วไป */}
      <Route path="/" element={user ? <HomePage /> : <Navigate to="/login" />} />
      <Route path="/rooms" element={user ? <RoomPage /> : <Navigate to="/login" />} />
      <Route path="/booking/:roomId" element={user ? <BookingForm /> : <Navigate to="/login" />} />
      <Route path="/profile" element={user ? <Profile /> : <Navigate to="/login" />} />
      <Route path="/my-bookings" element={user ? <MyBookings /> : <Navigate to="/login" />} />
      <Route path="/" element={user?.role === 'USER' ? <HomePage /> : <Navigate to="/login" />} />
      

      {/* แอดมิน */}
      <Route path="/" element={user?.role === 'ADMIN' ? <HomePage /> : <Navigate to="/login" />} />
      <Route path="/admin/editrooms" element={user?.role === 'ADMIN' ? <EditRoom /> : <Navigate to="/login" />} />
      <Route path="/admin/rooms" element={user?.role === 'ADMIN' ? <RoomPage /> : <Navigate to="/login" />} />
      <Route path="/admin/bookings" element={user?.role === 'ADMIN' ? <AdminBookingPage /> : <Navigate to="/login" />} />
      <Route path="/admin/dashboard" element={user?.role === 'ADMIN' ? <DashboardPage /> : <Navigate to="/login" />} />

      {/* fallback */}
      <Route path="*" element={<p>ไม่พบหน้า {location.pathname}</p>} />
    </Routes>
  );
}

export default App;






