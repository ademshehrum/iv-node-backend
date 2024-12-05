const db = require("../config/database");
const logHelper = require("../helpers/logHelper");

const executeQuery = async (query, params) => {
  try {
    const [results] = await db.query(query, params);
    return results;
  } catch (err) {
    logHelper.error("Error executing query:", err.message);
    throw err;
  }
};

// Check by email
const getUserByEmail = async (email) => {
  const query = "SELECT * FROM users WHERE email = ?";
  const results = await executeQuery(query, [email]);
  return results[0];
};

// Add user
const createUser = async ({ name, email, uuid }) => {
  const query = "INSERT INTO users (name, email, uuid) VALUES (?, ?, ?)";
  try {
    const result = await executeQuery(query, [name, email, uuid]);
    return result.insertId;
  } catch (err) {
    console.error("Error creating user:", err.message);
    throw err;
  }
};

// Update user password
const updateUserPassword = async (uuid, passwordHash) => {
  const query = "UPDATE users SET password = ?, role = 'basic' WHERE uuid = ?";
  return await executeQuery(query, [passwordHash, uuid]);
};

// Get user by UUID
const getUserByUUID = async (uuid) => {
  const query = "SELECT * FROM users WHERE uuid = ?";
  const results = await executeQuery(query, [uuid]);
  return results[0] || null;
};

// Create payment record
const createPaymentRecord = async ({ userId, uniqueKey, refNo, status, amount }) => {
  const query = `
    INSERT INTO payments (user_id, payment_unique_key, payment_ref_no, payment_status, payment_amount)
    VALUES (?, ?, ?, ?, ?)
  `;
  return await executeQuery(query, [userId, uniqueKey, refNo, status, amount]);
};

// Update payment status
const updatePaymentStatus = async (uniqueKey, status) => {
  const query = `
    UPDATE payments SET payment_status = ? WHERE payment_unique_key = ?
  `;
  return await executeQuery(query, [status, uniqueKey]);
};

// Get user by payment key
const findUserIdByPaymentKey = async (uniqueKey) => {
  const query = `
    SELECT user_id FROM payments WHERE payment_unique_key = ?
  `;
  const results = await executeQuery(query, [uniqueKey]);
  return results[0]?.user_id;
};

// Get user by ID
const getUserById = async (id) => {
  const query = "SELECT * FROM users WHERE id = ?";
  const results = await executeQuery(query, [id]);
  return results[0] || null;
};

// Update user role after payment completion
const updateUserRole = async (userId, role) => {
  const query = "UPDATE users SET role = ? WHERE id = ?";
  const result = await executeQuery(query, [role, userId]);
  return result.affectedRows > 0;
};

module.exports = {
  getUserByEmail,
  createUser,
  updateUserPassword,
  getUserByUUID,
  createPaymentRecord,
  updatePaymentStatus,
  findUserIdByPaymentKey,
  getUserById,
  updateUserRole,
};
