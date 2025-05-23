// src/api/services.js
import axios from 'axios';

// Base URL for your backend API
const BASE_URL = 'http://localhost:5000/api';

// Get all services
export const getServices = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/services`);
    return response.data; // returns the list of services
  } catch (error) {
    console.error('Error fetching services:', error);
    throw error;
  }
};

// Get a specific service by ID
export const getServiceById = async (id) => {
  try {
    const response = await axios.get(`${BASE_URL}/services/${id}`);
    return response.data; // returns the details of the service
  } catch (error) {
    console.error(`Error fetching service with ID ${id}:`, error);
    throw error;
  }
};

// Add a new service (for Admin)
export const addService = async (serviceData) => {
  try {
    const response = await axios.post(`${BASE_URL}/services`, serviceData);
    return response.data; // returns the newly created service
  } catch (error) {
    console.error('Error adding service:', error);
    throw error;
  }
};

// Update an existing service (for Admin)
export const updateService = async (id, serviceData) => {
  try {
    const response = await axios.put(`${BASE_URL}/services/${id}`, serviceData);
    return response.data; // returns the updated service
  } catch (error) {
    console.error(`Error updating service with ID ${id}:`, error);
    throw error;
  }
};

// Delete a service (for Admin)
export const deleteService = async (id) => {
  try {
    const response = await axios.delete(`${BASE_URL}/services/${id}`);
    return response.data; // returns a success message or confirmation
  } catch (error) {
    console.error(`Error deleting service with ID ${id}:`, error);
    throw error;
  }
};
