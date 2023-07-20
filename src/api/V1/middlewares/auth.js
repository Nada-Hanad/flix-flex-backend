const jwt = require("jsonwebtoken");

// Middleware to authenticate user's token
function authenticateToken(req, res, next) {
  const token = req.headers["authorization"];
  if (!token) {
    return res.status(401).json({ error: "Unauthorized: Missing token" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: "Forbidden: Invalid token" });
    }
    req.user = user;
    next();
  });
}

module.exports = { authenticateToken };
