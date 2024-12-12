const Reservation = require("../models/Reservation");
const Event = require("../models/Event");
const reservationService = require("../services/reservationService");
const emailService = require("../services/emailService");

const createReservation = async (req, res) => {
  try {
    const { eventId, numberOfSeats } = req.body;
    const userId = req.user.id;
    // console.log(
    //   "eventId, userId, numberOfSeats",
    //   eventId,
    //   userId,
    //   numberOfSeats
    // );
    const reservation = await reservationService.createReservation(
      eventId,
      userId,
      numberOfSeats
    );

    console.log("reservation", reservation);
    // Send confirmation email
    if (process.env.NODE_ENV !== "test") {
      await emailService.sendReservationConfirmation(
        req.user.email,
        reservation
      );
    }
    // console.log("req.user.email, reservation", req.user.email, reservation);

    res.status(201).json(reservation);
  } catch (error) {
    res.status(400);
    throw error;
  }
};

const getUserReservations = async (req, res) => {
  try {
    const reservations = await Reservation.find({
      userId: req.user.id,
    }).populate("eventId");
    res.json(reservations);
  } catch (error) {
    res.status(400);
    throw error;
  }
};

module.exports = {
  createReservation,
  getUserReservations,
};
