const db = require("../config/database");

// add book to the wishlist
const addToWishlist = async (userId, bookId, bookName, bookImage, bookUrl) => {
  const query = `
    INSERT INTO wishlist (user_id, book_id, book_name, book_image, book_url)
    VALUES (?, ?, ?, ?, ?)
  `;
  const [result] = await db.query(query, [userId, bookId, bookName, bookImage, bookUrl]);
  return result.insertId;
};

// check if book already in wishlist
const checkWishlist = async (userId, bookId) => {
  const query = "SELECT * FROM wishlist WHERE user_id = ? AND book_id = ?";
  const [results] = await db.query(query, [userId, bookId]);
  return results.length > 0;
};

// fetch all user wishlist items
const getWishlistByUserId = async (userId) => {
  const query = "SELECT * FROM wishlist WHERE user_id = ?";
  const [results] = await db.query(query, [userId]);
  return results;
};

// Remove book from wishlist
const removeFromWishlist = async (userId, bookId) => {
  const query = "DELETE FROM wishlist WHERE user_id = ? AND book_id = ?";
  await db.query(query, [userId, bookId]);
};

module.exports = {
  addToWishlist,
  checkWishlist,
  getWishlistByUserId,
  removeFromWishlist,
};
