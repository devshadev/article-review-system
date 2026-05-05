const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User } = require("../models/User");
const memoryUsers = [];

function authRouter(jwtSecret, options = {}) {
  const router = express.Router();
  const isDbReady = options.isDbReady ?? (() => true);

  router.post("/signup", async (req, res, next) => {
    try {
      const { email, password, name } = req.body;
      if (!email || !password) {
        return res.status(400).json({ error: "email and password are required" });
      }

      const normalizedEmail = email.toLowerCase().trim();
      if (!isDbReady()) {
        const existingMemoryUser = memoryUsers.find((user) => user.email === normalizedEmail);
        if (existingMemoryUser) {
          return res.status(409).json({ error: "email already in use" });
        }

        const passwordHash = await bcrypt.hash(password, 10);
        const memoryUser = {
          id: `${Date.now()}`,
          email: normalizedEmail,
          name: name?.trim() ?? null,
          passwordHash,
        };
        memoryUsers.push(memoryUser);

        const token = jwt.sign({ email: memoryUser.email }, jwtSecret, {
          subject: memoryUser.id,
          expiresIn: "7d",
        });

        return res.status(201).json({
          token,
          user: {
            id: memoryUser.id,
            email: memoryUser.email,
            name: memoryUser.name,
          },
        });
      }

      const existing = await User.findOne({ email: normalizedEmail }).lean();
      if (existing) {
        return res.status(409).json({ error: "email already in use" });
      }

      const passwordHash = await bcrypt.hash(password, 10);
      const user = await User.create({
        email: normalizedEmail,
        name: name?.trim(),
        passwordHash,
      });

      const token = jwt.sign({ email: user.email }, jwtSecret, {
        subject: String(user._id),
        expiresIn: "7d",
      });

      return res.status(201).json({
        token,
        user: {
          id: String(user._id),
          email: user.email,
          name: user.name ?? null,
        },
      });
    } catch (error) {
      return next(error);
    }
  });

  router.post("/login", async (req, res, next) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ error: "email and password are required" });
      }

      const normalizedEmail = email.toLowerCase().trim();
      if (!isDbReady()) {
        const memoryUser = memoryUsers.find((item) => item.email === normalizedEmail);
        if (!memoryUser) {
          return res.status(401).json({ error: "invalid email or password" });
        }

        const isValid = await bcrypt.compare(password, memoryUser.passwordHash);
        if (!isValid) {
          return res.status(401).json({ error: "invalid email or password" });
        }

        const token = jwt.sign({ email: memoryUser.email }, jwtSecret, {
          subject: memoryUser.id,
          expiresIn: "7d",
        });

        return res.json({
          token,
          user: {
            id: memoryUser.id,
            email: memoryUser.email,
            name: memoryUser.name,
          },
        });
      }

      const user = await User.findOne({ email: normalizedEmail });
      if (!user) {
        return res.status(401).json({ error: "invalid email or password" });
      }

      const isValid = await bcrypt.compare(password, user.passwordHash);
      if (!isValid) {
        return res.status(401).json({ error: "invalid email or password" });
      }

      const token = jwt.sign({ email: user.email }, jwtSecret, {
        subject: String(user._id),
        expiresIn: "7d",
      });

      return res.json({
        token,
        user: {
          id: String(user._id),
          email: user.email,
          name: user.name ?? null,
        },
      });
    } catch (error) {
      return next(error);
    }
  });

  return router;
}

module.exports = { authRouter };
