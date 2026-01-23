import bcrypt from "bcrypt";
import crypto from "crypto";

import admin from "../config/firebaseAdmin.js";
import prisma from "../prisma/client.js";
import { hashEmail, normalizeEmail } from "../utils/emailHash.js";

const SALT_ROUNDS = 10;

export default async function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  const isDev = process.env.NODE_ENV !== "production";

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "missing or invalid authorization header" });
  }

  const token = authHeader.split(" ")[1];
  if (!token || token === "null" || token === "undefined") {
    return res.status(401).json({ message: "invalid or expired token" });
  }

  try {
    const decoded = await admin.auth().verifyIdToken(token);
    const { email, name, uid } = decoded;

    if (!email) {
      return res.status(401).json({ message: "missing email in token" });
    }

    if (!uid) {
      return res.status(401).json({ message: "invalid or expired token" });
    }

    const normalizedEmail = normalizeEmail(email);
    const nameFromToken = typeof name === "string" ? name.trim() : "";
    const emailPrefix = normalizedEmail.split("@")[0];
    const emailHash = hashEmail(normalizedEmail);

    let existingUser = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });
    if (!existingUser) {
      existingUser = await prisma.user.findFirst({
        where: { emailHash },
      });
    }
    if (!existingUser) {
      existingUser = await prisma.user.findFirst({
        where: { email },
      });
    }
    if (existingUser && existingUser.email !== normalizedEmail) {
      existingUser = await prisma.user.update({
        where: { id: existingUser.id },
        data: { email: normalizedEmail },
      });
    }
    if (existingUser && !existingUser.emailHash) {
      existingUser = await prisma.user.update({
        where: { id: existingUser.id },
        data: { emailHash },
      });
    }
    const remainingLegacy =
      typeof existingUser?.credits === "number" ? existingUser.credits : 3;
    const usedFromLegacy = Math.min(3, Math.max(0, 3 - remainingLegacy));

    await prisma.emailCreditLedger.upsert({
      where: { emailHash },
      create: {
        emailHash,
        freeCreditsTotal: 3,
        freeCreditsUsed: usedFromLegacy,
      },
      update: {},
    });

    let user = existingUser;
    if (!user) {
      const randomPassword = crypto.randomBytes(24).toString("hex");
      const hashedPassword = await bcrypt.hash(randomPassword, SALT_ROUNDS);
      user = await prisma.user.create({
        data: {
          name: nameFromToken || "Usuario",
          email: normalizedEmail,
          emailHash,
          password: hashedPassword,
        },
      });
    } else {
      const currentName = (user.name || "").trim();
      const shouldUpdateName =
        nameFromToken && (!currentName || currentName === emailPrefix);

      if (shouldUpdateName || !user.emailHash) {
        const updateData = {};
        if (shouldUpdateName) {
          updateData.name = nameFromToken;
        }
        if (!user.emailHash) {
          updateData.emailHash = emailHash;
        }
        user = await prisma.user.update({
          where: { id: user.id },
          data: updateData,
        });
      }
    }

    req.userId = user.id;
    req.firebaseUid = uid;
    return next();
  } catch (err) {
    if (isDev) {
      console.warn("auth.verifyIdToken failed", {
        code: err?.code,
        message: err?.message,
      });
    }
    return res.status(401).json({
      message: "invalid or expired token",
      ...(isDev && err?.code ? { code: err.code } : {}),
    });
  }
}
