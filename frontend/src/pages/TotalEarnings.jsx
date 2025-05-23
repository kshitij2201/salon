import { useEffect, useState } from 'react';
import axios from 'axios';
import '../../assets/css/TotalEarnings.css';

function TotalEarnings() {
  const [monthlyStats, setMonthlyStats] = useState([]);
  const [yearlyTotal, setYearlyTotal] = useState({
    totalAppointments: 0,
    totalAmount: 0,
    paid: 0,
    notPaid: 0
  });

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  useEffect(() => {
    fetchMonthlyStats();
  }, []);

  const fetchMonthlyStats = async () => {
    try {
      const res = await axios.get('https://salon-one-rose.vercel.app/api/appointments');
      const appointments = res.data;
      const now = new Date();
      const currentYear = now.getFullYear();

      let monthlyData = Array(12).fill(null).map((_, index) => ({
        month: months[index],
        totalAppointments: 0,
        totalAmount: 0,
        paid: 0,
        notPaid: 0
      }));

      let yearlyTotalAppointments = 0;
      let yearlyAmount = 0;
      let yearlyPaid = 0;
      let yearlyNotPaid = 0;

      appointments.forEach((appt) => {
        const date = new Date(appt.appointmentTime);
        const amount = Number(appt.totalPrice) || 0;

        if (date.getFullYear() === currentYear) {
          const monthIndex = date.getMonth();
          const isPaid = appt.paymentStatus === 'paid';

          monthlyData[monthIndex].totalAppointments += 1;
          monthlyData[monthIndex].totalAmount += amount;

          if (isPaid) {
            monthlyData[monthIndex].paid += amount;
          } else {
            monthlyData[monthIndex].notPaid += amount;
          }

          yearlyTotalAppointments += 1;
          yearlyAmount += amount;
          yearlyPaid += isPaid ? amount : 0;
          yearlyNotPaid += !isPaid ? amount : 0;
        }
      });

      setMonthlyStats(monthlyData);
      setYearlyTotal({
        totalAppointments: yearlyTotalAppointments,
        totalAmount: yearlyAmount,
        paid: yearlyPaid,
        notPaid: yearlyNotPaid
      });
    } catch (err) {
      console.error('Error fetching monthly stats:', err);
    }
  };

  return (
    <div className="total-earnings-page">
      <h1>Monthly Earnings Breakdown</h1>
      <table className="earnings-table">
        <thead>
          <tr>
            <th>Month</th>
            <th>Total Appointments</th>
            <th>Total Amount</th>
            <th>Paid</th>
            <th>Not Paid</th>
          </tr>
        </thead>
        <tbody>
          {monthlyStats.map((month, idx) => (
            <tr key={idx}>
              <td>{month.month}</td>
              <td>{month.totalAppointments}</td>
              <td>₹{month.totalAmount.toLocaleString()}</td>
              <td>₹{month.paid.toLocaleString()}</td>
              <td>₹{month.notPaid.toLocaleString()}</td>
            </tr>
          ))}
          <tr className="yearly-total">
            <td><strong>Total (Yearly)</strong></td>
            <td><strong>{yearlyTotal.totalAppointments}</strong></td>
            <td><strong>₹{yearlyTotal.totalAmount.toLocaleString()}</strong></td>
            <td><strong>₹{yearlyTotal.paid.toLocaleString()}</strong></td>
            <td><strong>₹{yearlyTotal.notPaid.toLocaleString()}</strong></td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default TotalEarnings;
