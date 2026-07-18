const express = require("express");
const { scanProduct } = require("../Controllers/product.controller");
const { verifyToken } = require("../middlewares/auth.middleware");

const router = express.Router();

// Protected scanning endpoint
router.post("/scan", verifyToken, scanProduct);

module.exports = router;
