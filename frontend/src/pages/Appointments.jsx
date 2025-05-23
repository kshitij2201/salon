// src/pages/Appointments.jsx
import { useEffect, useState } from 'react';
import axios from 'axios';
import '../../assets/css/Appointments.css';

function Appointments() {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const res = await axios.get('http://salon-one-rose.vercel.app/api/appointments');
      setAppointments(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      await axios.put(`http://salon-one-rose.vercel.app/api/appointments/${id}`, { status });
      fetchAppointments();
    } catch (err) {
      console.error(err);
    }
  };

  const handlePaymentStatus = async (id, paymentStatus) => {
    try {
      await axios.put(`http://salon-one-rose.vercel.app/api/appointments/${id}`, { paymentStatus });
      fetchAppointments();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://salon-one-rose.vercel.app/api/appointments/${id}`);
      fetchAppointments();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="appointments-wrapper">
      <h1>Manage Appointments</h1>

      <div className="appointment-list">
        <h2>Upcoming Appointments</h2>
        <table>
          <thead>
            <tr>
              <th>Customer Name</th>
              <th>Service</th>
              <th>Time</th>
              <th>Status</th>
              <th>Payment Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map(appointment => (
              <tr key={appointment._id}>
                <td>{appointment.customerName}</td>
                <td>{appointment.service.name}</td>
                <td>{new Date(appointment.appointmentTime).toLocaleString()}</td>
                <td>
                  <select
                    value={appointment.status}
                    onChange={(e) => handleUpdateStatus(appointment._id, e.target.value)}
                  >
                    <option value="pending">Pending</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </td>
                <td>
                  <select
                    value={appointment.paymentStatus}
                    onChange={(e) => handlePaymentStatus(appointment._id, e.target.value)}
                  >
                    <option value="not paid">Not Paid</option>
                    <option value="paid">Paid</option>
                  </select>
                </td>
                <td>
                  <button onClick={() => handleDelete(appointment._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Appointments;
