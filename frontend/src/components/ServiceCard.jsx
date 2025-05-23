// src/components/ServiceCard.jsx
import React from 'react';
import './ServiceCard.css';

function ServiceCard({ service }) {
  return (
    <div className="service-card">
      <h3 className="service-name">{service.name}</h3>
      <p className="service-description">{service.description}</p>
      <p className="service-duration">Duration: {service.duration} mins</p>
      <p className="service-price">Price: ₹{service.price}</p>
      <button className="book-button">Book Appointment</button>
    </div>
  );
}

export default ServiceCard;
