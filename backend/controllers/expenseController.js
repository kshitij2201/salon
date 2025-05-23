// controllers/expenseController.js
import Expense from '../models/Expense.js';

// Add a new expense
export const addExpense = async (req, res) => {
  try {
    const { title, amount, expenseDate } = req.body;

    const newExpense = new Expense({
      title,
      amount,
      expenseDate,
    });

    await newExpense.save();
    res.status(201).json({ message: 'Expense added successfully!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to add expense' });
  }
};

// Get all expenses
export const getAllExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find().sort({ expenseDate: -1 }); // latest first
    res.status(200).json(expenses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch expenses' });
  }
};


// controllers/expenseController.js
// ...

// Update an expense
export const updateExpense = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, amount, expenseDate } = req.body;

    await Expense.findByIdAndUpdate(id, { title, amount, expenseDate });
    res.status(200).json({ message: 'Expense updated successfully!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to update expense' });
  }
};

// Delete an expense
export const deleteExpense = async (req, res) => {
  try {
    const { id } = req.params;
    await Expense.findByIdAndDelete(id);
    res.status(200).json({ message: 'Expense deleted successfully!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to delete expense' });
  }
};
