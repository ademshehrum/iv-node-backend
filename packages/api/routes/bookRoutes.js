const express = require("express");
const authenticate = require("../middlewares/authenticate");
const { getAllBooks, getBookById } = require("../models/bookModel");

const router = express.Router();

// Get all books (based on role)
router.get("/books", authenticate, (req, res) => {
  const books = getAllBooks(req.user.role); // Get books based on user role
  res.status(200).json(books);
});

// Get book by ID
router.get("/books/:id", authenticate, (req, res) => {
  const book = getBookById(Number(req.params.id));
  if (!book) {
    return res.status(404).send("Book not found.");
  }
  res.status(200).json(book);
});

module.exports = router;
