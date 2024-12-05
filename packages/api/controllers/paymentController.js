const { getPaymentByRefNo } = require("../models/paymentModel");
const logHelper = require("../helpers/logHelper");

// Get Payment Status by RefNo
const getPaymentStatus = async (req, res) => {
  const { refNo } = req.query;

  if (!refNo) {
    logHelper.warn("Missing payment reference number.");
    return res.status(400).send({
      success: false,
      message: "Payment reference number is required.",
    });
  }

  try {
    const payment = await getPaymentByRefNo(refNo);

    if (!payment) {
      logHelper.warn(`Payment not found for refNo: ${refNo}`);
      return res.status(404).send({
        success: false,
        message: "Payment not found.",
      });
    }

    logHelper.info(`Payment retrieved for refNo: ${refNo}`);
    res.status(200).send({ success: true, data: payment });
  } catch (err) {
    logHelper.error(`Error fetching payment status: ${err.message}`);
    res.status(500).send({
      success: false,
      message: "Server error while fetching payment status.",
    });
  }
};

module.exports = {
  getPaymentStatus,
};
