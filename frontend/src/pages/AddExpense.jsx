import { useState } from 'react';
import '../../assets/css/AddExpense.css';
import { addExpense } from '../api/expenses';

function AddExpense() {
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [expenseDate, setExpenseDate] = useState('');
  const [showModal, setShowModal] = useState(false); // for modal popup

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await addExpense({ title, amount, expenseDate });
      setTitle('');
      setAmount('');
      setExpenseDate('');
      setShowModal(true); // show success modal
    } catch (error) {
      console.error(error);
      alert('Failed to add expense');
    }
  };

  return (
    <div className="add-expense-page">
      <h2>Add Expense</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Title:</label>
          <input value={title} onChange={(e) => setTitle(e.target.value)} required />
        </div>
        <div>
          <label>Amount:</label>
          <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} required />
        </div>
        <div>
          <label>Date:</label>
          <input type="date" value={expenseDate} onChange={(e) => setExpenseDate(e.target.value)} required />
        </div>
        <button type="submit">Add Expense</button>
      </form>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Expense Added Successfully!</h3>
            <button onClick={() => setShowModal(false)}>OK</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default AddExpense;
