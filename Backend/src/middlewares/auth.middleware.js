const jwt = require("jsonwebtoken");

/**
 * Middleware: verifyToken
 * Reads JWT from the `token` cookie (set during login/register),
 * verifies it and attaches req.userId for downstream controllers.
 */
async function verifyToken(req, res, next) {
  try {
    const token = req.cookies?.token;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized. Please log in to continue.",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRECT);
    req.userId = decoded.id;
    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired session. Please log in again.",
    });
  }
}

module.exports = { verifyToken };
