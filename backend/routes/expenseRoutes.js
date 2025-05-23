// routes/expenseRoutes.js
import express from 'express';
import { addExpense, getAllExpenses, updateExpense, deleteExpense } from '../controllers/expenseController.js';

const router = express.Router();

router.post('/add', addExpense);
router.get('/all', getAllExpenses);
router.put('/update/:id', updateExpense);  // <== added
router.delete('/delete/:id', deleteExpense); // <== added

export default router;
