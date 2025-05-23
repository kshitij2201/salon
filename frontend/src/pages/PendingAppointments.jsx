import { useEffect, useState } from 'react';
import axios from 'axios';
import '../../assets/css/PendingAmountDetails.css';

function PendingAppointments() {
  const [pendingAppointments, setPendingAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState('all');

  const months = [
    'all',
    'january', 'february', 'march', 'april',
    'may', 'june', 'july', 'august',
    'september', 'october', 'november', 'december'
  ];

  useEffect(() => {
    const fetchPendingAppointments = async () => {
      try {
        const res = await axios.get('https://salon-one-rose.vercel.app/api/appointments');
        const pending = res.data.filter((appt) => appt.paymentStatus !== 'paid');
        setPendingAppointments(pending);
      } catch (err) {
        console.error('Error fetching pending appointments:', err);
      }
    };

    fetchPendingAppointments();
  }, []);

  useEffect(() => {
    if (selectedMonth === 'all') {
      setFilteredAppointments(pendingAppointments);
    } else {
      const monthIndex = months.indexOf(selectedMonth) - 1;
      const filtered = pendingAppointments.filter((appt) => {
        const date = new Date(appt.appointmentTime);
        return date.getMonth() === monthIndex;
      });
      setFilteredAppointments(filtered);
    }
  }, [selectedMonth, pendingAppointments]);

  return (
    <div className="admin-dashboard">
      <h1>Pending Payments</h1>

      {/* Month Filter */}
      <div className="month-filter">
        <label htmlFor="month">Filter by Month:</label>
        <select
          id="month"
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
        >
          {months.map((m) => (
            <option key={m} value={m}>
              {m.charAt(0).toUpperCase() + m.slice(1)}
            </option>
          ))}
        </select>
      </div>

      <div className="appointment-table">
        <table>
          <thead>
            <tr>
              <th>Customer</th>
              <th>Phone</th>
              <th>Stylist</th>
              <th>Services</th>
              <th>Date & Time</th>
              <th>Amount</th>
              <th>Payment</th>
            </tr>
          </thead>
          <tbody>
            {filteredAppointments.map((appt) => (
              <tr key={appt._id}>
                <td>{appt.customerName}</td>
                <td>{appt.phone}</td>
                <td>{appt.stylistName}</td>
                <td>
                  <ul>
                    {appt.services.map((s, index) => (
                      <li key={index}>{s.name}</li>
                    ))}
                  </ul>
                </td>
                <td>{new Date(appt.appointmentTime).toLocaleString()}</td>
                <td>₹{appt.totalPrice || 0}</td>
                <td>
                  <span className={appt.paymentStatus === 'paid' ? 'paid' : 'not-paid'}>
                    {appt.paymentStatus}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default PendingAppointments;
