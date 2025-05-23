import { useEffect, useState } from 'react';
import { getAllExpenses, deleteExpense, updateExpense } from '../api/expenses';
import * as XLSX from 'xlsx';
import '../../assets/css/ViewExpenses.css'; // CSS for modals

function ViewExpenses() {
  const [expenses, setExpenses] = useState([]);
  const [editingExpense, setEditingExpense] = useState(null);
  const [formData, setFormData] = useState({ title: '', amount: '', expenseDate: '' });
  const [showModal, setShowModal] = useState({ visible: false, message: '' });
  const [selectedMonth, setSelectedMonth] = useState('All');

  const months = [
    'All', 'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    const data = await getAllExpenses();
    setExpenses(data);
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this expense?')) {
      await deleteExpense(id);
      fetchExpenses();
      setShowModal({ visible: true, message: 'Expense deleted successfully!' });
    }
  };

  const handleEditClick = (expense) => {
    setEditingExpense(expense._id);
    setFormData({
      title: expense.title,
      amount: expense.amount,
      expenseDate: expense.expenseDate.split('T')[0],
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    await updateExpense(editingExpense, formData);
    setEditingExpense(null);
    fetchExpenses();
    setShowModal({ visible: true, message: 'Expense updated successfully!' });
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(expenses);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Expenses');
    XLSX.writeFile(workbook, 'expenses.xlsx');
  };

  const filteredExpenses = expenses.filter((exp) => {
    if (selectedMonth === 'All') return true;
    const expenseDate = new Date(exp.expenseDate);
    return expenseDate.toLocaleString('default', { month: 'long' }) === selectedMonth;
  });

  return (
    <div className="view-expenses-page">
      <h2>All Expenses</h2>

      <div className="filter-section">
        <label>Filter by Month: </label>
        <select value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)}>
          {months.map((month, idx) => (
            <option key={idx} value={month}>{month}</option>
          ))}
        </select>
        <button onClick={exportToExcel} style={{ marginLeft: '10px' }}>Export to Excel</button>
      </div>

      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Amount</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredExpenses.map((exp) => (
            <tr key={exp._id}>
              <td>{exp.title}</td>
              <td>₹{Number(exp.amount).toLocaleString()}</td>
              <td>{new Date(exp.expenseDate).toLocaleDateString()}</td>
              <td>
                <button onClick={() => handleEditClick(exp)}>Edit</button>
                <button onClick={() => handleDelete(exp._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Edit Form */}
      {editingExpense && (
        <div className="edit-form">
          <h3>Edit Expense</h3>
          <form onSubmit={handleUpdate}>
            <input
              type="text"
              placeholder="Title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
            <input
              type="number"
              placeholder="Amount"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              required
            />
            <input
              type="date"
              value={formData.expenseDate}
              onChange={(e) => setFormData({ ...formData, expenseDate: e.target.value })}
              required
            />
            <button type="submit">Update</button>
            <button type="button" onClick={() => setEditingExpense(null)}>Cancel</button>
          </form>
        </div>
      )}

      {/* Success Modal */}
      {showModal.visible && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>{showModal.message}</h3>
            <button onClick={() => setShowModal({ visible: false, message: '' })}>OK</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ViewExpenses;
