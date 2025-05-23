// models/Expense.js
import mongoose from 'mongoose';

const expenseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  expenseDate: {
    type: Date,
    required: true,
  },
}, {
  timestamps: true,
});

const Expense = mongoose.model('Expense', expenseSchema);
export default Expense;
