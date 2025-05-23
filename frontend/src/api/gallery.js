// src/api/gallery.js
import axios from 'axios';

// Base URL for your backend API
const BASE_URL = 'http://salon-one-rose.vercel.app/api';

// Get all gallery images (for customers to view)
export const getGalleryImages = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/gallery`);
    return response.data; // returns a list of gallery images
  } catch (error) {
    console.error('Error fetching gallery images:', error);
    throw error;
  }
};

// Upload a new gallery image (for Admin)
export const uploadGalleryImage = async (imageData) => {
  try {
    const formData = new FormData();
    formData.append('image', imageData); // Append the image to FormData
    const response = await axios.post(`${BASE_URL}/gallery/upload`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data; // returns the uploaded image details
  } catch (error) {
    console.error('Error uploading gallery image:', error);
    throw error;
  }
};
