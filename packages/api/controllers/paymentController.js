const { findUserIdByPaymentKey } = require("../models/userModel");

const getPaymentStatus = async (req, res) => {
  const { uniqueKey } = req.query;

  if (!uniqueKey) {
    return res.status(400).send({ success: false, message: "Unique key is required." });
  }

  try {
    const userId = await findUserIdByPaymentKey(uniqueKey);

    if (!userId) {
      return res.status(404).send({ success: false, message: "Payment not found." });
    }

    res.status(200).send({ success: true, message: "Payment verified successfully." });
  } catch (err) {
    res.status(500).send({ success: false, message: "Error fetching payment status." });
  }
};

module.exports = {
  getPaymentStatus,
};