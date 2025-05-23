import { useState, useEffect } from 'react';
import { getStylists, addStylist, deleteStylist, markAttendance, toggleBreak, reactivateStylist } from '../api/stylists';
import '../../assets/css/Stylists.css';
import { saveAs } from 'file-saver';
import axios from 'axios';

function Stylists() {
  const [stylists, setStylists] = useState([]);
  const [newStylist, setNewStylist] = useState({ name: '', phone: '' });

  useEffect(() => {
    fetchStylists();
  }, []);

  const fetchStylists = async () => {
    const data = await getStylists();
    setStylists(data);
  };

  const handleAddStylist = async (e) => {
    e.preventDefault();
    await addStylist(newStylist);
    setNewStylist({ name: '', phone: '' });
    fetchStylists();
  };

  const handleDeleteStylist = async (id) => {
    if (confirm('Are you sure you want to delete this stylist?')) {
      await deleteStylist(id);
      fetchStylists();
    }
  };

  const handleMarkAttendance = async (id) => {
    await markAttendance(id);
    fetchStylists();
  };

  const handleToggleBreak = async (id) => {
    await toggleBreak(id);
    fetchStylists();
  };

  const handleReactivate = async (id) => {
    await reactivateStylist(id);
    fetchStylists();
  };

  const getStatusText = (stylist) => {
    if (stylist.isOnBreak) return 'On Break';
    if (stylist.isPresent) return 'Working';
    return 'Absent';
  };

  const getStatusColor = (stylist) => {
    if (stylist.isOnBreak) return 'orange';
    if (stylist.isPresent) return 'blue';
    return 'red';
  };

  const formatHoursMinutesSeconds = (hoursDecimal) => {
    if (!hoursDecimal) return '0h 0m 0s';
    const totalSeconds = Math.round(hoursDecimal * 3600);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours}h ${minutes}m ${seconds}s`;
  };

  // === ✨ New Functions for Downloading Reports ✨ ===
  const downloadDailyReport = async () => {
    try {
      const response = await axios.get('https://salon-one-rose.vercel.app/api/reports/daily', { responseType: 'blob' });
      const today = new Date().toISOString().split('T')[0];
      saveAs(response.data, `Daily_Attendance_${today}.csv`);
    } catch (error) {
      console.error('Error downloading daily report:', error);
    }
  };
  
  const downloadMonthlyReport = async () => {
    try {
      const today = new Date();
      const month = (today.getMonth() + 1).toString().padStart(2, '0');
      const year = today.getFullYear();
      const response = await axios.get(`https://salon-one-rose.vercel.app/api/reports/monthly?month=${month}&year=${year}`, { responseType: 'blob' });
      saveAs(response.data, `Monthly_Attendance_${month}_${year}.csv`);
    } catch (error) {
      console.error('Error downloading monthly report:', error);
    }
  };
  
  // ===================================================

  return (
    <div className="stylists-page">
      <h2>Manage Stylists</h2>

      {/* ✨ Download Buttons */}
      <div className="download-buttons">
        <button onClick={downloadDailyReport}>Download Daily Report 📄</button>
        <button onClick={downloadMonthlyReport}>Download Monthly Report 📆</button>
      </div>

      {/* Add Stylist Form */}
      <form onSubmit={handleAddStylist} className="add-stylist-form">
        <input
          type="text"
          placeholder="Stylist Name"
          value={newStylist.name}
          onChange={(e) => setNewStylist({ ...newStylist, name: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Phone Number"
          value={newStylist.phone}
          onChange={(e) => setNewStylist({ ...newStylist, phone: e.target.value })}
          required
        />
        <button type="submit">Add Stylist</button>
      </form>

      {/* Active Stylists Table */}
      <h3>Active Stylists</h3>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Phone</th>
            <th>Today's Status</th>
            <th>Hours Worked (Today)</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {stylists.filter(s => s.isActive).map((stylist) => (
            <tr key={stylist._id}>
              <td>{stylist.name}</td>
              <td>{stylist.phone}</td>
              <td style={{ color: getStatusColor(stylist) }}>{getStatusText(stylist)}</td>
              <td>{formatHoursMinutesSeconds(stylist.hoursWorkedToday)}</td>
              <td>
                <button onClick={() => handleMarkAttendance(stylist._id)}>
                  {stylist.isPresent ? 'Mark Absent' : 'Mark Present'}
                </button>

                {stylist.isPresent && (
                  <button onClick={() => handleToggleBreak(stylist._id)}>
                    {stylist.isOnBreak ? 'Resume Work' : 'Take Break'}
                  </button>
                )}

                <button onClick={() => handleDeleteStylist(stylist._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Deleted Stylists Table */}
      <h3>Deleted Stylists</h3>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Phone</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {stylists.filter(s => !s.isActive).map((stylist) => (
            <tr key={stylist._id}>
              <td>{stylist.name}</td>
              <td>{stylist.phone}</td>
              <td>
                <button onClick={() => handleReactivate(stylist._id)}>Re-Add Stylist</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Stylists;
