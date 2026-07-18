const mongoose = require("mongoose");

/**
 * Favorite Schema
 * Stores products a user has bookmarked.
 */
const favoriteSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    barcode: {
      type: String,
      required: true,
    },
    productName: {
      type: String,
      default: "Unknown Product",
    },
    brand: {
      type: String,
      default: "",
    },
    image: {
      type: String,
      default: "",
    },
    healthScore: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ["Healthy", "Moderate", "Unhealthy"],
      default: "Moderate",
    },
  },
  { timestamps: true },
);

// Prevent duplicate favorites per user per barcode
favoriteSchema.index({ userId: 1, barcode: 1 }, { unique: true });

const Favorite = mongoose.model("Favorite", favoriteSchema);
module.exports = Favorite;
