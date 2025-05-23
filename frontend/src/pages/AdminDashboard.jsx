import { useEffect, useState } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';
import '../../assets/css/AdminDashboard.css';

function AdminDashboard() {
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [filter, setFilter] = useState('all');
  const [stylistNames, setStylistNames] = useState([]);
  const [stylistFilter, setStylistFilter] = useState('all');
  const [services, setServices] = useState([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  useEffect(() => {
    fetchAppointments();
    fetchServices();
  }, []);

  useEffect(() => {
    filterAppointments();
  }, [appointments, filter, stylistFilter]);

  const fetchAppointments = async () => {
    try {
      const res = await axios.get('https://salon-one-rose.vercel.app/api/appointments');
      setAppointments(res.data);
      setFilteredAppointments(res.data);
      populateStylistFilter(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchServices = async () => {
    try {
      const res = await axios.get('https://salon-one-rose.vercel.app/api/services');
      setServices(res.data);
    } catch (err) {
      console.error('Error fetching services', err);
    }
  };

  const togglePaymentStatus = async (id, currentStatus) => {
    try {
      const newStatus = currentStatus === 'paid' ? 'not paid' : 'paid';
      console.log(`Toggling payment status for appointment ${id}: ${currentStatus} → ${newStatus}`);
      await axios.put(`https://salon-one-rose.vercel.app/api/appointments/${id}`, {
        paymentStatus: newStatus
      });
      fetchAppointments();
    } catch (err) {
      console.error(err);
    }
  };

  const toggleWorkDone = async (id, currentStatus) => {
    try {
      const newStatus = !currentStatus;
      console.log(`Toggling work done status for appointment ${id}: ${currentStatus} → ${newStatus}`);
      await axios.put(`https://salon-one-rose.vercel.app/api/appointments/${id}`, {
        workDone: newStatus
      });
      fetchAppointments();
    } catch (err) {
      console.error(err);
    }
  };

  const handleStylistChange = (apptId, newStylistName) => {
    console.log(`Changing stylist for appointment ${apptId} to ${newStylistName}`);
    setStylistNames((prevState) => ({
      ...prevState,
      [apptId]: newStylistName,
    }));

    axios
      .put(`https://salon-one-rose.vercel.app/api/appointments/${apptId}`, {
        stylistName: newStylistName,
      })
      .then(() => {
        fetchAppointments();
      })
      .catch((err) => {
        console.error('Error updating stylist', err);
      });
  };

  const filterByDate = (e) => {
    setFilter(e.target.value);
  };

  const filterByStylist = (e) => {
    setStylistFilter(e.target.value);
  };

  const populateStylistFilter = (appointments) => {
    const stylistSet = new Set(appointments.map((appt) => appt.stylistName));
    setStylistNames(Array.from(stylistSet));
  };

  const filterAppointments = () => {
    const now = new Date();
    const startOfDay = new Date(now);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(now);
    endOfDay.setHours(23, 59, 59, 999);

    let filtered = [...appointments];

    if (filter === 'today') {
      filtered = filtered.filter((appt) => {
        const apptDate = new Date(appt.appointmentTime);
        return apptDate >= startOfDay && apptDate <= endOfDay;
      });
    } else if (filter === 'month') {
      filtered = filtered.filter((appt) => {
        const apptDate = new Date(appt.appointmentTime);
        return (
          apptDate.getMonth() === now.getMonth() &&
          apptDate.getFullYear() === now.getFullYear()
        );
      });
    } else if (filter === 'year') {
      filtered = filtered.filter((appt) => {
        const apptDate = new Date(appt.appointmentTime);
        return apptDate.getFullYear() === now.getFullYear();
      });
    }

    if (stylistFilter !== 'all') {
      filtered = filtered.filter((appt) => appt.stylistName === stylistFilter);
    }

    setFilteredAppointments(filtered);
  };

  const exportToExcel = () => {
    const data = filteredAppointments.map((appt) => ({
      Customer: appt.customerName,
      Phone: appt.phone,
      Services: appt.services.map((s) => s.name).join(', '),
      DateTime: new Date(appt.appointmentTime).toLocaleString(),
      Amount: appt.totalPrice,
      PaymentStatus: appt.paymentStatus,
      WorkDone: appt.workDone ? 'Done' : 'Not Done',
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Appointments');
    XLSX.writeFile(workbook, 'Appointments.xlsx');
  };

  const handleEditClick = (appointment) => {
    console.log(`Opening modal to edit appointment:`, appointment);
    setSelectedAppointment(appointment);
    setIsEditModalOpen(true);
  };

  const handleModalChange = (e) => {
    const { name, value } = e.target;
    console.log(`Editing field ${name}: ${value}`);
    setSelectedAppointment((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const calculateTotalPrice = (services) => {
    return services.reduce((total, service) => total + service.price, 0);
  };

  const handleAddService = (e) => {
    const serviceId = e.target.value;
    const selected = services.find((s) => s._id === serviceId);
    if (
      selected &&
      !selectedAppointment.services.find((s) => s._id === serviceId)
    ) {
      console.log(`Adding service: ${selected.name} to appointment ${selectedAppointment._id}`);
      const updatedServices = [...selectedAppointment.services, selected];
      const updatedTotalPrice = calculateTotalPrice(updatedServices);

      setSelectedAppointment((prev) => ({
        ...prev,
        services: updatedServices,
        totalPrice: updatedTotalPrice,
      }));
    }
  };

  const handleRemoveService = (id) => {
    const removedService = selectedAppointment.services.find((s) => s._id === id);
    console.log(`Removing service: ${removedService.name} from appointment ${selectedAppointment._id}`);
    const updatedServices = selectedAppointment.services.filter((s) => s._id !== id);
    const updatedTotalPrice = calculateTotalPrice(updatedServices);

    setSelectedAppointment((prev) => ({
      ...prev,
      services: updatedServices,
      totalPrice: updatedTotalPrice,
    }));
  };

  const handleModalSave = async () => {
    console.log('Saving changes for appointment:', selectedAppointment);
    try {
      await axios.put(`https://salon-one-rose.vercel.app/api/appointments/${selectedAppointment._id}`, {
        customerName: selectedAppointment.customerName,
        phone: selectedAppointment.phone,
        stylistName: selectedAppointment.stylistName,
        services: selectedAppointment.services.map((s) => s._id), // Store only service IDs
        totalPrice: selectedAppointment.totalPrice, // Save updated total price
      });
      fetchAppointments();
      setIsEditModalOpen(false);
      setSelectedAppointment(null);
    } catch (err) {
      console.error('Failed to save changes', err);
    }
  };

  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>

      <div className="dashboard-controls">
        <select onChange={filterByDate} value={filter}>
          <option value="all">All</option>
          <option value="today">Today</option>
          <option value="month">This Month</option>
          <option value="year">This Year</option>
        </select>

        <select onChange={filterByStylist} value={stylistFilter}>
          <option value="all">All Stylists</option>
          {stylistNames.map((stylist, index) => (
            <option key={index} value={stylist}>
              {stylist}
            </option>
          ))}
        </select>

        <button onClick={exportToExcel}>Export to Excel</button>
      </div>

      <div className="appointment-table">
        <table>
          <thead>
            <tr>
              <th>Customer</th>
              <th>Phone</th>
              <th>Stylist</th>
              <th>Services</th>
              <th>Date & Time</th>
              <th>Amount</th>
              <th>Payment</th>
              <th>Work Done</th>
              <th>Edit</th>
            </tr>
          </thead>
          <tbody>
            {filteredAppointments.map((appt) => (
              <tr key={appt._id}>
                <td>{appt.customerName}</td>
                <td>{appt.phone}</td>
                <td>{appt.stylistName}</td>
                <td>
                  <ul>
                    {appt.services.map((s, index) => (
                      <li key={index}>{s.name}</li>
                    ))}
                  </ul>
                </td>
                <td>{new Date(appt.appointmentTime).toLocaleString()}</td>
                <td>₹{appt.totalPrice || 0}</td>
                <td>
                  <button
                    className={appt.paymentStatus === 'paid' ? 'paid' : 'not-paid'}
                    onClick={() => togglePaymentStatus(appt._id, appt.paymentStatus)}
                  >
                    {appt.paymentStatus}
                  </button>
                </td>
                <td>
                  <button
                    className={appt.workDone ? 'done' : 'not-done'}
                    onClick={() => toggleWorkDone(appt._id, appt.workDone)}
                  >
                    {appt.workDone ? 'Done' : 'Not Done'}
                  </button>
                </td>
                <td>
                  <button onClick={() => handleEditClick(appt)}>Edit</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isEditModalOpen && selectedAppointment && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Edit Appointment</h2>
            <label>
              Customer Name:
              <input
                type="text"
                name="customerName"
                value={selectedAppointment.customerName}
                onChange={handleModalChange}
              />
            </label>
            <label>
              Phone:
              <input
                type="text"
                name="phone"
                value={selectedAppointment.phone}
                onChange={handleModalChange}
              />
            </label>
            <label>
              Stylist:
              <input
                type="text"
                name="stylistName"
                value={selectedAppointment.stylistName}
                onChange={handleModalChange}
              />
            </label>

            <label>
              Add Service:
              <select onChange={handleAddService}>
                <option value="">Select Service</option>
                {services.map((service) => (
                  <option key={service._id} value={service._id}>
                    {service.name} - ₹{service.price}
                  </option>
                ))}
              </select>
            </label>

            <div className="selected-services">
              {selectedAppointment.services.map((service) => (
                <div key={service._id}>
                  <span>{service.name} - ₹{service.price}</span>
                  <button onClick={() => handleRemoveService(service._id)}>Remove</button>
                </div>
              ))}
            </div>

            <p>Total Price: ₹{selectedAppointment.totalPrice}</p>

            <button onClick={handleModalSave}>Save Changes</button>
            <button onClick={() => setIsEditModalOpen(false)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
