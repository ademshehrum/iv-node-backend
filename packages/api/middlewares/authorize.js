const logHelper = require("../helpers/logHelper");

const authorize = (roles = []) => {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      logHelper.warn("Authorization failed: Missing user role.");
      return res.status(403).send({
        success: false,
        message: "Access denied. Invalid user information.",
      });
    }

    const userRole = req.user.role;

    logHelper.info(`Authorizing user with role: ${userRole}`);

    if (!roles.includes(userRole)) {
      logHelper.warn(`Access denied for role: ${userRole}`);
      return res.status(403).send({
        success: false,
        message: "Access denied. You do not have the required permissions.",
      });
    }

    next();
  };
};

module.exports = authorize;
