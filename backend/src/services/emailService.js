const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendReservationConfirmation = async (userEmail, reservation) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: userEmail,
      subject: "Reservation Confirmation",
      html: `
                <h1>Reservation Confirmation</h1>
                <p>Your reservation has been confirmed!</p>
                <p>Number of seats: ${reservation.numberOfSeats}</p>
                <p>Total price: $${reservation.totalPrice}</p>
                <p>Thank you for your reservation!</p>
            `,
    });
  } catch (error) {
    console.error("Email sending failed:", error);
    throw new Error("Failed to send confirmation email");
  }
};

module.exports = {
  sendReservationConfirmation,
};
