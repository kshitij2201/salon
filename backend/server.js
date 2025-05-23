import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import path from "path"; // For handling file paths
import { fileURLToPath } from "url"; // For getting the directory name

// Import routes
import serviceRoutes from "./routes/serviceRoutes.js";
import appointmentRoutes from "./routes/appointmentRoutes.js";
import galleryRoutes from "./routes/galleryRoutes.js";
import expenseRoutes from './routes/expenseRoutes.js'; // <== this line
import stylistRoutes from "./routes/stylistRoutes.js";
import reportRoutes from './routes/reportRoutes.js';

// Initialize dotenv
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Get the directory name using ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static files (e.g., images) from the "uploads" folder
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("MongoDB Connected"))
.catch((err) => console.log("DB Error:", err));

// Routes
app.use("/api/services", serviceRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/stylists", stylistRoutes);
app.use("/api/gallery", galleryRoutes);
app.use('/api/expenses', expenseRoutes); // <== this line
app.use('/api/stylists', stylistRoutes);
app.use('/api/reports', reportRoutes);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
