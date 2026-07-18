const {
  getUserHistory,
  deleteScanItem,
  clearAllUserHistory,
  getDashboardStats
} = require("../Services/history.service");
const { getFavoritesCount } = require("../Services/favorite.service");

/**
 * Controller: getHistory
 * GET /api/history
 * Query: search, filter, sort, page, limit
 */
async function getHistory(req, res) {
  try {
    const { search, filter, sort, page, limit } = req.query;
    const historyData = await getUserHistory(req.userId, {
      search,
      filter,
      sort,
      page,
      limit
    });

    return res.status(200).json({
      success: true,
      message: "History fetched successfully",
      data: historyData
    });
  } catch (error) {
    console.error("Error in getHistory controller:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch history",
      data: null
    });
  }
}

/**
 * Controller: deleteHistoryItem
 * DELETE /api/history/:id
 */
async function deleteHistoryItem(req, res) {
  try {
    const { id } = req.params;
    const deleted = await deleteScanItem(req.userId, id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Scan record not found or unauthorized",
        data: null
      });
    }

    return res.status(200).json({
      success: true,
      message: "Scan record deleted successfully",
      data: deleted
    });
  } catch (error) {
    console.error("Error in deleteHistoryItem controller:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to delete scan record",
      data: null
    });
  }
}

/**
 * Controller: clearHistory
 * DELETE /api/history
 */
async function clearHistory(req, res) {
  try {
    const result = await clearAllUserHistory(req.userId);
    return res.status(200).json({
      success: true,
      message: "All scan history cleared successfully",
      data: { deletedCount: result.deletedCount }
    });
  } catch (error) {
    console.error("Error in clearHistory controller:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to clear history",
      data: null
    });
  }
}

/**
 * Controller: getDashboardStatsController
 * GET /api/dashboard/stats
 */
async function getDashboardStatsController(req, res) {
  try {
    const stats = await getDashboardStats(req.userId);
    const favCount = await getFavoritesCount(req.userId);

    // Inject favorites count into dashboard cards
    stats.cards.favorites = favCount;

    return res.status(200).json({
      success: true,
      message: "Dashboard stats fetched successfully",
      data: stats
    });
  } catch (error) {
    console.error("Error in getDashboardStatsController:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch dashboard stats",
      data: null
    });
  }
}

module.exports = {
  getHistory,
  deleteHistoryItem,
  clearHistory,
  getDashboardStatsController
};
