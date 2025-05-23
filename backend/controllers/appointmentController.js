import Appointment from "../models/Appointment.js";

// Create a new appointment (supports multiple services)
export const createAppointment = async (req, res) => {
  try {
    const {
      services,
      customerName,
      phone,
      email,
      appointmentTime,
      totalPrice,
      stylistName,
    } = req.body;

    if (!services || !Array.isArray(services) || services.length === 0) {
      return res.status(400).json({ message: "At least one service must be selected." });
    }

    const newAppointment = new Appointment({
      services,
      customerName,
      phone,
      email,
      appointmentTime,
      totalPrice,
      stylistName,
    });

    await newAppointment.save();

    res.status(201).json({
      message: "Appointment created successfully",
      newAppointment,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error creating appointment",
      error: error.message,
    });
  }
};

// Get all appointments
export const getAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .populate("services")
      .sort({ appointmentTime: -1 });

    res.status(200).json(appointments);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching appointments",
      error: error.message,
    });
  }
};

// Update appointment (full edit support)
export const updateAppointment = async (req, res) => {
  const { id } = req.params;

  const {
    services,
    customerName,
    phone,
    email,
    appointmentTime,
    totalPrice,
    stylistName,
    workDone,
    paymentStatus,
  } = req.body;

  try {
    const updatedFields = {};

    if (services) updatedFields.services = services;
    if (customerName) updatedFields.customerName = customerName;
    if (phone) updatedFields.phone = phone;
    if (email) updatedFields.email = email;
    if (appointmentTime) updatedFields.appointmentTime = appointmentTime;
    if (typeof totalPrice === "number") updatedFields.totalPrice = totalPrice;
    if (stylistName) updatedFields.stylistName = stylistName;
    if (typeof workDone === "boolean") updatedFields.workDone = workDone;
    if (paymentStatus) updatedFields.paymentStatus = paymentStatus;

    const updatedAppointment = await Appointment.findByIdAndUpdate(
      id,
      updatedFields,
      { new: true }
    );

    if (!updatedAppointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    res.status(200).json({
      message: "Appointment updated successfully",
      updatedAppointment,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error updating appointment",
      error: error.message,
    });
  }
};

// Update only payment status (used for toggle in admin dashboard)
export const updatePaymentStatus = async (req, res) => {
  const { id } = req.params;
  const { paymentStatus } = req.body;

  try {
    const updatedAppointment = await Appointment.findByIdAndUpdate(
      id,
      { paymentStatus },
      { new: true }
    );

    if (!updatedAppointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    res.status(200).json({
      message: "Payment status updated",
      updatedAppointment,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error updating payment status",
      error: error.message,
    });
  }
};

// Cancel an appointment
export const cancelAppointment = async (req, res) => {
  const { id } = req.params;

  try {
    const cancelledAppointment = await Appointment.findByIdAndUpdate(
      id,
      { status: "cancelled" },
      { new: true }
    );

    if (!cancelledAppointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    res.status(200).json({
      message: "Appointment cancelled",
      cancelledAppointment,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error cancelling appointment",
      error: error.message,
    });
  }
};

// 🆕 Get monthly and yearly summary
export const getMonthlySummary = async (req, res) => {
  try {
    const summary = await Appointment.aggregate([
      {
        $group: {
          _id: {
            month: { $month: "$appointmentTime" },
            year: { $year: "$appointmentTime" }
          },
          totalAppointments: { $sum: 1 },
          totalAmount: { $sum: "$totalPrice" },
          paidAmount: {
            $sum: {
              $cond: [{ $eq: ["$paymentStatus", "Paid"] }, "$totalPrice", 0]
            }
          },
          notPaidAmount: {
            $sum: {
              $cond: [{ $ne: ["$paymentStatus", "Paid"] }, "$totalPrice", 0]
            }
          }
        }
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } }
    ]);

    const yearlyTotal = summary.reduce((acc, item) => {
      acc.totalAppointments += item.totalAppointments;
      acc.totalAmount += item.totalAmount;
      acc.paidAmount += item.paidAmount;
      acc.notPaidAmount += item.notPaidAmount;
      return acc;
    }, {
      totalAppointments: 0,
      totalAmount: 0,
      paidAmount: 0,
      notPaidAmount: 0
    });

    res.json({ summary, yearlyTotal });
  } catch (error) {
    res.status(500).json({
      message: "Error generating summary",
      error: error.message,
    });
  }
};
