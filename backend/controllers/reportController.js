// controllers/reportController.js
import { Parser } from 'json2csv';
import Stylist from '../models/Stylist.js';
import moment from 'moment';

export const downloadDailyReport = async (req, res) => {
  try {
    const today = moment().format('YYYY-MM-DD');
    const stylists = await Stylist.find();

    const data = stylists.map(s => {
      const log = s.attendanceLogs.find(l => l.date === today);
      return {
        Name: s.name,
        Phone: s.phone,
        Date: today,
        LoginTime: log?.loginTime || '-',
        LogoutTime: log?.logoutTime || '-',
        HoursWorked: log?.hoursWorked || 0
      };
    });

    const parser = new Parser();
    const csv = parser.parse(data);

    res.header('Content-Type', 'text/csv');
    res.attachment(`Daily_Attendance_${today}.csv`);
    res.send(csv);
  } catch (error) {
    res.status(500).json({ message: 'Failed to generate daily report' });
  }
};


export const downloadMonthlyReport = async (req, res) => {
    try {
      const { month, year } = req.query;
      const stylists = await Stylist.find();
      const monthFormatted = month.padStart(2, '0');
  
      const data = [];
  
      stylists.forEach(s => {
        s.attendanceLogs.forEach(log => {
          const [logYear, logMonth] = log.date.split('-');
          if (logYear === year && logMonth === monthFormatted) {
            data.push({
              Name: s.name,
              Phone: s.phone,
              Date: log.date,
              LoginTime: log.loginTime || '-',
              LogoutTime: log.logoutTime || '-',
              HoursWorked: log.hoursWorked || 0
            });
          }
        });
      });
  
      const parser = new Parser();
      const csv = parser.parse(data);
  
      res.header('Content-Type', 'text/csv');
      res.attachment(`Monthly_Attendance_${year}-${monthFormatted}.csv`);
      res.send(csv);
    } catch (error) {
      res.status(500).json({ message: 'Failed to generate monthly report' });
    }
  };
  