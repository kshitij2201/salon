import Stylist from '../models/Stylist.js';
import moment from 'moment';

export const getStylists = async (req, res) => {
  try {
    const stylists = await Stylist.find();
    const now = moment();

    const stylistsWithHours = stylists.map(stylist => {
      const today = moment().format('YYYY-MM-DD');
      let hours = stylist.totalWorkedToday || 0;

      // Add elapsed time since last check-in if present and not on break
      if (stylist.isPresent && !stylist.isOnBreak && stylist.lastCheckInTime) {
        const checkInMoment = moment(stylist.lastCheckInTime);
        const elapsed = moment.duration(now.diff(checkInMoment)).asHours();
        hours += elapsed;
      }

      return {
        ...stylist.toObject(),
        hoursWorkedToday: parseFloat(hours.toFixed(2)),
      };
    });

    res.json(stylistsWithHours);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const addStylist = async (req, res) => {
  const { name, phone } = req.body;
  try {
    const newStylist = new Stylist({ name, phone });
    await newStylist.save();
    res.status(201).json(newStylist);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteStylist = async (req, res) => {
  try {
    const stylist = await Stylist.findById(req.params.id);
    if (!stylist) return res.status(404).json({ message: 'Stylist not found' });

    stylist.isActive = false;
    await stylist.save();
    res.json({ message: 'Stylist deleted (soft delete)' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const reactivateStylist = async (req, res) => {
  try {
    const stylist = await Stylist.findById(req.params.id);
    if (!stylist) return res.status(404).json({ message: 'Stylist not found' });

    stylist.isActive = true;
    await stylist.save();
    res.json({ message: 'Stylist reactivated' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const markAttendance = async (req, res) => {
  try {
    const stylist = await Stylist.findById(req.params.id);
    if (!stylist) return res.status(404).json({ message: 'Stylist not found' });

    const now = moment();
    const today = now.format('YYYY-MM-DD');
    const currentLog = stylist.attendanceLogs.find(log => log.date === today);

    if (stylist.isPresent) {
      // Logging out (Absent)
      stylist.isPresent = false;
      stylist.isOnBreak = false;

      if (stylist.lastCheckInTime) {
        const checkInMoment = moment(stylist.lastCheckInTime);
        const duration = moment.duration(now.diff(checkInMoment)).asHours();
        stylist.totalWorkedToday = (stylist.totalWorkedToday || 0) + duration;
        stylist.lastCheckInTime = null;
      }

      if (currentLog && !currentLog.logoutTime) {
        currentLog.logoutTime = now.format('HH:mm');
        currentLog.hoursWorked = parseFloat((stylist.totalWorkedToday || 0).toFixed(2));
      }
    } else {
      // Logging in (Present)
      stylist.isPresent = true;
      stylist.isOnBreak = false;
      stylist.lastCheckInTime = now.toDate();
      stylist.totalWorkedToday = 0;

      stylist.attendanceLogs.push({
        date: today,
        loginTime: now.format('HH:mm'),
      });
    }

    await stylist.save();
    res.json(stylist);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const toggleBreak = async (req, res) => {
  try {
    const stylist = await Stylist.findById(req.params.id);
    if (!stylist) return res.status(404).json({ message: 'Stylist not found' });

    const now = moment();

    if (stylist.isOnBreak) {
      // Resuming work (Break ends)
      if (stylist.lastCheckInTime) {
        const checkInMoment = moment(stylist.lastCheckInTime);
        const duration = moment.duration(now.diff(checkInMoment)).asHours();
        stylist.totalWorkedToday = (stylist.totalWorkedToday || 0) + duration;
      }
      stylist.lastCheckInTime = now.toDate(); // Reset check-in time after break
      stylist.isOnBreak = false;
    } else {
      // Going on break
      if (stylist.lastCheckInTime) {
        const checkInMoment = moment(stylist.lastCheckInTime);
        const duration = moment.duration(now.diff(checkInMoment)).asHours();
        stylist.totalWorkedToday = (stylist.totalWorkedToday || 0) + duration;
      }
      stylist.lastCheckInTime = null; // Reset check-in time while on break
      stylist.isOnBreak = true;
    }

    await stylist.save();
    res.json(stylist);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
