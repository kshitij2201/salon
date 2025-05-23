import axios from 'axios';

export const getStylists = async () => {
  const res = await axios.get('/api/stylists');
  return res.data;
};

export const addStylist = async (data) => {
  await axios.post('/api/stylists/add', data);
};

export const deleteStylist = async (id) => {
  await axios.delete(`/api/stylists/delete/${id}`);
};

export const reactivateStylist = async (id) => {
  await axios.patch(`/api/stylists/reactivate/${id}`);
};

export const markAttendance = async (id) => {
  await axios.patch(`/api/stylists/attendance/${id}`);
};

export const toggleBreak = async (id) => {
  await axios.patch(`/api/stylists/break/${id}`);
};
