require("dotenv").config();

const bcrypt = require("bcryptjs");
const { connectDatabase } = require("./config/db");
const { getEnv } = require("./config/env");
const { User } = require("./models/User");
const { Article } = require("./models/Article");
const { Review } = require("./models/Review");

async function runSeed() {
  const env = getEnv();
  await connectDatabase(env.mongoUri);

  await Promise.all([User.deleteMany({}), Article.deleteMany({}), Review.deleteMany({})]);

  const passwordHash = await bcrypt.hash("password123", 10);
  const user = await User.create({
    email: "demo@example.com",
    name: "Demo User",
    passwordHash,
  });

  const article = await Article.create({
    title: "Seeded Article",
    description: "This article is created by seed script.",
    url: "https://example.com/seeded-article",
    source: "example.com",
  });

  await Review.create({
    userId: user._id,
    articleId: article._id,
    clarity: 4,
    depth: 4,
    usefulness: 5,
    credibility: 4,
    comment: "Good seed data for testing.",
  });

  // eslint-disable-next-line no-console
  console.log("Seed complete. Demo user: demo@example.com / password123");
  process.exit(0);
}

runSeed().catch((error) => {
  // eslint-disable-next-line no-console
  console.error("Seed failed:", error);
  process.exit(1);
});
