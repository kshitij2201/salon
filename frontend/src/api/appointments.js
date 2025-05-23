// src/api/appointments.js
import axios from 'axios';

// Base URL for your backend API
const BASE_URL = 'http://salon-one-rose.vercel.app/api';

// Get all appointments (for Admin)
export const getAppointments = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/appointments`);
    return response.data; // returns the list of appointments
  } catch (error) {
    console.error('Error fetching appointments:', error);
    throw error;
  }
};

// Get a specific appointment by ID
export const getAppointmentById = async (id) => {
  try {
    const response = await axios.get(`${BASE_URL}/appointments/${id}`);
    return response.data; // returns the details of the appointment
  } catch (error) {
    console.error(`Error fetching appointment with ID ${id}:`, error);
    throw error;
  }
};

// Create a new appointment (for Customers)
export const createAppointment = async (appointmentData) => {
  try {
    const response = await axios.post(`${BASE_URL}/appointments`, appointmentData);
    return response.data; // returns the newly created appointment
  } catch (error) {
    console.error('Error creating appointment:', error);
    throw error;
  }
};

// Update an existing appointment (for Admin)
export const updateAppointment = async (id, appointmentData) => {
  try {
    const response = await axios.put(`${BASE_URL}/appointments/${id}`, appointmentData);
    return response.data; // returns the updated appointment
  } catch (error) {
    console.error(`Error updating appointment with ID ${id}:`, error);
    throw error;
  }
};

// Cancel an appointment (for Admin)
export const cancelAppointment = async (id) => {
  try {
    const response = await axios.delete(`${BASE_URL}/appointments/${id}`);
    return response.data; // returns a success message or confirmation
  } catch (error) {
    console.error(`Error canceling appointment with ID ${id}:`, error);
    throw error;
  }
};

// Update payment status (for Admin or during booking)
export const updatePaymentStatus = async (id, paymentStatus) => {
  try {
    const response = await axios.patch(`${BASE_URL}/appointments/${id}/payment`, { paymentStatus });
    return response.data; // returns the updated appointment with new payment status
  } catch (error) {
    console.error(`Error updating payment status for appointment ${id}:`, error);
    throw error;
  }
};
