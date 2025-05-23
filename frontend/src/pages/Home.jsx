// src/pages/Home.jsx
import { useEffect, useState } from 'react';
import axios from 'axios';
import '../../assets/css/Home.css';

function Home() {
  const [services, setServices] = useState([]);

  useEffect(() => {
    axios
      .get('http://salon-one-rose.vercel.app/api/services')
      .then(res => setServices(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="home-wrapper">
      <h1>Our Salon Services</h1>
      <div className="service-list">
        {services.map(service => (
          <div className="service-card" key={service._id}>
            <h2>{service.name}</h2>
            <p>{service.description}</p>
            <p><strong>Duration:</strong> {service.duration} mins</p>
            <p><strong>Price:</strong> ₹{service.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;
