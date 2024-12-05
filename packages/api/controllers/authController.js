const { v4: uuidv4 } = require("uuid");
const { verifyToken, signToken } = require("../helpers/jwtHelper");
const { hashPassword, comparePassword, isValidEmail } = require("../helpers/authHelper");
const { createUser, getUserByEmail, getUserByUUID, updateUserPassword, getUserById } = require("../models/userModel");
const { sendEmail } = require("../helpers/mailerService");
const logHelper = require("../helpers/logHelper");

// Register
const register = async (req, res) => {
  const { name, email } = req.body;

  if (!isValidEmail(email)) {
    logHelper.error(`Invalid email format: ${email}`);
    return res.status(400).send("Invalid email format.");
  }

  try {
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      logHelper.warn(`Attempt to register an already registered email: ${email}`);
      return res.status(400).send("Email is already registered.");
    }

    const uuid = uuidv4();
    await createUser({ name, email, uuid });

    const token = signToken({ uuid }, "1d");

    const link = `${process.env.FRONTEND_URL}set-password?token=${token}`;
    const emailContent = [
      { Key: "name", Value: name },
      { Key: "url", Value: link },
    ];
    const subject = "Complete your registration";
    const templateId = "1";

    await sendEmail(email, name, subject, templateId, emailContent);

    logHelper.info(`Registration email sent to: ${email}`);
    res.status(200).send("Registration successful. Check your email to set your password.");
  } catch (err) {
    logHelper.error(`Error during registration: ${err.message}`);
    res.status(500).send("Server error. Please try again later.");
  }
};

// Set password
const setPassword = async (req, res) => {
  const { token, password } = req.body;

  if (!token || !password) {
    logHelper.error("Token or password missing in setPassword request.");
    return res.status(400).send({
      success: false,
      message: "Token and password are required.",
    });
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    logHelper.error("Invalid or expired token.");
    return res.status(400).send({
      success: false,
      message: "Invalid or expired token. Please request a new link.",
    });
  }

  try {
    // Fetch user by UUID from the token
    const { uuid } = decoded;
    const user = await getUserByUUID(uuid);
    if (!user) {
      logHelper.error(`User not found for UUID: ${uuid}`);
      return res.status(404).send({
        success: false,
        message: "User not found.",
      });
    }

    const passwordHash = await hashPassword(password);

    await updateUserPassword(uuid, passwordHash);

    logHelper.info(`Password set successfully for user: ${user.email}`);
    return res.status(200).send({
      success: true,
      message: "Password set successfully. You can now log in.",
    });
  } catch (err) {
    logHelper.error(`Error setting password: ${err.message}`);
    return res.status(500).send({
      success: false,
      message: "Server error. Please try again later.",
    });
  }
};

// Resend Registration Email
const resendRegistrationEmail = async (req, res) => {
  const { email } = req.body;

  if (!isValidEmail(email)) {
    logHelper.error(`Invalid email format for resend: ${email}`);
    return res.status(400).send("Invalid email format.");
  }

  try {
    const user = await getUserByEmail(email);
    if (!user) {
      logHelper.warn(`Attempt to resend registration email for non-existent user: ${email}`);
      return res.status(404).send("User not found.");
    }

    const token = signToken({ uuid: user.uuid }, "1d");

    const link = `${process.env.FRONTEND_URL}register?token=${token}`;
    const emailContent = [
      { Key: "name", Value: user.name },
      { Key: "url", Value: link },
    ];
    const subject = "Complete your registration";
    const templateId = "1";

    await sendEmail(user.email, user.name, subject, templateId, emailContent);

    logHelper.info(`Resend registration email sent to: ${email}`);
    res.status(200).send("New registration email sent. Please check your inbox.");
  } catch (err) {
    logHelper.error(`Error resending registration email: ${err.message}`);
    res.status(500).send("Server error. Please try again later.");
  }
};

// Login
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Validate input
    if (!email || !password) {
      logHelper.warn("Email or password not provided during login.");
      return res.status(400).send("Email and password are required.");
    }

    // Fetch user by email
    const user = await getUserByEmail(email);
    if (!user) {
      logHelper.warn(`Login failed for non-existent email: ${email}`);
      return res.status(401).send("Invalid email or password.");
    }

    // Compare passwords using authHelper
    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      logHelper.warn(`Invalid password for email: ${email}`);
      return res.status(401).send("Invalid email or password.");
    }

    const token = signToken({ id: user.id, role: user.role }, "1h");

    res.cookie("authToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict", // Mitigate CSRF
      maxAge: 60 * 60 * 1000, // 1 hour
    });

    logHelper.info(`Login successful for email: ${email}`);
    res.status(200).send("Login successful.");
  } catch (err) {
    logHelper.error(`Error during login: ${err.message}`);
    res.status(500).send("Server error. Please try again later.");
  }
};

// Logout
const logout = (req, res) => {
  res.clearCookie("authToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Strict",
  });
  res.status(200).send("Logout successful.");
};

// get details
const getProfile = async (req, res) => {
  try {
    const userId = req.user.id; // Extract user ID from the authenticated request
    const user = await getUserById(userId);

    if (!user) {
      return res.status(404).send("User not found.");
    }

    res.status(200).json({
      name: user.name,
      email: user.email,
      plan: user.role, // Assuming 'role' defines plan: 'basic' or 'subscribed'
    });
  } catch (err) {
    console.error("Error fetching user profile:", err.message);
    res.status(500).send("Server error. Please try again later.");
  }
};

//refresh token
const refreshToken = (req, res) => {
  try {
    const { id, role } = req.user;
    const token = signToken({ id, role });
    res.status(200).send({ success: true, token });
  } catch (err) {
    console.error("Error refreshing token:", err.message);
    res.status(500).send({ success: false, message: "Failed to generate token." });
  }
};

module.exports = { register, setPassword, resendRegistrationEmail, login, logout, getProfile, refreshToken };