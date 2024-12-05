const express = require("express");
const { register, setPassword, resendRegistrationEmail, login, logout, getProfile, refreshToken } = require("../controllers/authController");
const authenticate = require("../middlewares/authenticate");

const router = express.Router();

router.post("/register", register);
router.post("/set-password", setPassword);
router.post("/resend-email", resendRegistrationEmail);
router.post("/login", login);
router.post("/logout", logout)
router.get("/getProfile", authenticate, getProfile);
router.post("/refresh-token", refreshToken);
  

module.exports = router;
