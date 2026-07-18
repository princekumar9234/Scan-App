const ScanHistory = require("../models/scanHistory.model");

/**
 * Save scan to history
 */
async function saveToHistory(userId, productData) {
  try {
    const scanRecord = await ScanHistory.create({
      userId,
      barcode: productData.barcode,
      productName: productData.productName,
      brand: productData.brand,
      image: productData.image,
      nutrition: productData.nutrition,
      healthScore: productData.healthAnalysis.score,
      status: productData.healthAnalysis.status,
    });
    return scanRecord;
  } catch (error) {
    console.error("Error saving scan history:", error);
    throw error;
  }
}

/**
 * Get user's history with search, filter, sort, and pagination.
 */
async function getUserHistory(userId, options = {}) {
  try {
    const { search = "", filter = "", sort = "desc", page = 1, limit = 10 } = options;

    const query = { userId };

    // Search filter
    if (search.trim()) {
      query.$or = [
        { productName: { $regex: search, $options: "i" } },
        { brand: { $regex: search, $options: "i" } },
        { barcode: { $regex: search, $options: "i" } }
      ];
    }

    // Health status filter
    if (filter && ["Healthy", "Moderate", "Unhealthy"].includes(filter)) {
      query.status = filter;
    }

    // Sorting
    const sortOption = {};
    if (sort === "asc") {
      sortOption.scanDate = 1;
    } else if (sort === "name") {
      sortOption.productName = 1;
    } else {
      sortOption.scanDate = -1; // Default: newest first
    }

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const limitNum = parseInt(limit);

    const total = await ScanHistory.countDocuments(query);
    const history = await ScanHistory.find(query)
      .sort(sortOption)
      .skip(skip)
      .limit(limitNum);

    return {
      history,
      pagination: {
        total,
        page: parseInt(page),
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum)
      }
    };
  } catch (error) {
    console.error("Error fetching scan history:", error);
    throw error;
  }
}

/**
 * Delete a single scan by ID (verifying it belongs to user)
 */
async function deleteScanItem(userId, id) {
  try {
    const result = await ScanHistory.findOneAndDelete({ _id: id, userId });
    return result;
  } catch (error) {
    console.error("Error deleting scan item:", error);
    throw error;
  }
}

/**
 * Delete all scans for a user
 */
async function clearAllUserHistory(userId) {
  try {
    const result = await ScanHistory.deleteMany({ userId });
    return result;
  } catch (error) {
    console.error("Error clearing user history:", error);
    throw error;
  }
}

/**
 * Get dashboard stats for a user:
 * Total Scans, Healthy Products, Moderate Products, Unhealthy Products, Weekly Scan Chart Data, Health Distribution Chart, Most Scanned Products.
 */
async function getDashboardStats(userId) {
  try {
    const totalScans = await ScanHistory.countDocuments({ userId });
    const healthyScans = await ScanHistory.countDocuments({ userId, status: "Healthy" });
    const moderateScans = await ScanHistory.countDocuments({ userId, status: "Moderate" });
    const unhealthyScans = await ScanHistory.countDocuments({ userId, status: "Unhealthy" });

    // Weekly Scan Chart Data (last 7 days counts)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const weeklyAggregate = await ScanHistory.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId),
          scanDate: { $gte: sevenDaysAgo }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$scanDate" } },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Most Scanned Products
    const mostScanned = await ScanHistory.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId) } },
      {
        $group: {
          _id: "$barcode",
          productName: { $first: "$productName" },
          brand: { $first: "$brand" },
          image: { $first: "$image" },
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);

    // Recent 5 scans
    const recentScans = await ScanHistory.find({ userId })
      .sort({ scanDate: -1 })
      .limit(5);

    return {
      cards: {
        totalScans,
        healthyProducts: healthyScans,
        moderateProducts: moderateScans,
        unhealthyProducts: unhealthyScans,
      },
      charts: {
        weeklyScan: weeklyAggregate,
        mostScanned: mostScanned,
      },
      recentScans
    };
  } catch (error) {
    console.error("Error gathering dashboard stats:", error);
    throw error;
  }
}

module.exports = {
  saveToHistory,
  getUserHistory,
  deleteScanItem,
  clearAllUserHistory,
  getDashboardStats
};
const mongoose = require("mongoose");
