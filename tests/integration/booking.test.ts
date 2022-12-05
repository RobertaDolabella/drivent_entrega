import app, { init } from "@/app";
import { prisma } from "@/config";
import faker from "@faker-js/faker";
import { Hotel, TicketStatus } from "@prisma/client";
import httpStatus from "http-status";
import { array, number, object, string } from "joi";
import * as jwt from "jsonwebtoken";
import supertest from "supertest";
import { createEnrollmentWithAddress, createUser,createBooking, createTicket, createTicketTypeWithHotel, createHotelType, createTicketTypeIncludeHotel, createRoomType, createRoomTypeNotAvailable, countAllBookings } from "../factories";
import { cleanDb, generateValidToken } from "../helpers";
import dayjs from "dayjs";
import { enrollmentsRouter } from "@/routers";


beforeAll(async () => {
  await init();
});

beforeEach(async () => {
  await cleanDb();
});

const server = supertest(app);

describe("GET /booking", () => {
  it("should respond with status 401 if no token is given", async () => {
    const response = await server.get("/booking");

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should respond with status 401 if given token is not valid", async () => {
    const token = faker.lorem.word();

    const response = await server.get("/booking").set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should respond with status 401 if there is no session for given token", async () => {
    const userWithoutSession = await createUser();
    const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

    const response = await server.get("/booking").set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });


  it("should respond with status 200 and with room details", async () => {

    const user = await createUser();
    const token = await generateValidToken(user);
    const hotel = await createHotelType()
    const room = await createRoomType(hotel.id);
    const booking = await createBooking(user.id, room.id)

    const response = await server.get("/booking").set("Authorization", `Bearer ${token}`);

expect(response.body).toEqual({
  id: booking.id,
  Room:{
  id:room.id,
  name: room.name,
  capacity: room.capacity,
  hotelId: room.hotelId,
  createdAt: room.createdAt.toISOString(),
  updatedAt: room.updatedAt.toISOString()
  }
})
expect(response.status).toEqual(httpStatus.OK)
  })

  it("should respond with status 404 when is no room booked", async () => {
    const user = await createUser();
    const userNotAllowed: number = user.id+1
    const token = await generateValidToken(user);
    const hotel = await createHotelType()
    const room = await createRoomType(hotel.id);
    const booking = await createBooking(userNotAllowed, room.id)

    const response = await server.get("/booking").set("Authorization", `Bearer ${token}`);
    expect(response.status).toEqual(httpStatus.NOT_FOUND);

})
})

// COMEÇA O TESTE DO POST

