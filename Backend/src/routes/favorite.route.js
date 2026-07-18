const express = require("express");
const {
  addToFavorites,
  getFavorites,
  removeFavorite,
} = require("../Controllers/favorite.controller");
const { verifyToken } = require("../middlewares/auth.middleware");

const router = express.Router();

// Protected favorites endpoints
router.post("/", verifyToken, addToFavorites);
router.get("/", verifyToken, getFavorites);
router.delete("/:id", verifyToken, removeFavorite);

module.exports = router;
