import { Router } from "express";
import { authenticateToken, validateBody } from "@/middlewares";
import { getTicketTypes, getYourTicket, postYourTicket } from "@/controllers/ticket-controller"
import {createTicketSchema} from "@/schemas";

const ticketsRouter = Router();

ticketsRouter
    .all("/*", authenticateToken)
    .get("/types", getTicketTypes)
    .get("/", getYourTicket)
    .post("/",validateBody(createTicketSchema), postYourTicket)

export { ticketsRouter };
