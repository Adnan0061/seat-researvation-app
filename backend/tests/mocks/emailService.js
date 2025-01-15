const mockSendMail = jest.fn().mockResolvedValue({ messageId: "test-id" });

const mockEmailService = {
  sendReservationConfirmation: jest
    .fn()
    .mockImplementation(async (email, reservation) => {
      return mockSendMail();
    }),
};

jest.mock("../../src/services/emailService", () => mockEmailService);

module.exports = { mockSendMail, mockEmailService };
