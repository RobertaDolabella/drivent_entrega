import { notFoundError } from "@/errors";
import enrollmentRepository from "@/repositories/enrollment-repository";
import eventRepository from "@/repositories/event-repository";
import hotelRepository from "@/repositories/hotel-repository";
import ticketsRepository from "@/repositories/ticketsType-repository";
import { exclude } from "@/utils/prisma-utils";
import { Event, Ticket, TicketStatus, TicketType } from "@prisma/client";
import dayjs from "dayjs";
import { NOT_FOUND } from "http-status";
import { number } from "joi";

async function getHotelsAvailbles(userId: number) {

    const usersEnrollments = await enrollmentRepository.findAllbyUserId(userId)
    const lista: number[]= []


for(let index = 0; index<usersEnrollments.length; index++){
    const idEnrollment = usersEnrollments[index].id
    const enrollmentTicket = await ticketsRepository.findTickets(idEnrollment)
    const statusTicket = enrollmentTicket.status
   if(statusTicket==="PAID"){
    if(enrollmentTicket.TicketType.includesHotel===true){
        lista.push(enrollmentTicket.TicketType.id)
    }
   }
}

if(lista.length<1){
    throw notFoundError()
}

    const listHotels = await getHotelList()
    return listHotels
}


async function getHotelList() {
    const listHotels = await hotelRepository.getAllHotels()
    return listHotels
}

async function getRoomsAvailables(hotelId: number) {

    const listRooms = await hotelRepository.findAllRooms(hotelId)

    if(!listRooms){
        throw notFoundError()
    }

return listRooms
}

const hotelsService = {
    getHotelsAvailbles,
    getRoomsAvailables
}
export default hotelsService;
