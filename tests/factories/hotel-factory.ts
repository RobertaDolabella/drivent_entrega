import faker from "@faker-js/faker";
import { prisma } from "@/config";
import { Hotel } from "@prisma/client";
import dayjs from "dayjs";


export async function createHotelType() {
  return await prisma.hotel.create({
    data: {
        id: faker.datatype.number(),
        name: faker.name.findName(),
        image: faker.image.city(),
    }
  });
}


export async function createRoomType(hoteId: number) {
  return await prisma.room.create({
    data: {
      id: faker.datatype.number(),
      name: faker.name.lastName(),
      capacity: faker.datatype.number({max:100, min:1}),
      hotelId: hoteId
  }});
}

