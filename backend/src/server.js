require("dotenv").config();

const cors = require("cors");
const express = require("express");
const { getEnv } = require("./config/env");
const { connectDatabase } = require("./config/db");
const { healthRouter } = require("./routes/health.routes");
const { authRouter } = require("./routes/auth.routes");
const { articlesRouter } = require("./routes/articles.routes");
const { reviewsRouter, articleReviewsRouter } = require("./routes/reviews.routes");
const { authRequired } = require("./middleware/auth");
const { notFoundHandler, errorHandler } = require("./middleware/error");

const env = getEnv();
let dbReady = false;

const app = express();
app.use(cors({ origin: env.corsOrigin === "*" ? true : env.corsOrigin }));
app.use(express.json());

app.use("/api/health", healthRouter);
app.use("/api/auth", authRouter(env.jwtSecret));
app.use(
  "/api/articles",
  articlesRouter(authRequired(env.jwtSecret), {
    isDbReady: () => dbReady,
  }),
);
app.use("/api/articles/:id/reviews", articleReviewsRouter());
app.use("/api/reviews", authRequired(env.jwtSecret), reviewsRouter());

app.use(notFoundHandler);
app.use(errorHandler);

async function bootstrap() {
  try {
    await connectDatabase(env.mongoUri);
    dbReady = true;
  } catch (error) {
    dbReady = false;
    // eslint-disable-next-line no-console
    console.warn("MongoDB unavailable. Running with in-memory article store only.", error.message);
  }

  app.listen(env.port, () => {
    // eslint-disable-next-line no-console
    console.log(`Backend running on http://localhost:${env.port}`);
  });
}

bootstrap().catch((error) => {
  // eslint-disable-next-line no-console
  console.error("Failed to start backend:", error);
  process.exit(1);
});
