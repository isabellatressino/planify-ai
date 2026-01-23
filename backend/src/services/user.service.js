import prisma from "../prisma/client.js";

export async function getUserById(id) {
  return prisma.user.findUnique({ where: { id } });
}
