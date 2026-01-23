const REQUIRED_ENVS = [
  "DATABASE_URL",
  "OPENAI_API_KEY",
  "EMAIL_HASH_PEPPER",
  "FIREBASE_PROJECT_ID",
  "FIREBASE_CLIENT_EMAIL",
  "FIREBASE_PRIVATE_KEY",
];

export function validateEnv() {
  const missing = REQUIRED_ENVS.filter((name) => !process.env[name]);

  if (process.env.NODE_ENV === "production" && !process.env.CORS_ORIGINS) {
    missing.push("CORS_ORIGINS");
  }

  if (missing.length > 0) {
    throw new Error(`Missing env vars: ${missing.join(", ")}`);
  }
}
