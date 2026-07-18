const express = require("express");
const {
  getHistory,
  deleteHistoryItem,
  clearHistory,
  getDashboardStatsController,
} = require("../Controllers/history.controller");
const { verifyToken } = require("../middlewares/auth.middleware");

const router = express.Router();

// Protected history endpoints
router.get("/", verifyToken, getHistory);
router.delete("/:id", verifyToken, deleteHistoryItem);
router.delete("/", verifyToken, clearHistory);

// Protected stats for dashboard
router.get("/stats/summary", verifyToken, getDashboardStatsController);

module.exports = router;
