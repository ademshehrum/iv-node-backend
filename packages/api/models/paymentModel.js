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

// Check payment by refNo
const getPaymentByRefNo = async (refNo) => {
  const query = "SELECT * FROM payments WHERE payment_ref_no = ?";
  const results = await executeQuery(query, [refNo]);
  return results[0];
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

// Find user ID by payment unique key
const findUserIdByPaymentKey = async (uniqueKey) => {
  const query = `
    SELECT user_id FROM payments WHERE payment_unique_key = ?
  `;
  const results = await executeQuery(query, [uniqueKey]);
  return results[0]?.user_id;
};

// Update user role
const updateUserRole = async (userId, role) => {
  const query = `
    UPDATE users SET role = ? WHERE id = ?
  `;
  const result = await executeQuery(query, [role, userId]);
  return result.affectedRows > 0;
};

module.exports = {
  getPaymentByRefNo,
  createPaymentRecord,
  updatePaymentStatus,
  findUserIdByPaymentKey,
  updateUserRole,
};