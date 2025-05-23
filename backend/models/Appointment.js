import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema(
  {
    services: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Service", // references the Service model
        required: true,
      }
    ],
    customerName: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
      match: /^[0-9]{10}$/, // ensure only 10-digit numbers
    },
    email: {
      type: String,
      required: true,
    },
    appointmentTime: {
      type: Date,
      required: true,
    },
    totalPrice: {
      type: Number,
      required: true,
    },
    workDone: { 
      type: Boolean, 
      default: false,
    },
    paymentStatus: {
      type: String,
      enum: ["paid", "not paid"],
      default: "not paid",
    },
    notes: {
      type: String,
      default: "",
    },
    stylistName: {
      type: String,
      required: false, // set to true if you want it mandatory
    },
  },
  {
    timestamps: true, // adds createdAt and updatedAt fields
  }
);

const Appointment = mongoose.model("Appointment", appointmentSchema);
export default Appointment;
