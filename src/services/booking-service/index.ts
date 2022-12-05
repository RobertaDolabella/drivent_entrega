import { notFoundError, forbidden } from "@/errors";
import bookingRepository from "@/repositories/booking-repository";
import enrollmentRepository from "@/repositories/enrollment-repository";
import eventRepository from "@/repositories/event-repository";
import hotelRepository from "@/repositories/hotel-repository";
import ticketsRepository from "@/repositories/ticketsType-repository";
import roomRepository from "@/repositories/room-repository";
import { exclude } from "@/utils/prisma-utils";
import { Event, Hotel, Ticket, TicketStatus, TicketType } from "@prisma/client";
import dayjs from "dayjs";
import { FORBIDDEN, NOT_FOUND } from "http-status";


async function getUserReseve(userId: number) {

    const roomsBooked = await bookingRepository.findRoomsBooked(userId)

    return roomsBooked
}
async function bookARoom(userId: number, roomId: number) {

    await getTicketsPaidAndHotelsAvailbles(userId)

    const room = await roomRepository.findRoomByRoomId(roomId)

    if (!room) {
        throw forbidden();
    }

    if (room.capacity < 1) {
        throw forbidden();
    }
    const add: number = 1
    await roomRepository.updateRoom(roomId, room.capacity, add)

    await bookingRepository.bookRoom(userId, roomId)

    return
}

async function getTicketsPaidAndHotelsAvailbles(userId: number) {

    const usersEnrollments = await enrollmentRepository.findAllbyUserId(userId)
    const lista: number[] = []

    for (let index = 0; index < usersEnrollments.length; index++) {
        const idEnrollment = usersEnrollments[index].id
        const enrollmentTicket = await ticketsRepository.findTickets(idEnrollment)
        const statusTicket = enrollmentTicket.status
        if (statusTicket === "PAID") {
            if (enrollmentTicket.TicketType.includesHotel === true) {
                lista.push(enrollmentTicket.TicketType.id)
            }
        }
    }

    if (lista.length < 1) {

        throw forbidden();
    }
    return
}


async function updateRoom(userId: number, roomId: number, bookingId: number) {

    await getTicketsPaidAndHotelsAvailbles(userId)

    const bookDetails = await bookingRepository.findBookingById(bookingId)

    if (!bookDetails) {
        throw notFoundError();
    }

    const room = await roomRepository.findRoomByRoomId(roomId)


    if (!room) {
        throw forbidden();
    }
    if (room.capacity < 1) {
        throw forbidden();
    }
    const sub = -1

    const roomsBooked = await roomRepository.updateRoom(roomId, room.capacity, sub)

    const newBooking = await bookingRepository.bookRoom(userId, roomId)

    const roomUnBooked = await roomRepository.findRoomByRoomId(bookDetails.roomId)

    await bookingRepository.deleteBooking(bookDetails.id)

    const add = 1

    await roomRepository.updateRoom(bookDetails.roomId, roomUnBooked.capacity, add)

    return newBooking.id
}

const bookingService = {
    getUserReseve,
    bookARoom,
    updateRoom
}

export default bookingService


