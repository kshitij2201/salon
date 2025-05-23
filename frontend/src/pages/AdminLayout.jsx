import { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import '../../assets/css/AdminLayout.css';

function AdminLayout() {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const navigate = useNavigate();

  const toggleNav = () => {
    setIsNavOpen(!isNavOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin-login');
  };

  return (
    <div className="admin-layout">
      <nav className={`admin-nav ${isNavOpen ? 'active' : ''}`}>
        <div className="admin-nav-header">
          <h2>Admin Panel hair & care</h2>
          <button className="admin-nav-toggle" onClick={toggleNav}>
            {isNavOpen ? '✕' : '☰'}
          </button>
        </div>
        <ul>
          <li>
            <NavLink
              to="/admin"
              end
              className={({ isActive }) => (isActive ? 'active' : '')}
              onClick={() => setIsNavOpen(false)}
            >
              Dashboard
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/admin/book-appointment"
              className={({ isActive }) => (isActive ? 'active' : '')}
              onClick={() => setIsNavOpen(false)}
            >
              Book Appointment
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/admin/services"
              className={({ isActive }) => (isActive ? 'active' : '')}
              onClick={() => setIsNavOpen(false)}
            >
              Manage Services
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/admin/stylists"
              className={({ isActive }) => (isActive ? 'active' : '')}
              onClick={() => setIsNavOpen(false)}
            >
              Manage Stylists
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/admin/upload-gallery"
              className={({ isActive }) => (isActive ? 'active' : '')}
              onClick={() => setIsNavOpen(false)}
            >
              Upload Gallery
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/admin/earnings"
              className={({ isActive }) => (isActive ? 'active' : '')}
              onClick={() => setIsNavOpen(false)}
            >
              View Earnings
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/admin/pending"
              className={({ isActive }) => (isActive ? 'active' : '')}
              onClick={() => setIsNavOpen(false)}
            >
              Pending Amounts
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/admin/add-expense"
              className={({ isActive }) => (isActive ? 'active' : '')}
              onClick={() => setIsNavOpen(false)}
            >
              Add Expenses
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/admin/view-expenses"
              className={({ isActive }) => (isActive ? 'active' : '')}
              onClick={() => setIsNavOpen(false)}
            >
              View Expenses
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/admin/summary-2025"
              className={({ isActive }) => (isActive ? 'active' : '')}
              onClick={() => setIsNavOpen(false)}
            >
              Summary 2025
            </NavLink>
          </li>
          <li>
            <button onClick={handleLogout} className="logout-btn">
              Logout
            </button>
          </li>
        </ul>
      </nav>
      <main className="admin-content">
        <Outlet />
      </main>
    </div>
  );
}

export default AdminLayout;
