import { useEffect, useState } from 'react';
import axios from 'axios';
import { getAllExpenses } from '../api/expenses';
import * as XLSX from 'xlsx';
import '../../assets/css/Summary2025.css'; 

function Summary2025() {
  const [summaryData, setSummaryData] = useState([]);
  const [yearlySummary, setYearlySummary] = useState({ totalEarnings: 0, totalExpenses: 0, closingBalance: 0 });

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  useEffect(() => {
    fetchSummary();
  }, []);

  const fetchSummary = async () => {
    try {
      const appointmentsRes = await axios.get('https://salon-one-rose.vercel.app/api/appointments');
      const expensesRes = await getAllExpenses();

      const appointments = appointmentsRes.data;
      const expenses = expensesRes;

      const monthlySummary = [];
      const year = 2025;  // fixed to 2025

      let prevClosingBalance = 0;
      let totalEarnings = 0;
      let totalExpenses = 0;

      for (let monthIndex = 0; monthIndex < 12; monthIndex++) {
        // Appointments - Earnings
        const monthlyAppointments = appointments.filter(appt => {
          const date = new Date(appt.appointmentTime);
          return date.getFullYear() === year && date.getMonth() === monthIndex && appt.paymentStatus === 'paid';
        });
        const monthlyEarnings = monthlyAppointments.reduce((sum, appt) => sum + (Number(appt.totalPrice) || 0), 0);

        // Expenses
        const monthlyExpenses = expenses.filter(exp => {
          const date = new Date(exp.expenseDate);
          return date.getFullYear() === year && date.getMonth() === monthIndex;
        });
        const monthlyExpenseTotal = monthlyExpenses.reduce((sum, exp) => sum + (Number(exp.amount) || 0), 0);

        const closingBalance = prevClosingBalance + monthlyEarnings - monthlyExpenseTotal;

        monthlySummary.push({
          month: months[monthIndex],
          openingBalance: prevClosingBalance,
          totalEarnings: monthlyEarnings,
          totalExpenses: monthlyExpenseTotal,
          closingBalance: closingBalance
        });

        // Update for next month
        prevClosingBalance = closingBalance;
        totalEarnings += monthlyEarnings;
        totalExpenses += monthlyExpenseTotal;
      }

      setSummaryData(monthlySummary);
      setYearlySummary({
        totalEarnings,
        totalExpenses,
        closingBalance: prevClosingBalance
      });

    } catch (err) {
      console.error('Error fetching summary:', err);
    }
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(summaryData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Yearly Summary 2025');
    XLSX.writeFile(workbook, 'Yearly_Summary_2025.xlsx');
  };

  return (
    <div className="summary-2025-page">
      <h1>Summary 2025</h1>

      <table>
        <thead>
          <tr>
            <th>Month</th>
            <th>Opening Balance</th>
            <th>Total Earnings</th>
            <th>Total Expenses</th>
            <th>Closing Balance</th>
          </tr>
        </thead>
        <tbody>
          {summaryData.map((month, idx) => (
            <tr key={idx}>
              <td>{month.month}</td>
              <td>₹{month.openingBalance.toLocaleString()}</td>
              <td>₹{month.totalEarnings.toLocaleString()}</td>
              <td>₹{month.totalExpenses.toLocaleString()}</td>
              <td>₹{month.closingBalance.toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr className="yearly-summary">
            <td><strong>Yearly Total</strong></td>
            <td></td>
            <td><strong>₹{yearlySummary.totalEarnings.toLocaleString()}</strong></td>
            <td><strong>₹{yearlySummary.totalExpenses.toLocaleString()}</strong></td>
            <td><strong>₹{yearlySummary.closingBalance.toLocaleString()}</strong></td>
          </tr>
        </tfoot>
      </table>

      <button onClick={exportToExcel}>Export to Excel</button>
    </div>
  );
}

export default Summary2025;
