import { prisma } from "@/config";
import { getTicketTypes } from "@/controllers";
import { Prisma, Ticket, TicketType } from "@prisma/client";
import enrollmentRepository from "../enrollment-repository";


 async function findMany() {
  const listOfAllTicketsType = await prisma.ticketType.findMany();

  return listOfAllTicketsType
}



async function findTickets(enrollmentId: number) {

  const listOfAllTicketsType = await prisma.ticket.findFirst({ where:{enrollmentId: enrollmentId}, include:{TicketType:{}}});

  return listOfAllTicketsType
}

 async function postUserTicket(ticketId: number, enrollmentid: number, ticketType: TicketType) {

console.log(ticketId, enrollmentid, "testando se tudo chega certo no repository")

const tickectType = await getTicketType(ticketId)
await prisma.ticket.create({data:{
ticketTypeId: ticketId,
enrollmentId:enrollmentid,
status: "RESERVED"}});

const newTicket = await prisma.ticket.findFirst({where:{
  enrollmentId: enrollmentid}, 
  include:{
    TicketType:{}
    }
  }
)

  return newTicket

}
 async function getTicketType(ticketId: number) {

  const tickectType = await prisma.ticketType.findFirst({where:{
    id: ticketId, 
  }})

  return tickectType
}

export async function findHotelStatus(id: number) {

  const type = await prisma.ticketType.findFirst({where:{
      id
  }})

  return type.includesHotel
}


const ticketsRepository = {
  findMany,
  findTickets,
  postUserTicket,
  getTicketType,
  findHotelStatus
};

export default ticketsRepository 