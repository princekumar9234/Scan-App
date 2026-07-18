const { analyzeNutrition } = require("./health.service");

/**
 * Product Service
 * Fetches product data from Open Food Facts API and processes it.
 */
async function getProductByBarcode(barcode) {
  try {
    const apiBaseUrl = process.env.FOOD_API_URL || "https://world.openfoodfacts.org/api/v2/product/";
    const response = await fetch(`${apiBaseUrl}${barcode}.json`);

    if (!response.ok) {
      throw new Error("Failed to fetch product from Open Food Facts");
    }

    const result = await response.json();

    if (result.status !== 1 || !result.product) {
      return null;
    }

    const p = result.product;
    const nutriments = p.nutriments || {};

    // Standard Open Food Facts returns sodium in grams, let's convert to mg for analysis
    const sodiumGrams = parseFloat(nutriments.sodium_100g || 0);
    const sodiumMg = Math.round(sodiumGrams * 1000);

    const nutritionData = {
      calories: Math.round(
        parseFloat(
          nutriments["energy-kcal_100g"] || nutriments["energy-kcal"] || 0,
        ),
      ),
      protein: parseFloat(nutriments.proteins_100g || nutriments.proteins || 0),
      fat: parseFloat(nutriments.fat_100g || nutriments.fat || 0),
      carbohydrates: parseFloat(
        nutriments.carbohydrates_100g || nutriments.carbohydrates || 0,
      ),
      sugar: parseFloat(nutriments.sugars_100g || nutriments.sugars || 0),
      fiber: parseFloat(nutriments.fiber_100g || nutriments.fiber || 0),
      salt: parseFloat(nutriments.salt_100g || nutriments.salt || 0),
      sodium: sodiumMg,
      energy: Math.round(
        parseFloat(nutriments.energy_100g || nutriments.energy || 0),
      ),
    };

    // Rule based analysis
    const analysis = analyzeNutrition(nutritionData);

    // Clean JSON return format
    return {
      barcode: barcode,
      productName: p.product_name || "Unknown Product",
      brand: p.brands || "Generic Brand",
      category: p.categories ? p.categories.split(",")[0] : "General Food",
      image:
        p.image_front_url ||
        p.image_url ||
        "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=300&auto=format&fit=crop&q=60",
      ingredients: p.ingredients_text || "No ingredients listed.",
      servingSize: p.serving_size || "100g",
      productGrade: p.nutriscore_grade
        ? p.nutriscore_grade.toUpperCase()
        : "N/A",
      nutrition: nutritionData,
      healthAnalysis: analysis,
    };
  } catch (error) {
    console.error("Error inside ProductService:", error);
    throw error;
  }
}

module.exports = { getProductByBarcode };
