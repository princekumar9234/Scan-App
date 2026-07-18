const { getProductByBarcode } = require("../Services/product.service");
const { saveToHistory } = require("../Services/history.service");

/**
 * Controller: scanProduct
 * POST /api/products/scan
 * Body: { barcode: "8901491101835" }
 */
async function scanProduct(req, res) {
  try {
    const { barcode } = req.body;

    if (!barcode) {
      return res.status(400).json({
        success: false,
        message: "Barcode is required",
        data: null,
      });
    }

    const product = await getProductByBarcode(barcode);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: `Product with barcode ${barcode} not found in the food database`,
        data: null,
      });
    }

    // Automatically save the successful scan to user's history
    await saveToHistory(req.userId, product);

    return res.status(200).json({
      success: true,
      message: "Product scanned and analyzed successfully",
      data: product,
    });
  } catch (error) {
    console.error("Error in scanProduct controller:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "An error occurred while scanning the product",
      data: null,
    });
  }
}

module.exports = { scanProduct };
