import crypto from "crypto";

export function normalizeEmail(email) {
  return email.trim().toLowerCase();
}

export function hashEmail(email) {
  const normalized = normalizeEmail(email);
  const pepper = process.env.EMAIL_HASH_PEPPER;

  if (!pepper) {
    throw new Error("Missing EMAIL_HASH_PEPPER");
  }

  return crypto
    .createHash("sha256")
    .update(normalized + pepper)
    .digest("hex");
}
