import Service from "../models/Service.js";

// Create a new service
export const createService = async (req, res) => {
  try {
    const { name, description, duration, price } = req.body;

    const newService = new Service({
      name,
      description,
      duration,
      price,
    });

    await newService.save();
    res.status(201).json({ message: "Service created successfully", newService });
  } catch (error) {
    res.status(500).json({ message: "Error creating service", error: error.message });
  }
};

// Get all services
export const getServices = async (req, res) => {
  try {
    const services = await Service.find();
    res.status(200).json(services);
  } catch (error) {
    res.status(500).json({ message: "Error fetching services", error: error.message });
  }
};

// Update a service
export const updateService = async (req, res) => {
  const { id } = req.params;
  const { name, description, duration, price } = req.body;

  try {
    const updatedService = await Service.findByIdAndUpdate(
      id,
      { name, description, duration, price },
      { new: true }
    );

    if (!updatedService) {
      return res.status(404).json({ message: "Service not found" });
    }

    res.status(200).json({ message: "Service updated", updatedService });
  } catch (error) {
    res.status(500).json({ message: "Error updating service", error: error.message });
  }
};

// Delete a service
export const deleteService = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedService = await Service.findByIdAndDelete(id);

    if (!deletedService) {
      return res.status(404).json({ message: "Service not found" });
    }

    res.status(200).json({ message: "Service deleted", deletedService });
  } catch (error) {
    res.status(500).json({ message: "Error deleting service", error: error.message });
  }
};
