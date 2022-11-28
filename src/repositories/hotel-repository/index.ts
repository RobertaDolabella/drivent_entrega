import { prisma } from "@/config";
import { Enrollment, TicketStatus } from "@prisma/client";

export async function getAllHotels() {

    const listHotels = await prisma.hotel.findMany()
    return listHotels
}

export async function findAllRooms(hotelId: number) {

    const listRooms = await prisma.hotel.findFirst({where:{
        id: hotelId
    },
include:{
    Rooms:{}
}})
    return listRooms
}


const hotelRepository = {
    getAllHotels,
    findAllRooms
}

export default hotelRepository;
