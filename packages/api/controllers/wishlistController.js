const {
  addToWishlist,
  getWishlistByUserId,
  removeFromWishlist,
  checkWishlist,
} = require("../models/wishlistModel");

const logHelper = require("../helpers/logHelper");

// Add a book to the wishlist
const addWishlist = async (req, res) => {
  const { bookId, bookName, bookImage, bookUrl } = req.body;
  const userId = req.user.id;

  if (!bookId || !bookName || !bookUrl) {
    return res.status(400).send({
      success: false,
      message: "Book ID, name, and URL are required.",
    });
  }

  try {
    // Check if book is already in wishlist
    const exists = await checkWishlist(userId, bookId);
    if (exists) {
      return res.status(400).send({
        success: false,
        message: "Book is already in wishlist.",
      });
    }

    // Add book to wishlist
    const result = await addToWishlist(userId, bookId, bookName, bookImage, bookUrl);
    logHelper.info(`Book ${bookId} added to wishlist for user ${userId}`);
    res.status(201).send({
      success: true,
      message: "Book added to wishlist",
      data: { userId, bookId, bookName, result },
    });
  } catch (err) {
    logHelper.error(`Error adding book to wishlist: ${err.message}`);
    res.status(500).send({
      success: false,
      message: "Failed to add book to wishlist",
    });
  }
};

// Get the wishlist for current user
const getWishlist = async (req, res) => {
  const userId = req.user.id;

  try {
    const wishlist = await getWishlistByUserId(userId);

    if (!wishlist || wishlist.length === 0) {
      return res.status(200).send({
        success: true,
        message: "Your wishlist is empty.",
        data: [],
      });
    }

    logHelper.info(`Fetched wishlist for user ${userId}`);
    res.status(200).send({ success: true, data: wishlist });
  } catch (err) {
    logHelper.error(`Error fetching wishlist: ${err.message}`);
    res.status(500).send({
      success: false,
      message: "Failed to fetch wishlist.",
    });
  }
};

// Remove a book from the wishlist
const deleteWishlist = async (req, res) => {
  const { bookId } = req.params;
  const userId = req.user.id;

  if (!bookId) {
    return res.status(400).send({
      success: false,
      message: "Book ID is required.",
    });
  }

  try {
    const result = await removeFromWishlist(userId, bookId);
    logHelper.info(`Book ${bookId} removed from wishlist for user ${userId}`);
    res.status(200).send({
      success: true,
      message: "Book removed from wishlist.",
      data: result,
    });
  } catch (err) {
    logHelper.error(`Error removing book from wishlist: ${err.message}`);
    res.status(500).send({
      success: false,
      message: "Failed to remove book from wishlist.",
    });
  }
};

module.exports = {
  addWishlist,
  getWishlist,
  deleteWishlist,
};