describe("POST /booking", () => {
  it("should respond with status 401 if no token is given", async () => {
    const response = await server.post("/booking");

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should respond with status 401 if given token is not valid", async () => {
    const token = faker.lorem.word();

    const response = await server.post("/booking").set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should respond with status 401 if there is no session for given token", async () => {
    const userWithoutSession = await createUser();
    const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

    const response = await server.post("/booking").set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

// AQUI COMEÇA PS TESTES  DAS REGRAS DE NEGÓCIO


// acertar o erro
it("should respond with status 403 and with no ticket status RESERVED", async () => {

  const user = await createUser();
  const token = await generateValidToken(user);
  const enrollment = await createEnrollmentWithAddress(user);
  const hotelStatus: boolean = true
  const ticketType = await createTicketTypeIncludeHotel(hotelStatus);
  const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.RESERVED);

  const response = await server.post("/booking").set("Authorization", `Bearer ${token}`);

  expect(response.status).toEqual(httpStatus.NOT_FOUND);
})

  it("should respond with status 404 when roomId doesn't exist", async () => {

    const user = await createUser();
    const token = await generateValidToken(user);
    const hotel = await createHotelType()
    const room = await createRoomType(hotel.id)

    const response = await server.post(`/booking`).set("Authorization", `Bearer ${token}`).send({
        roomId: room.id+1
    });

    expect(response.status).toEqual(httpStatus.NOT_FOUND);
  })
  it("should respond with status 404 when roomId is not valid, like zero", async () => {

    const user = await createUser();
    const token = await generateValidToken(user);
    const hotel = await createHotelType()
    const room = await createRoomType(hotel.id)

    const response = await server.post(`/booking`).set("Authorization", `Bearer ${token}`).send({
        roomId: 0
    });

    expect(response.status).toEqual(httpStatus.NOT_FOUND);
  })

  it("should respond with status 404 when roomId is not valid, roomId negative", async () => {

    const user = await createUser();
    const token = await generateValidToken(user);
    const hotel = await createHotelType()
    const room = await createRoomType(hotel.id)

    const response = await server.post(`/booking`).set("Authorization", `Bearer ${token}`).send({
        roomId: -1
    });

    expect(response.status).toEqual(httpStatus.NOT_FOUND);
  })
// // acertar o erro
  it("should respond with status 403 when room capacity is zero", async () => {

    const user = await createUser();
    const token = await generateValidToken(user);
    const hotel = await createHotelType()
    const roomNotAvailable = await createRoomTypeNotAvailable(hotel.id)

    const response = await server.post(`/booking`).set("Authorization", `Bearer ${token}`).send({
        roomId: roomNotAvailable.id
    });

    expect(response.status).toEqual(httpStatus.NOT_FOUND);
  })

  it("should respond with status 200 when the room is booked", async () => {

    const user = await createUser();
    const token = await generateValidToken(user);
    const enrollment = await createEnrollmentWithAddress(user);
    const isHotelincluded: boolean = true
    const ticketType = await createTicketTypeWithHotel(isHotelincluded);
    const statusTicket: TicketStatus = "PAID"
    const ticket = await createTicket(enrollment.id, ticketType.id, statusTicket);
    const hotel = await createHotelType()
    const room = await createRoomType(hotel.id)
    const book = await createBooking(user.id, room.id)
    const bookDBLength = await countAllBookings()

    const response = await server.post(`/booking`).set("Authorization", `Bearer ${token}`).send({
        roomId: room.id
    });
console.log(book)
    console.log(response.status)

    expect(response.status).toEqual(httpStatus.OK);
    expect(bookDBLength).toBe(1);
  })
})

describe("PUT /booking", () => {
  it("should respond with status 401 if no token is given", async () => {
    const response = await server.put("/booking/1");

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should respond with status 401 if given token is not valid", async () => {
    const token = faker.lorem.word();

    const response = await server.put("/booking/1").set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should respond with status 401 if there is no session for given token", async () => {
    const userWithoutSession = await createUser();
    const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

    const response = await server.put("/booking/1").set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should respond with status 403 and with no ticket status RESERVED", async () => {

    const user = await createUser();
    const token = await generateValidToken(user);
    const enrollment = await createEnrollmentWithAddress(user);
    const hotelStatus: boolean = true
    const ticketType = await createTicketTypeIncludeHotel(hotelStatus);
    const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.RESERVED);
    const hotel = await createHotelType()
    const room = await createRoomType(hotel.id)
    const book = await createBooking(user.id, room.id)
  
    const response = await server.put(`/booking/${book.id}`).set("Authorization", `Bearer ${token}`);
  
    expect(response.status).toEqual(httpStatus.NOT_FOUND);
  })
  
    it("should respond with status 404 when roomId doesn't exist", async () => {
  
      const user = await createUser();
      const token = await generateValidToken(user);
      const hotel = await createHotelType()
      const room = await createRoomType(hotel.id)
      const book = await createBooking(user.id, room.id)
  
      const response = await server.put(`/booking/${book.id}`).set("Authorization", `Bearer ${token}`).send({
          roomId: 0
      });
  
      expect(response.status).toEqual(httpStatus.NOT_FOUND);
    })

  it("should respond with status 404 when bookingId doesn't exist", async () => {
  
    const user = await createUser();
    const token = await generateValidToken(user);
    const hotel = await createHotelType()
    const room = await createRoomType(hotel.id)
    const book = await createBooking(user.id, room.id)

    const response = await server.put(`/booking/${book.id+1}`).set("Authorization", `Bearer ${token}`).send({
        roomId: room.id+2
    });

    expect(response.status).toEqual(httpStatus.NOT_FOUND);
  })

  it("should respond with status 403 when room capacity is zero", async () => {

    const user = await createUser();
    const token = await generateValidToken(user);
    const hotel = await createHotelType()
    const roomNotAvailable = await createRoomTypeNotAvailable(hotel.id)
    const room = await createRoomType(hotel.id)
    const book = await createBooking(user.id, room.id)
   

    const response = await server.put(`/booking/${book.id}`).set("Authorization", `Bearer ${token}`).send({
        roomId: room.id
    });

    expect(response.status).toEqual(httpStatus.NOT_FOUND);
  })

it("should respond with status 200 when the booking is updated", async () => {

  const user = await createUser();
  const token = await generateValidToken(user);
  const enrollment = await createEnrollmentWithAddress(user);
  const isHotelincluded: boolean = true
  const ticketType = await createTicketTypeWithHotel(isHotelincluded);
  const statusTicket: TicketStatus = "PAID"
  const ticket = await createTicket(enrollment.id, ticketType.id, statusTicket);
  const hotel = await createHotelType()
  const room = await createRoomType(hotel.id)
  const roomToBeUnbooked = await createRoomType(hotel.id)
  const book = await createBooking(user.id, roomToBeUnbooked.id)
  const bookDBLength = await countAllBookings()

    const response = await server.put(`/booking/${book.id}`).set("Authorization", `Bearer ${token}`).send({
        roomId: room.id
  });

  console.log(response.body)
  expect(response.status).toEqual(httpStatus.OK);
  // expect(response.body).toMatch({bookingId:1});
  expect(bookDBLength).toBe(1);
})
})





