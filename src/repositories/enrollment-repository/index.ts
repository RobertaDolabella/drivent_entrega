import { prisma } from "@/config";
import { Enrollment, TicketStatus } from "@prisma/client";

async function findWithAddressByUserId(userId: number) {

  console.log("entrou no find adress by userId")
  return await prisma.enrollment.findFirst({
    where: { userId },
    include: {
      Address: true,
    },
  });
}

async function findAllbyUserId(userId: number) {

  const userEnrollment = await prisma.enrollment.findMany({
    where: { 
      userId: userId },
      include:{
        Ticket:{}
      }
  });
return userEnrollment
}
async function upsert(
  userId: number,
  createdEnrollment: CreateEnrollmentParams,
  updatedEnrollment: UpdateEnrollmentParams,
) {

console.log( "passou do insert ")
  return await prisma.enrollment.upsert({
    where: {
      userId: userId || 0,
    },
    create: createdEnrollment,
    update: updatedEnrollment,
  });

}

export type CreateEnrollmentParams = Omit<Enrollment, "id" | "createdAt" | "updatedAt">;
export type UpdateEnrollmentParams = Omit<CreateEnrollmentParams, "userId">;

const enrollmentRepository = {
  findWithAddressByUserId,
  upsert,
  findAllbyUserId
};

export default enrollmentRepository;
