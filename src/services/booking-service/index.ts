import { notFoundError } from "@/errors";
import bookingRepository from "@/repositories/booking-repository";
import enrollmentRepository from "@/repositories/enrollment-repository";
import eventRepository from "@/repositories/event-repository";
import hotelRepository from "@/repositories/hotel-repository";
import ticketsRepository from "@/repositories/ticketsType-repository";
import { exclude } from "@/utils/prisma-utils";
import { Event, Ticket, TicketStatus, TicketType } from "@prisma/client";
import dayjs from "dayjs";
import { NOT_FOUND } from "http-status";
import { number } from "joi";

async function getUserReseve(userId: number) {

    const roomsBooked = await bookingRepository.findRoomsBooked(userId)

    return roomsBooked
}

const bookingService ={
    getUserReseve
}

export default bookingService


