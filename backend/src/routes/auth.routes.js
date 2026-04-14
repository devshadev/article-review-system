const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User } = require("../models/User");

function authRouter(jwtSecret) {
  const router = express.Router();

  router.post("/signup", async (req, res, next) => {
    try {
      const { email, password, name } = req.body;
      if (!email || !password) {
        return res.status(400).json({ error: "email and password are required" });
      }

      const existing = await User.findOne({ email: email.toLowerCase().trim() }).lean();
      if (existing) {
        return res.status(409).json({ error: "email already in use" });
      }

      const passwordHash = await bcrypt.hash(password, 10);
      const user = await User.create({
        email: email.toLowerCase().trim(),
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

      const user = await User.findOne({ email: email.toLowerCase().trim() });
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
