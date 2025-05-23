// src/routes/appointmentRoutes.js
import express from "express";
import {
  createAppointment,
  getAppointments,
  updateAppointment,
  cancelAppointment,
  updatePaymentStatus,
  getMonthlySummary, // 🆕 import controller
} from "../controllers/appointmentController.js";

const router = express.Router();

// 🆕 Get monthly + yearly appointment summary (placed first to avoid conflict with /:id)
router.get("/summary", getMonthlySummary);

// Create a new appointment
router.post("/", createAppointment);

// Get all appointments
router.get("/", getAppointments);

// Update payment status
router.put("/:id/payment-status", updatePaymentStatus);

// Update an appointment
router.put("/:id", updateAppointment);

// Cancel/delete an appointment
router.delete("/:id", cancelAppointment);

export default router;
