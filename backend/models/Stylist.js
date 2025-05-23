import mongoose from 'mongoose';

const attendanceSchema = new mongoose.Schema({
  date: { type: String }, // YYYY-MM-DD
  loginTime: { type: String },
  logoutTime: { type: String },
  hoursWorked: { type: Number, default: 0 }
});

const stylistSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  isPresent: { type: Boolean, default: false },
  isOnBreak: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  attendanceLogs: [attendanceSchema],
  lastCheckInTime: { type: Date }, // <== NEW: time when present or resumed work
  totalWorkedToday: { type: Number, default: 0 } // <== NEW: cumulative hours today
});

const Stylist = mongoose.model('Stylist', stylistSchema);

export default Stylist;
