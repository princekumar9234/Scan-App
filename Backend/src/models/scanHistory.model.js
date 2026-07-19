const mongoose = require("mongoose");

/**
 * ScanHistory Schema
 * Stores every successful product scan linked to a user.
 * Supports food, petfood, and general products.
 */
const scanHistorySchema = new mongoose.Schema(
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
    productType: {
      type: String,
      enum: ["food", "petfood", "product"],
      default: "food",
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
    nutrition: {
      calories: { type: Number, default: 0 },
      protein: { type: Number, default: 0 },
      fat: { type: Number, default: 0 },
      carbohydrates: { type: Number, default: 0 },
      sugar: { type: Number, default: 0 },
      fiber: { type: Number, default: 0 },
      salt: { type: Number, default: 0 },
      sodium: { type: Number, default: 0 },
      energy: { type: Number, default: 0 },
    },
    healthScore: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      default: "Moderate",
    },
    details: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    scanDate: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true },
);

const ScanHistory = mongoose.model("ScanHistory", scanHistorySchema);
module.exports = ScanHistory;
