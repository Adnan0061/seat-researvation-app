const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const {
  createReservation,
  getUserReservations,
} = require("../controllers/reservationController");

router
  .route("/")
  .post(protect, createReservation)
  .get(protect, getUserReservations);

module.exports = router;
