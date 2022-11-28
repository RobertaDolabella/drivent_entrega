import { notFoundError } from "@/errors"
import enrollmentRepository from "@/repositories/enrollment-repository";
import ticketsRepository from "@/repositories/ticketsType-repository"
import { Ticket, TicketType } from "@prisma/client";
import { number } from "joi";

export async function getAllTickets(){

    const ticketsTypeList = await ticketsRepository.findMany()

    if(!ticketsTypeList){
        throw notFoundError();
    }

    return ticketsTypeList
}

export async function getUserTickets(userId: number){

    const enrollmentId = await getEnrollmentId(userId)

    const ticketsUsers = await ticketsRepository.findTickets(enrollmentId)

    if(!ticketsUsers){
        throw notFoundError();
    }
    return ticketsUsers
}

async function getEnrollmentId(userId:number){

    const enrollment = await enrollmentRepository.findWithAddressByUserId(userId)

    if(!enrollment){
        throw notFoundError();
    }

    return enrollment.id
}

export async function postUserTickets(userId: number, ticketId:number){

    const enrollmentId = await getEnrollmentId(userId)

    const ticketType: TicketType = await ticketsRepository.getTicketType(ticketId)

const newTicket = await ticketsRepository.postUserTicket(ticketId, enrollmentId, ticketType)

    return newTicket
}


const ticketsService = {
    getAllTickets, 
    getUserTickets,
    postUserTickets
}

export default ticketsService

