const mongoose = require("mongoose");
const Event = require("../models/Event");
const Reservation = require("../models/Reservation");

const createReservation = async (eventId, userId, numberOfSeats) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const event = await Event.findById(eventId).session(session);
    // console.log("event before update", event);

    if (!event) {
      throw new Error("Event not found");
    }

    if (event.availableSeats < numberOfSeats) {
      throw new Error("Insufficient seats available");
    }

    // Update event with optimistic locking
    const updatedEvent = await Event.findOneAndUpdate(
      {
        _id: eventId,
        version: event.version,
        availableSeats: { $gte: numberOfSeats },
      },
      {
        $inc: {
          availableSeats: -numberOfSeats,
          version: 1,
        },
      },
      { new: true, session }
    );

    if (!updatedEvent) {
      throw new Error("Concurrent booking detected, please try again");
    }

    // Create reservation
    const reservation = await Reservation.create(
      [
        {
          eventId,
          userId,
          numberOfSeats,
          status: "confirmed",
          totalPrice: event.price * numberOfSeats,
        },
      ],
      { session }
    );
    // console.log("reservation", reservation[0]);
    await session.commitTransaction();
    return reservation[0];
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

module.exports = {
  createReservation,
};
