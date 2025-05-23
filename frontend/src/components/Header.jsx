// src/components/Header.jsx
import { Link } from 'react-router-dom';
import '../../assets/css/Header.css';

function Header() {
  return (
    <header className="header">
      <div className="logo">
        <Link to="/">Salon Portal</Link>
      </div>
      <nav className="nav">
        <ul>
          {/* Customer Links */}
          <li><Link to="/">Home</Link></li>
          {/* <li><Link to="/services">Services</Link></li> */}
          <li><Link to="/book">Book Appointment</Link></li>
          <li><Link to="/gallery">Gallery</Link></li>

          {/* Admin Links (conditional, admin can log in) */}
          {/* Replace with conditional logic based on admin auth status */}
          {/* <li><Link to="/admin">Admin Dashboard</Link></li>
          <li><Link to="/upload-gallery">Upload Gallery</Link></li> */}
        </ul>
      </nav>
    </header>
  );
}

export default Header;
