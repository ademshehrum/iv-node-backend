const express = require("express");
const router = express.Router();
const { getPaymentByRefNo } = require("../models/paymentModel");

router.get("/status", async (req, res) => {
  const { refNo } = req.query;

  if (!refNo) {
    return res.status(400).send({ success: false, message: "Payment reference number is required." });
  }

  try {
    const payment = await getPaymentByRefNo(refNo);

    if (!payment) {
      return res.status(404).send({ success: false, message: "Payment not found." });
    }

    res.status(200).send({ success: true, data: payment });
  } catch (err) {
    console.error("Error fetching payment status:", err.message);
    res.status(500).send({ success: false, message: "Server error." });
  }
});

module.exports = router;
