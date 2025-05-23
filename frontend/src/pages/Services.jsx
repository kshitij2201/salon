import { useEffect, useState } from 'react';
import axios from 'axios';
import '../../assets/css/Services.css';

function Services() {
  const [services, setServices] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    duration: '',
    price: '',
    _id: null,
  });

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/services');
      setServices(res.data);
    } catch (err) {
      console.error("Error fetching services:", err.response?.data?.message || err.message);
    }
  };

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData._id) {
        await axios.put(`http://localhost:5000/api/services/${formData._id}`, formData);
      } else {
        await axios.post('http://localhost:5000/api/services', formData);
      }
      fetchServices();
      setFormData({ name: '', description: '', duration: '', price: '', _id: null });
    } catch (err) {
      console.error("Error submitting form:", err.response?.data?.message || err.message);
    }
  };

  const handleEdit = (service) => {
    setFormData(service);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/services/${id}`);
      fetchServices();
    } catch (err) {
      console.error("Error deleting service:", err.response?.data?.message || err.message);
    }
  };

  return (
    <div className="services-wrapper">
      <h1>Manage Services</h1>
      <form onSubmit={handleSubmit} className="service-form">
        <label>Name:
          <input type="text" name="name" value={formData.name} onChange={handleChange} required />
        </label>
        <label>Description:
          <textarea name="description" value={formData.description} onChange={handleChange} required />
        </label>
        <label>Duration (minutes):
          <input type="number" name="duration" value={formData.duration} onChange={handleChange} required />
        </label>
        <label>Price (₹):
          <input type="number" name="price" value={formData.price} onChange={handleChange} required />
        </label>
        <button type="submit">{formData._id ? 'Update' : 'Add'} Service</button>
      </form>

      <div className="service-list">
        <h2>All Services</h2>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Description</th>
              <th>Duration</th>
              <th>Price</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {services.map(service => (
              <tr key={service._id}>
                <td>{service.name}</td>
                <td>{service.description}</td>
                <td>{service.duration} mins</td>
                <td>₹{service.price}</td>
                <td>
                  <button onClick={() => handleEdit(service)}>Edit</button>
                  <button onClick={() => handleDelete(service._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Services;
