import { Request, Response } from "express";
import { AuthenticatedRequest } from "@/middlewares";
import httpStatus from "http-status";
import bookingService from "@/services/booking-service";

export default async function getReseves(req: AuthenticatedRequest, res: Response) {

    const { userId } = req
    
    try {
        const roomReserved = await bookingService.getUserReseve(userId)

        return res.status(httpStatus.OK).send(roomReserved);

    } catch (error) {
        return res.sendStatus(httpStatus.NOT_FOUND);
    }
}