import { Router } from "express";
import { authenticateToken, validateBody } from "@/middlewares";
import {getReseves , bookRoom, switchRoom} from "@/controllers/booking-controller";
import { error } from "console";
import {createBookingSchema} from "@/schemas";



const bookingRouter = Router();

bookingRouter
  .all("/*", authenticateToken)
  .get("/", getReseves)
  .post("/",validateBody(createBookingSchema),bookRoom)
  .put("/:bookingId", validateBody(createBookingSchema), switchRoom)


export { bookingRouter };
