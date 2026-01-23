import prisma from "../prisma/client.js";
import * as userService from "../services/user.service.js";
import { hashEmail } from "../utils/emailHash.js";

export async function getMe(req, res) {
  try {
    const user = await userService.getUserById(req.userId);
    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }

    let emailHash = user.emailHash;
    if (!emailHash && user.email) {
      const computedHash = hashEmail(user.email);
      await prisma.user.update({
        where: { id: user.id },
        data: { emailHash: computedHash },
      });
      emailHash = computedHash;
    }

    if (!emailHash) {
      return res.status(500).json({ message: "missing email to hash" });
    }

    let ledger = await prisma.emailCreditLedger.findUnique({
      where: { emailHash },
    });
    if (!ledger) {
      const remainingLegacy =
        typeof user.credits === "number" ? user.credits : 3;
      const usedFromLegacy = Math.min(3, Math.max(0, 3 - remainingLegacy));
      ledger = await prisma.emailCreditLedger.create({
        data: {
          emailHash,
          freeCreditsTotal: 3,
          freeCreditsUsed: usedFromLegacy,
        },
      });
    }

    const creditsRemaining = ledger.freeCreditsTotal - ledger.freeCreditsUsed;

    return res.status(200).json({
      id: user.id,
      name: user.name,
      email: user.email,
      freeCreditsTotal: ledger.freeCreditsTotal,
      freeCreditsUsed: ledger.freeCreditsUsed,
      creditsRemaining,
      createdAt: user.createdAt,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "internal server error" });
  }
}
