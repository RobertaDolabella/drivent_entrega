import faker from "@faker-js/faker";
import { prisma } from "@/config";
import { Hotel } from "@prisma/client";
import dayjs from "dayjs";


export async function createBooking(userId: number, roomId: number) {
  return await prisma.booking.create({
    data: {
      userId,
      roomId,
    }
  });
}


export async function countAllBookings() {
  return await prisma.booking.count({});
}

