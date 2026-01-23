import prisma from "../prisma/client.js";

export async function consumeFreeCredit(emailHash) {
  const ledger = await prisma.emailCreditLedger.findUnique({
    where: { emailHash },
  });

  if (!ledger) {
    const error = new Error("Ledger not found");
    error.code = "LEDGER_NOT_FOUND";
    throw error;
  }

  const result = await prisma.emailCreditLedger.updateMany({
    where: {
      emailHash,
      freeCreditsUsed: { lt: ledger.freeCreditsTotal },
    },
    data: { freeCreditsUsed: { increment: 1 } },
  });

  if (result.count === 0) {
    const error = new Error("No credits");
    error.code = "NO_CREDITS";
    throw error;
  }

  const updatedLedger = await prisma.emailCreditLedger.findUnique({
    where: { emailHash },
  });
  const creditsRemaining = updatedLedger
    ? updatedLedger.freeCreditsTotal - updatedLedger.freeCreditsUsed
    : 0;

  return { creditsRemaining };
}

export async function createPlanWithCredit({
  goal,
  title,
  level,
  hoursDay,
  deadline,
  content,
  progress,
  status,
  userId,
}) {
  const plan = await prisma.studyPlan.create({
    data: {
      goal,
      title,
      level,
      hoursDay,
      deadline,
      content,
      progress,
      status,
      userId,
    },
  });

  return { plan };
}

export async function listPlans(userId) {
  return prisma.studyPlan.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
}

export async function getUserById(id) {
  return prisma.user.findUnique({ where: { id } });
}

export async function getPlanById(userId, id) {
  return prisma.studyPlan.findFirst({
    where: { id, userId },
  });
}

export async function updatePlanContentWithProgress(id, content, progress, status) {
  return prisma.studyPlan.update({
    where: { id },
    data: { content, progress, status },
  });
}
export async function deletePlanById(id) {
  return prisma.studyPlan.delete({
    where: { id },
  });
}
