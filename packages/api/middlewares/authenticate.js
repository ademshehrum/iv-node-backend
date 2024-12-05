const { verifyToken } = require("../helpers/jwtHelper");
const logHelper = require("../helpers/logHelper");

const authenticate = (req, res, next) => {
  const token = req.cookies.authToken;

  if (!token) {
    logHelper.warn("Unauthorized access attempt: No token provided.");
    return res.status(401).send({
      success: false,
      message: "Authentication required.",
    });
  }

  try {
    const decoded = verifyToken(token);

    if (!decoded || !decoded.role) {
      throw new Error("Decoded token is missing essential fields.");
    }

    req.user = decoded;
    next();
  } catch (err) {
    logHelper.error(`Invalid token: ${err.message}`);
    return res.status(401).send({
      success: false,
      message: "Invalid or expired token.",
    });
  }
};

module.exports = authenticate;
