
import { Request, Response } from "express";
import { AuthenticatedRequest } from "@/middlewares";
import ticketsService from "@/services/tickets-service";
import httpStatus from "http-status";
import { number } from "joi";

export async function getTicketTypes(req: AuthenticatedRequest, res: Response) {

  try {
    const tickets =  await ticketsService.getAllTickets()

    return res.status(httpStatus.OK).send(tickets);
  } catch (error) {
    return res.status(httpStatus.NOT_FOUND).send([]);
  }
}

export async function getYourTicket(req: AuthenticatedRequest, res: Response) {

  const {userId}  = req

  const id = Number(userId)
  

  try {
    const tickets =  await ticketsService.getUserTickets(id)

    return res.status(httpStatus.OK).send(tickets);
  } catch (error) {
    return res.status(httpStatus.NOT_FOUND).send([]);
  }
}

export async function postYourTicket(req: AuthenticatedRequest, res: Response) {

  const {ticketTypeId}  = (req.body) 
  const {userId}  = req
  const id = Number(userId)

try {

const newTicket =  await ticketsService.postUserTickets(id, ticketTypeId)

  return res.status(httpStatus.CREATED).send(newTicket)
} catch (error) {
  return res.status(httpStatus.NOT_FOUND).send([]);
}
}

const ticketController  ={
  getTicketTypes,
  getYourTicket,
  postYourTicket
}

export default ticketController