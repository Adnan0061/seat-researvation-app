const nodemailer = require("nodemailer");

// const transporter = nodemailer.createTransport({
//   host: process.env.EMAIL_HOST,
//   port: process.env.EMAIL_PORT,
//   secure: false,
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS,
//   },
// });

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER_GMAIL,
    pass: process.env.EMAIL_PASS_GMAIL,
  },
});

const sendReservationConfirmation = async (user, reservation) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: "Reservation Confirmation",
      html: `
                <h1>Reservation Confirmation</h1>
                <p>Hi, ${user.name}</p>
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
