const nodemailer = require("nodemailer");
const emailService = require("../../../src/services/emailService");

jest.mock("nodemailer");

describe("Email Service", () => {
  let mockTransporter;

  beforeEach(() => {
    mockTransporter = {
      sendMail: jest.fn().mockResolvedValue({ messageId: "test-id" }),
    };
    nodemailer.createTransport.mockReturnValue(mockTransporter);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should send reservation confirmation email", async () => {
    const testEmail = "test@example.com";
    const testReservation = {
      id: "123",
      event: {
        title: "Test Event",
        date: new Date("2024-12-31"),
      },
      numberOfSeats: 2,
      totalPrice: 100,
    };

    await emailService.sendReservationConfirmation(testEmail, testReservation);

    expect(mockTransporter.sendMail).toHaveBeenCalledWith(
      expect.objectContaining({
        to: testEmail,
        subject: expect.stringContaining("Reservation Confirmation"),
      })
    );
  });

  it("should handle email sending errors", async () => {
    mockTransporter.sendMail.mockRejectedValue(
      new Error("Email sending failed")
    );

    await expect(
      emailService.sendReservationConfirmation("test@example.com", {})
    ).rejects.toThrow("Failed to send confirmation email");
  });
});
