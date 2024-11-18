const mongoose = require("mongoose");

const reservationSchema = new mongoose.Schema(
  {
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    numberOfSeats: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled"],
      default: "pending",
    },
    totalPrice: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: function (doc, ret) {
        ret.id = ret._id.toString();
        ret.event = ret.eventId;
        delete ret._id;
        delete ret.eventId;
        delete ret.__v;
        return ret;
      },
    },
  }
);

module.exports = mongoose.model("Reservation", reservationSchema);
