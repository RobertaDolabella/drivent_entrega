import app, { init } from "@/app";
import { prisma } from "@/config";
import faker from "@faker-js/faker";
import { Hotel, TicketStatus } from "@prisma/client";
import httpStatus from "http-status";
import { array, string } from "joi";
import * as jwt from "jsonwebtoken";
import supertest from "supertest";
import { createEnrollmentWithAddress, createUser, createTicketType, createTicket, createTicketTypeWithHotel, createHotelType, createTicketTypeIncludeHotel, createRoomType } from "../factories";
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

describe("GET /hotels", () => {
  it("should respond with status 401 if no token is given", async () => {
    const response = await server.get("/hotels");

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should respond with status 401 if given token is not valid", async () => {
    const token = faker.lorem.word();

    const response = await server.get("/hotels").set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should respond with status 401 if there is no session for given token", async () => {
    const userWithoutSession = await createUser();
    const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

    const response = await server.get("/hotels").set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });


  it("should respond with status 401 and with no ticket status RESERVED", async () => {

    const user = await createUser();
    const token = await generateValidToken(user);
    const enrollment = await createEnrollmentWithAddress(user);
    const hotelStatus: boolean = true
    const ticketType = await createTicketTypeIncludeHotel(hotelStatus);
    const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.RESERVED);

    const response = await server.get("/hotels").set("Authorization", `Bearer ${token}`);

    expect(response.status).toEqual(httpStatus.UNAUTHORIZED);
  })

  it("should respond with status 200 and with no ticket status PAID", async () => {
    const user = await createUser();
    const token = await generateValidToken(user);
    const enrollment = await createEnrollmentWithAddress(user);
    const isHotelincluded: boolean = true
    const ticketType = await createTicketTypeWithHotel(isHotelincluded);
    const statusTicket: TicketStatus = "PAID"
    const ticket = await createTicket(enrollment.id, ticketType.id, statusTicket);
    const hotel = await createHotelType()

    const response = await server.get("/hotels").set("Authorization", `Bearer ${token}`);

    expect(response.status).toEqual(httpStatus.OK);
    expect(response.body).toEqual(
      [{
        id: hotel.id,
        name: hotel.name,
        image: hotel.image,
        createdAt: hotel.createdAt.toISOString(),
        updatedAt: hotel.updatedAt.toISOString()
      },
      ]);
  });
})


describe("GET /hotels/:hotelId", () => {
  it("should respond with status 401 if no token is given", async () => {
    const response = await server.get("/hotels");

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should respond with status 401 if given token is not valid", async () => {
    const token = faker.lorem.word();

    const response = await server.get("/hotels").set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should respond with status 401 if there is no session for given token", async () => {
    const userWithoutSession = await createUser();
    const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

    const response = await server.get("/hotels").set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });


  it("should respond with status 401 and with hotelId is not valid", async () => {

    const user = await createUser();
    const token = await generateValidToken(user);
    const hotel = await createHotelType()


    const response = await server.get(`/hotels/ola`).set("Authorization", `Bearer ${token}`);

    expect(response.status).toEqual(httpStatus.UNAUTHORIZED);
  })

  it("should respond with status 401 and with hotelId does not exist", async () => {

    const user = await createUser();
    const token = await generateValidToken(user);
    const hotel = await createHotelType()


    const response = await server.get(`/hotels/${hotel.id + 1}`).set("Authorization", `Bearer ${token}`);

    expect(response.status).toEqual(httpStatus.UNAUTHORIZED);
  })

  it("should respond with status 200 and with a list of rooms availables", async () => {

    const user = await createUser();
    const token = await generateValidToken(user);
    const hotel = await createHotelType()
    const rooms = await createRoomType(hotel.id)
    const rooms2 = await createRoomType(hotel.id)


    const response = await server.get(`/hotels/${hotel.id}`).set("Authorization", `Bearer ${token}`);
    expect(response.status).toEqual(httpStatus.OK);
    console.log(response.body)
    expect(response.body).toEqual({
      id: hotel.id,
      name: hotel.name,
      image: hotel.image,
      createdAt: hotel.createdAt.toISOString(),
      updatedAt: hotel.updatedAt.toISOString(),
      Rooms: [
        {
          id: rooms.id,
          name: rooms.name,
          capacity: rooms.capacity,
          hotelId: rooms.hotelId,
          createdAt: rooms.createdAt.toISOString(),
          updatedAt: rooms.updatedAt.toISOString()
        },
        {
          id: rooms2.id,
          name: rooms2.name,
          capacity: rooms2.capacity,
          hotelId: rooms2.hotelId,
          createdAt: rooms2.createdAt.toISOString(),
          updatedAt: rooms2.updatedAt.toISOString()
        }
      ]
    })
  })

})

