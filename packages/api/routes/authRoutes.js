const express = require("express");
const { register, setPassword, resendRegistrationEmail, login, logout, getProfile } = require("../controllers/authController");
const authenticate = require("../middlewares/authenticate");

const router = express.Router();

router.post("/register", register);
router.post("/set-password", setPassword);
router.post("/resend-email", resendRegistrationEmail);
router.post("/login", login);
router.post("/logout", logout)
router.get("/getProfile", authenticate, getProfile);

router.post("/refresh-token", authenticate, (req, res) => {
    const { id, role } = req.user;
  
    try {
      const newToken = signToken({ id, role });
      res.status(200).send({ success: true, token: newToken });
    } catch (err) {
      res.status(500).send({ success: false, message: "Failed to generate token." });
    }
});
  

module.exports = router;
