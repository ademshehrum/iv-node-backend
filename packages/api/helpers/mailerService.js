const axios = require("axios");

const sendEmail = async (toEmail, toName, subject, templateId, contentArray) => {
  const apiKey = process.env.MY_API_KEY;
  const apiUrl = process.env.EMAIL_API_URL;

  if (!toEmail || !templateId || !contentArray || contentArray.length === 0) {
    throw new Error("Missing required param");
  }
  if (!apiKey || !apiUrl) {
    throw new Error("API key or URL not configured");
  }

  try {
    const payload = {
      toEmail,
      toName,
      subject,
      templateId,
      emailContent: contentArray,
      apiKey,
    };

    const response = await axios.post(apiUrl, payload);

    if (response.status === 200) {
      return { success: true, message: "Email sent successfully" };
    } else {
      console.error("Email API returned an error:", response.data);
      return { success: false, message: response.data };
    }
  } catch (error) {
    console.error("Error sending email:", error.message);
    return { success: false, message: error.message };
  }
};

module.exports = { sendEmail };