const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    brand: {
      type: String,
      default: 'Unknown',
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },
    mrp: {
      type: Number,
      required: true,
    },
    sellingPrice: {
      type: Number,
      required: true,
    },
    stock: {
      type: Number,
      required: true,
      default: 0,
    },
    lowStockThreshold: {
      type: Number,
      default: 10,
    },
    images: [
      {
        type: String,
        required: true,
      }
    ],
    // PREMIUM FEATURES
    isBestSeller: { type: Boolean, default: false },
    isNewArrival: { type: Boolean, default: false },
    discountPercentage: { type: Number, default: 0 },
    
    // NUTRITION & DETAILS
    nutritionInfo: { type: String, default: '' },
    ingredients: { type: String, default: '' },
    storageInstructions: { type: String, default: '' },
    expiryDate: { type: Date },
    manufacturerDetails: { type: String, default: '' },
    countryOfOrigin: { type: String, default: 'India' },
    barcode: { type: String, default: '' },
    qrCode: { type: String, default: '' },
    unit: {
      type: String,
      required: true, // e.g., '1 kg', '500 g', '1 L'
    },
    // ULTRA-PREMIUM GROCERY FEATURES
    allergens: [{ type: String }],
    harvestDate: { type: Date },
    freshnessLevel: { type: Number, min: 1, max: 10, default: 10 },
    ripenessLevel: { type: String, enum: ['Underripe', 'Ripe', 'Overripe', 'N/A'], default: 'N/A' },
    qualityGrade: { type: String, enum: ['A+', 'A', 'B', 'N/A'], default: 'A+' },
    bulkDiscounts: [
      {
        minQuantity: Number,
        discountPercentage: Number
      }
    ],
    tags: [
      {
        type: String, // e.g., 'organic', 'bestseller'
      },
    ],
    barcode: {
      type: String,
      default: '',
    },
    qrCode: {
      type: String,
      default: '',
    },
    gstPercentage: {
      type: Number,
      default: 0,
    },
    expiresAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Product', productSchema);
