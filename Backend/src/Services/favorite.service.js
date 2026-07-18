const Favorite = require("../models/favorite.model");

/**
 * Add product to favorites
 */
async function addFavorite(userId, productData) {
  try {
    // Check if it already exists to avoid throwing duplicate key errors directly
    const existing = await Favorite.findOne({
      userId,
      barcode: productData.barcode,
    });
    if (existing) {
      return existing;
    }

    const fav = await Favorite.create({
      userId,
      barcode: productData.barcode,
      productName: productData.productName,
      brand: productData.brand,
      image: productData.image,
      healthScore: productData.healthScore || 0,
      status: productData.status || "Moderate",
    });

    return fav;
  } catch (error) {
    console.error("Error adding to favorites:", error);
    throw error;
  }
}

/**
 * Get all favorites for a user
 */
async function getUserFavorites(userId) {
  try {
    const favorites = await Favorite.find({ userId }).sort({ createdAt: -1 });
    return favorites;
  } catch (error) {
    console.error("Error fetching favorites:", error);
    throw error;
  }
}

/**
 * Remove a favorite by MongoDB _id (verifying it belongs to user)
 */
async function removeFavoriteById(userId, id) {
  try {
    const result = await Favorite.findOneAndDelete({ _id: id, userId });
    return result;
  } catch (error) {
    console.error("Error removing favorite:", error);
    throw error;
  }
}

/**
 * Get favorites count for a user (needed for dashboard stats card)
 */
async function getFavoritesCount(userId) {
  try {
    const count = await Favorite.countDocuments({ userId });
    return count;
  } catch (error) {
    console.error("Error getting favorites count:", error);
    throw error;
  }
}

module.exports = {
  addFavorite,
  getUserFavorites,
  removeFavoriteById,
  getFavoritesCount,
};
