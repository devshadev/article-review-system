const jwt = require("jsonwebtoken");

function authRequired(jwtSecret) {
  return (req, res, next) => {
    const rawAuth = req.headers.authorization;
    if (!rawAuth || !rawAuth.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Authorization token is required" });
    }

    const token = rawAuth.slice("Bearer ".length);
    try {
      const decoded = jwt.verify(token, jwtSecret);
      req.auth = {
        userId: decoded.sub,
        email: decoded.email,
      };
      return next();
    } catch {
      return res.status(401).json({ error: "Invalid or expired token" });
    }
  };
}

module.exports = { authRequired };
