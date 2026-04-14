const requiredKeys = ["MONGODB_URI", "JWT_SECRET"];

function getEnv() {
  const missingKeys = requiredKeys.filter((key) => !process.env[key]);
  if (missingKeys.length > 0) {
    throw new Error(`Missing required env keys: ${missingKeys.join(", ")}`);
  }

  return {
    port: Number(process.env.PORT ?? 4000),
    mongoUri: process.env.MONGODB_URI,
    jwtSecret: process.env.JWT_SECRET,
    corsOrigin: process.env.CORS_ORIGIN ?? "*",
  };
}

module.exports = { getEnv };
