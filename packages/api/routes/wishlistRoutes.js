const express = require("express");
const {
  addWishlist,
  getWishlist,
  deleteWishlist,
} = require("../controllers/wishlistController");
const authenticate = require("../middlewares/authenticate");
const authorize = require("../middlewares/authorize");

const router = express.Router();

// Add to Wishlist
router.post("/", authenticate, authorize(["subscribed"]), addWishlist);

// Get Wishlist
router.get("/", authenticate, authorize(["subscribed"]), getWishlist);

// Delete from Wishlist
router.delete("/:bookId", authenticate, authorize(["subscribed"]), deleteWishlist);

module.exports = router;
