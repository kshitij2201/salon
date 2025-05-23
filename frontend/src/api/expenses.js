// src/api/expenses.js
import axios from 'axios';

const API_URL = '/api/expenses';

export const addExpense = async (expenseData) => {
  const res = await axios.post(`${API_URL}/add`, expenseData);
  return res.data;
};

export const getAllExpenses = async () => {
  const res = await axios.get(`${API_URL}/all`);
  return res.data;
};

export const updateExpense = async (id, updatedData) => {
  const res = await axios.put(`${API_URL}/update/${id}`, updatedData);
  return res.data;
};

export const deleteExpense = async (id) => {
  const res = await axios.delete(`${API_URL}/delete/${id}`);
  return res.data;
};
