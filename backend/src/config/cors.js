const FALLBACK_ORIGINS = [];

function parseOrigins(value) {
  if (!value) return FALLBACK_ORIGINS;
  return value
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);
}

export function buildCorsOptions() {
  const allowedOrigins = parseOrigins(process.env.CORS_ORIGINS);

  return {
    origin(origin, callback) {
      if (!origin) {
        return callback(null, true);
      }
      if (allowedOrigins.length === 0) {
        return callback(null, true);
      }
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"));
    },
  };
}
