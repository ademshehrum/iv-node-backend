const express = require("express");
const { subscribe, paymentCallback } = require("../controllers/subscriptionController");
const authenticate = require("../middlewares/authenticate");

const router = express.Router();

router.post("/", authenticate, subscribe);

// payment pallback
router.post("/callback", paymentCallback);

module.exports = router;
