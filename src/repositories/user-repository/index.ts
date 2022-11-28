import { prisma } from "@/config";
import { Prisma } from "@prisma/client";

async function findByEmail(email: string, select?: Prisma.UserSelect) {
  console.log("verificando email")
  const params: Prisma.UserFindUniqueArgs = {
    where: {
      email,
    },
  };

  if (select) {
    params.select = select;
  }

  return prisma.user.findUnique(params);
}

async function create(data: Prisma.UserUncheckedCreateInput) {
  console.log("vai inserir o user")
  return prisma.user.create({
    data: {
      email: data.email,
      password: data.password
    }
  });
}

const userRepository = {
  findByEmail,
  create,
};

export default userRepository;
