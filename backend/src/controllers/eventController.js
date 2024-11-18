const Event = require("../models/Event");
const { validateSearchParams } = require("../utils/validation");
const mongoose = require("mongoose");

const createEvent = async (req, res) => {
  try {
    const { title, description, date, totalSeats, price } = req.body;

    const event = await Event.create({
      title,
      description,
      date,
      totalSeats,
      availableSeats: totalSeats,
      price,
    });

    res.status(201).json(event);
  } catch (error) {
    res.status(400);
    throw error;
  }
};

const updateEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      res.status(404);
      throw new Error("Event not found");
    }

    const updatedEvent = await Event.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(updatedEvent);
  } catch (error) {
    res.status(400);
    throw error;
  }
};

const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      res.status(404);
      throw new Error("Event not found");
    }

    await event.deleteOne();
    res.json({ message: `Event ${event.title} removed` });
  } catch (error) {
    res.status(400);
    throw error;
  }
};

const getEvents = async (req, res) => {
  console.log("getEvents request received");
  try {
    // Check if mongoose is connected
    if (mongoose.connection.readyState !== 1) {
      throw new Error("Database not connected");
    }

    const events = await Event.find({});
    console.log("events", events);
    res.json(events);
  } catch (error) {
    console.error("Error in getEvents:", error);
    res.status(500).json({
      message: "Error fetching events",
      error: error.message,
    });
  }
};

const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      res.status(404);
      throw new Error("Event not found");
    }

    res.json(event);
  } catch (error) {
    res.status(400);
    throw error;
  }
};

// const searchEvents = async (req, res) => {
//   console.log("searchEvents request received");
//   // res.json(req.query);
// };

const searchEvents = async (req, res) => {
  try {
    console.log("searchEvents request received", req.query);
    const {
      query,
      startDate,
      endDate,
      minPrice,
      maxPrice,
      hasAvailableSeats,
      limit = 10,
      skip = 0,
    } = req.query;

    // Validate search parameters
    const validationError = validateSearchParams(req.query);
    if (validationError) {
      res.status(400);
      throw new Error(validationError);
    }

    // Build filter object
    const filter = {};

    if (query) {
      filter.$or = [
        { title: { $regex: query, $options: "i" } },
        { description: { $regex: query, $options: "i" } },
      ];
    }

    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate) filter.date.$lte = new Date(endDate);
    }

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    if (hasAvailableSeats === "true") {
      filter.availableSeats = { $gt: 0 };
    }

    // Execute query with pagination
    const [events, total] = await Promise.all([
      Event.find(filter)
        .sort({ date: 1 })
        .limit(Number(limit))
        .skip(Number(skip)),
      Event.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(total / limit);
    const currentPage = Math.floor(skip / limit) + 1;

    res.json({
      events,
      total,
      page: currentPage,
      totalPages,
    });
  } catch (error) {
    res.status(400);
    throw error;
  }
};

module.exports = {
  createEvent,
  updateEvent,
  deleteEvent,
  getEvents,
  getEventById,
  searchEvents,
};
