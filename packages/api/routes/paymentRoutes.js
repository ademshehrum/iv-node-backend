const express = require("express");
const { getPaymentStatus } = require("../controllers/paymentController");

const router = express.Router();

router.get("/status", getPaymentStatus);

module.exports = router;