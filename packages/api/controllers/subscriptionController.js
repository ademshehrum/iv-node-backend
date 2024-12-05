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
      redirectUrl: `${process.env.FRONTEND_URL}/payment-status?refNo=${refNo}`,
      callbackUrl: `${process.env.BACKEND_URL}/api/subscription/callback`,
      apiKey: process.env.MY_API_KEY
    });

    const paymentDetails = paymentResponse.data.paymentDetails;

    await createPaymentRecord({
      userId: req.user.id,
      uniqueKey: paymentDetails.payment_unique_key,
      refNo: refNo,
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

const paymentCallback = async (req, res) => {
  try {
    const { payload } = req.body;

    if (!payload) {
      return res.status(400).send({
        success: false,
        message: "Payload is required.",
      });
    }

    const decodedPayload = Buffer.from(payload, "base64").toString("utf8");

    const paymentDetails = JSON.parse(decodedPayload);

    console.log("Decoded payment dets: ", paymentDetails);

    const {
      payment_unique_key,
      payment_status,
      payment_amount,
      payment_ref_no,
    } = paymentDetails;

    if (!payment_unique_key || !payment_status) {
      return res.status(400).send({
        success: false,
        message: "Invalid payload: missing required fields.",
      });
    }

    if (payment_status === "completed") {
      await updatePaymentStatus(payment_unique_key, payment_status);

      const userId = await findUserIdByPaymentKey(payment_unique_key);
      if (!userId) {
        return res.status(404).send({
          success: false,
          message: "User not found for the given payment key.",
        });
      }

      await updateUserRole(userId, "subscribed");
    }

    // send success response payment gateway / stop receveing callback anymore
    res.status(200).send({ status: "success" });
  } catch (err) {
    console.error("Error processing payment callback:", err.message);
    res.status(500).send({
      success: false,
      message: "Server error while processing payment callback.",
    });
  }
};

module.exports = {
  subscribe,
  paymentCallback,
};