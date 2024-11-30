// const request = require("supertest");
// const app = require("../../src/app");
// const Event = require("../../src/models/Event");
// const { createTestUser, createTestEvent } = require("../utils/testUtils");
// const { mockSendMail } = require("../mocks/emailService");

// describe("Reservation Endpoints", () => {
//   let userToken;
//   let eventId;

//   beforeEach(async () => {
//     const { token } = await createTestUser();
//     userToken = token;
//     const event = await createTestEvent();
//     eventId = event.id;
//   });

//   describe("POST /api/reservations", () => {
//     it("should create reservation successfully", async () => {
//       console.log("userToken, eventId", userToken, eventId);
//       const res = await request(app)
//         .post("/api/reservations")
//         .set("Authorization", `Bearer ${userToken}`)
//         .send({
//           eventId,
//           numberOfSeats: 2,
//         });

//       console.log("res.status", res.status, res.body.numberOfSeats);
//       expect(res.status).toBe(201);
//       expect(res.body.numberOfSeats).toBe(2);
//     });

//     it("should handle insufficient seats", async () => {
//       const event = await Event.findById(eventId);
//       await Event.findByIdAndUpdate(eventId, { availableSeats: 1 });

//       const res = await request(app)
//         .post("/api/reservations")
//         .set("Authorization", `Bearer ${userToken}`)
//         .send({
//           eventId,
//           numberOfSeats: 2,
//         });

//       expect(res.status).toBe(400);
//       expect(res.body.message).toContain("Insufficient seats");
//     });

//     it("should handle concurrent reservations", async () => {
//       const makeReservation = () =>
//         request(app)
//           .post("/api/reservations")
//           .set("Authorization", `Bearer ${userToken}`)
//           .send({
//             eventId,
//             numberOfSeats: 40,
//           });

//       const results = await Promise.all([
//         makeReservation(),
//         makeReservation(),
//         makeReservation(),
//       ]);

//       const successfulReservations = results.filter(
//         (res) => res.status === 201
//       );
//       const failedReservations = results.filter((res) => res.status === 400);

//       const updatedEvent = await Event.findById(eventId);
//       expect(updatedEvent.availableSeats).toBeGreaterThanOrEqual(0);
//       expect(successfulReservations.length).toBeLessThanOrEqual(2);
//       expect(failedReservations.length).toBeGreaterThanOrEqual(1);
//     });
//   });

//   describe("GET /api/reservations", () => {
//     it("should get user reservations", async () => {
//       // Create a reservation first
//       await request(app)
//         .post("/api/reservations")
//         .set("Authorization", `Bearer ${userToken}`)
//         .send({
//           eventId,
//           numberOfSeats: 2,
//         });

//       const res = await request(app)
//         .get("/api/reservations")
//         .set("Authorization", `Bearer ${userToken}`);

//       expect(res.status).toBe(200);
//       expect(Array.isArray(res.body)).toBeTruthy();
//       expect(res.body[0]).toHaveProperty("numberOfSeats", 2);
//     });
//   });
// });
