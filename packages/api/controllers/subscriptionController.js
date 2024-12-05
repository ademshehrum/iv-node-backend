const axios = require("axios");
const { signToken } = require("../helpers/jwtHelper");
const {
  updateUserRole,
  updatePaymentStatus,
  createPaymentRecord,
  findUserIdByPaymentKey,
} = require("../models/userModel");
const logHelper = require("../helpers/logHelper");

// init subscription
const subscribe = async (req, res) => {
  const { paymentAmount, refNo, email, name } = req.body;
  // console.log("req.body", req.body);
  // return;

  try {
    const paymentResponse = await axios.post(process.env.PAYMENT_GATEWAY_URL, {
      refNo,
      paymentAmount,
      email,
      name,
      redirectUrl: `${process.env.FRONTEND_URL}/payment-status`,
      callbackUrl: `${process.env.BACKEND_URL}/api/payment/callback`,
      apiKey: process.env.MY_API_KEY
    });

    // console.log(paymentResponse.data);
    // return;
    const paymentDetails = paymentResponse.data.paymentDetails;

    await createPaymentRecord({
      userId: req.user.id,
      uniqueKey: paymentDetails.payment_unique_key,
      refNo: paymentDetails.payment_ref_no,
      status: paymentDetails.payment_status,
      amount: paymentDetails.payment_amount,
    });

    logHelper.info(`Payment created for user ${email}: ${JSON.stringify(paymentDetails)}`);
    res.status(200).json({ success: true, paymentUrl: paymentDetails.payment_link });
  } catch (err) {
    logHelper.error(`Error initiating subscription: ${err.message}`);
    res.status(500).send({ success: false, message: "Server error. Please try again later." });
  }
};

// payment callback
const paymentCallback = async (req, res) => {
  const { payment_unique_key, payment_status } = req.body.paymentDetails;

  try {
    logHelper.info(`Payment callback received: ${JSON.stringify(req.body)}`);

    if (!payment_unique_key || !payment_status) {
      logHelper.warn("Invalid callback parameters.");
      return res.status(400).send("Invalid callback parameters.");
    }

    // update payment status
    await updatePaymentStatus(payment_unique_key, payment_status);

    if (payment_status === "success") {
      const userId = await findUserIdByPaymentKey(payment_unique_key);
      if (!userId) {
        logHelper.warn(`User not found for payment key: ${payment_unique_key}`);
        return res.status(404).send("User not found.");
      }

      // update role to "subscribed"
      await updateUserRole(userId, "subscribed");
      logHelper.info(`User ${userId} subscription updated to 'subscribed'.`);
    }

    res.status(200).json({ status: "success" });
  } catch (error) {
    logHelper.error(`Error processing payment callback: ${error.message}`);
    res.status(500).send("Server error.");
  }
};

module.exports = {
  subscribe,
  paymentCallback,
};