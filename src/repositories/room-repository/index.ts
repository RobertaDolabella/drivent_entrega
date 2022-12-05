import { prisma } from "@/config";
import { getTicketTypes } from "@/controllers";
import { Prisma, Ticket, TicketType } from "@prisma/client";

  export async function findRoomByRoomId(roomId: number) {

    return await prisma.room.findFirst({where:{
        id: roomId
    }})

  }

  export async function updateRoom(roomId: number, capacity: number, add: number) {

    const room = await prisma.room.update({where:{
        id: roomId
    }, data:{
      capacity: capacity+ add
    }
  })
  return
  }

  const roomRepository = {
    findRoomByRoomId,
    updateRoom
  }

  export default roomRepository
