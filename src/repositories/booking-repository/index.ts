import { prisma } from "@/config";
import { Enrollment, TicketStatus } from "@prisma/client";

async function findRoomsBooked(userId: number) {

    console.log("entrou no find adress by userId")
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

const bookingRepository = {
    findRoomsBooked
}

export default bookingRepository