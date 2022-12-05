import { prisma } from "@/config";
import { Enrollment, TicketStatus } from "@prisma/client";

async function findRoomsBooked(userId: number) {
    
    const booked = await prisma.booking.findFirst({
        where: { userId },
        include: {
            Room: {}
        }
    });

    return {
        id: booked.id,
        Room: booked.Room
    }
}

async function bookRoom(userId: number, roomId: number) {

    return await prisma.booking.create({
        data:{
            userId,
            roomId
        }
    })
}

async function findBookingById(bookingId: number) {

        return await prisma.booking.findFirst({
            where:{
                id: bookingId
            }
        })
    }

    async function updateBooking(id: number, roomId: number) {

        return await prisma.booking.update({
            where:{
                id
            },
            data:{
                roomId
            }
        })
    }

    async function deleteBooking(bookingId: number) {

        return await prisma.booking.delete({
            where:{
                id: bookingId
            }
        })
    }

const bookingRepository = {
    findRoomsBooked,
    bookRoom,
    findBookingById,
    updateBooking,
    deleteBooking
}

export default bookingRepository