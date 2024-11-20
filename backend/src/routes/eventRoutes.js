const express = require("express");
const router = express.Router();
const { protect, isAdmin } = require("../middleware/auth");
const {
  createEvent,
  updateEvent,
  deleteEvent,
  getEvents,
  getEventById,
  searchEvents,
} = require("../controllers/eventController");
const { searchLimiter } = require("../middleware/rateLimiter");

router.route("/").get(getEvents).post(protect, isAdmin, createEvent);

// Apply search rate limiter to search endpoint
router.get("/search", searchLimiter, searchEvents);

router
  .route("/:id")
  .get(getEventById)
  .put(protect, isAdmin, updateEvent)
  .delete(protect, isAdmin, deleteEvent);

module.exports = router;
