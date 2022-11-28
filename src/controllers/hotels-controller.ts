import { Request, Response } from "express";
import { AuthenticatedRequest } from "@/middlewares";
import hotelsService from "@/services/hotels-service";
import httpStatus from "http-status";

export async function getHotels(req: AuthenticatedRequest, res: Response) {

    const { userId } = req
    
    try {
        const listHotels = await hotelsService.getHotelsAvailbles(userId)

        return res.status(httpStatus.OK).send(listHotels);

    } catch (error) {
        return res.sendStatus(httpStatus.UNAUTHORIZED);
    }
}

export async function getRooms(req: AuthenticatedRequest, res: Response) {

    const hotelId = Number(req.params.hotelId)
    if(hotelId===undefined){
        return res.sendStatus(httpStatus.UNAUTHORIZED);
    }
    
    try {
        const listRooms = await hotelsService.getRoomsAvailables(hotelId)

        return res.status(httpStatus.OK).send(listRooms);

    } catch (error) {
        return res.sendStatus(httpStatus.UNAUTHORIZED);
    }
}

const hotelController = {
    getHotels,
    getRooms
}

export default hotelController

