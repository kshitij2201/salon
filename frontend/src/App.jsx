// src/App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';

import Home from './pages/Home';
import BookAppointment from './pages/BookAppointment';
import Gallery from './pages/Gallery';
import Services from './pages/Services';
import Header from './components/Header';

import AdminLayout from './pages/AdminLayout';
import AdminDashboard from './pages/AdminDashboard';
import UploadGallery from './pages/UploadGallery';
import TotalEarnings from './pages/TotalEarnings';
import PendingAppointments from './pages/PendingAppointments';
import AddExpense from './pages/AddExpense';
import AdminLogin from './pages/AdminLogin';
import ViewExpenses from './pages/ViewExpenses'; 
import Summary2025 from './pages/Summary2025';
import Stylists from './pages/Stylists';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Pages */}
          <Route path="/" element={<><Header /><Home /></>} />
          <Route path="/book" element={<><Header /><BookAppointment /></>} />
          <Route path="/gallery" element={<><Header /><Gallery /></>} />
          <Route path="/admin-login" element={<AdminLogin />} />

          {/* Protected Admin Routes */}
          <Route path="/admin" element={
            <PrivateRoute>
              <AdminLayout />
            </PrivateRoute>
          }>
            <Route index element={<AdminDashboard />} />
            <Route path="book-appointment" element={<BookAppointment />} />
            <Route path="services" element={<Services />} />
            <Route path="/admin/stylists" element={<Stylists />} />
            <Route path="upload-gallery" element={<UploadGallery />} />
            <Route path="earnings" element={<TotalEarnings />} />
            <Route path="pending" element={<PendingAppointments />} />
            <Route path="add-expense" element={<AddExpense />} />
            <Route path="view-expenses" element={<ViewExpenses />} />
            <Route path="summary-2025" element={<Summary2025 />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
