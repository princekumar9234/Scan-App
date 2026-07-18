const {
  addFavorite,
  getUserFavorites,
  removeFavoriteById
} = require("../Services/favorite.service");

/**
 * Controller: addToFavorites
 * POST /api/favorites
 * Body: { barcode, productName, brand, image, healthScore, status }
 */
async function addToFavorites(req, res) {
  try {
    const { barcode, productName, brand, image, healthScore, status } = req.body;

    if (!barcode) {
      return res.status(400).json({
        success: false,
        message: "Barcode is required to favorite a product",
        data: null
      });
    }

    const fav = await addFavorite(req.userId, {
      barcode,
      productName,
      brand,
      image,
      healthScore,
      status
    });

    return res.status(201).json({
      success: true,
      message: "Product added to favorites successfully",
      data: fav
    });
  } catch (error) {
    console.error("Error in addToFavorites controller:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to add product to favorites",
      data: null
    });
  }
}

/**
 * Controller: getFavorites
 * GET /api/favorites
 */
async function getFavorites(req, res) {
  try {
    const favorites = await getUserFavorites(req.userId);
    return res.status(200).json({
      success: true,
      message: "Favorites fetched successfully",
      data: favorites
    });
  } catch (error) {
    console.error("Error in getFavorites controller:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch favorites",
      data: null
    });
  }
}

/**
 * Controller: removeFavorite
 * DELETE /api/favorites/:id
 */
async function removeFavorite(req, res) {
  try {
    const { id } = req.params;
    const deleted = await removeFavoriteById(req.userId, id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Favorite record not found or unauthorized",
        data: null
      });
    }

    return res.status(200).json({
      success: true,
      message: "Product removed from favorites successfully",
      data: deleted
    });
  } catch (error) {
    console.error("Error in removeFavorite controller:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to remove favorite",
      data: null
    });
  }
}

module.exports = {
  addToFavorites,
  getFavorites,
  removeFavorite
};
