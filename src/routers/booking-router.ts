import { Router } from "express";
import { authenticateToken, validateBody } from "@/middlewares";
import getReseves from "@/controllers/booking-controller";



const bookingRouter = Router();

bookingRouter
  .all("/*", authenticateToken)
  .get("/",getReseves)
//   .get("/:hotelId", getRooms)


export { bookingRouter };
