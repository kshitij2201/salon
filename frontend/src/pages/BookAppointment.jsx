import { useEffect, useState } from 'react';
import axios from 'axios';
import '../../assets/css/BookAppointment.css';

function BookAppointment() {
  const [services, setServices] = useState([]);
  const [selectedServices, setSelectedServices] = useState([]);
  const [formData, setFormData] = useState({
    customerName: '',
    phone: '',
    email: '',
    appointmentDate: '',
    appointmentTime: ''
  });
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    axios.get('http://salon-one-rose.vercel.app/api/services')
      .then(res => setServices(res.data))
      .catch(err => console.error(err));

    const now = new Date();
    setFormData(prev => ({
      ...prev,
      appointmentDate: now.toISOString().split('T')[0],
      appointmentTime: now.toTimeString().slice(0, 5)
    }));
  }, []);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddService = e => {
    const serviceId = e.target.value;
    const selected = services.find(s => s._id === serviceId);
    if (selected && !selectedServices.find(s => s._id === serviceId)) {
      setSelectedServices(prev => [...prev, selected]);
    }
  };

  const handleRemoveService = (id) => {
    setSelectedServices(prev => prev.filter(s => s._id !== id));
  };

  const calculateTotal = () => {
    return selectedServices.reduce((sum, s) => sum + s.price, 0);
  };

  const handleSubmit = e => {
    e.preventDefault();
    const combinedDateTime = new Date(`${formData.appointmentDate}T${formData.appointmentTime}`);

    axios.post('http://salon-one-rose.vercel.app/api/appointments', {
      ...formData,
      services: selectedServices.map(s => s._id),
      appointmentTime: combinedDateTime.toISOString(),
      totalPrice: calculateTotal()
    })
      .then(() => {
        setSuccess(true);
        setFormData({
          customerName: '',
          phone: '',
          email: '',
          appointmentDate: '',
          appointmentTime: ''
        });
        setSelectedServices([]);
      })
      .catch(err => {
        console.error(err);
        alert("Error booking appointment");
      });
  };

  return (
    <div className="appointment-wrapper">
      <h1>Book an Appointment</h1>

      <form onSubmit={handleSubmit} className="appointment-form">
        <label>
          Add Service:
          <select onChange={handleAddService} value="">
            <option value="">Select Service</option>
            {services.map(service => (
              <option key={service._id} value={service._id}>
                {service.name} - ₹{service.price}
              </option>
            ))}
          </select>
        </label>

        {selectedServices.length > 0 && (
          <div className="selected-services">
            <ul>
              {selectedServices.map(service => (
                <li key={service._id}>
                  {service.name} - ₹{service.price}
                  <button type="button" onClick={() => handleRemoveService(service._id)}>❌</button>
                </li>
              ))}
            </ul>
            <p className="total-price"><strong>Total: ₹{calculateTotal()}</strong></p>
          </div>
        )}

        <label>Name:
          <input type="text" name="customerName" value={formData.customerName} onChange={handleChange} required />
        </label>

        <label>Phone:
          <input type="text" name="phone" value={formData.phone} onChange={handleChange} required />
        </label>

        <label>Email:
          <input type="email" name="email" value={formData.email} onChange={handleChange} required />
        </label>

        <label>Appointment Date:
          <input type="date" name="appointmentDate" value={formData.appointmentDate} onChange={handleChange} required />
        </label>

        <label>Appointment Time:
          <input type="time" name="appointmentTime" value={formData.appointmentTime} onChange={handleChange} required />
        </label>

        <button type="submit" disabled={selectedServices.length === 0}>Book Now</button>
      </form>

      {success && (
        <div className="popup-overlay">
          <div className="popup">
            <h2>Success!</h2>
            <p>Your appointment is booked successfully 🎉</p>
            <button onClick={() => setSuccess(false)}>OK</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default BookAppointment;
