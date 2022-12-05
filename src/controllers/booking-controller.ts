import { Request, Response } from "express";
import { AuthenticatedRequest } from "@/middlewares";
import httpStatus from "http-status";
import bookingService from "@/services/booking-service";
import enrollmentsService from "@/services/enrollments-service";
import enrollmentRepository from "@/repositories/enrollment-repository";

export async function getReseves(req: AuthenticatedRequest, res: Response) {

    const { userId } = req
    
    try {
        const roomReserved = await bookingService.getUserReseve(userId)

        return res.status(httpStatus.OK).send(roomReserved);

    } catch (error) {
        return res.sendStatus(httpStatus.NOT_FOUND);
    }
}

export async function bookRoom (req: AuthenticatedRequest, res: Response) {

    const { userId } = req

    const { roomId } = req.body
    
    try {

        await bookingService.bookARoom(userId, roomId)

        return res.sendStatus(httpStatus.OK)

    } catch (error) {
        return res.sendStatus(httpStatus.NOT_FOUND);
    }
}

export async function switchRoom(req: AuthenticatedRequest, res: Response) {

    const { userId } = req

    const {roomId} = req.body

    const bookingId  = Number(req.params.bookingId)


    try {

       const bookId =  await bookingService.updateRoom(userId,roomId, bookingId)

        return res.send({bookingId: bookId}).status(httpStatus.OK)

    } catch (error) {
        return res.sendStatus(httpStatus.NOT_FOUND);
    }

    
}
