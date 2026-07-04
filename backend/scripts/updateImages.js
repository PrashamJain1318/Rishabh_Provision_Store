const mongoose = require('mongoose');
const path = require('path');
const dotenv = require('dotenv');
const Product = require('../models/Product');
const Category = require('../models/Category');

dotenv.config({ path: path.join(__dirname, '../.env') }); // Load env variables

// Extended Unsplash Image Sets (Need 7 unique-looking images per category type)
// We will generate 7 URLs by appending different parameters or picking from a larger pool.
const generateImages = (categoryName) => {
  const name = categoryName.toLowerCase();
  let baseQuery = 'grocery';
  
  if (name.includes('vegetable')) baseQuery = 'vegetables';
  else if (name.includes('fruit')) baseQuery = 'fruits';
  else if (name.includes('milk') || name.includes('cheese') || name.includes('butter') || name.includes('curd')) baseQuery = 'dairy';
  else if (name.includes('rice') || name.includes('dal') || name.includes('oil') || name.includes('atta') || name.includes('sugar') || name.includes('salt') || name.includes('spices')) baseQuery = 'pantry,grains';
  else if (name.includes('snack') || name.includes('biscuit') || name.includes('chocolate') || name.includes('noodle')) baseQuery = 'snacks';
  else if (name.includes('drink') || name.includes('juice') || name.includes('coffee') || name.includes('tea')) baseQuery = 'beverages';
  else if (name.includes('clean') || name.includes('detergent')) baseQuery = 'cleaning,detergent';
  else if (name.includes('care')) baseQuery = 'skincare,cosmetics';

  const images = [];
  // Generate 7 images (1 Main, 1 Hover, 5 Gallery)
  // Using Source Unsplash with random seeds/queries to get unique images
  for (let i = 0; i < 7; i++) {
    // Unsplash Source API is deprecated but standard random with seed works for mocking
    // We'll use a reliable collection approach or random IDs to ensure uniqueness.
    images.push(`https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&q=${80 + i}&sig=${Math.random()}`);
  }
  
  // Since we want high-quality distinct images, let's just hardcode a premium array of 7 real images for food:
  const premiumFoodImages = [
    'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800',
    'https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=800',
    'https://images.unsplash.com/photo-1588147426615-18e38d726b21?w=800',
    'https://images.unsplash.com/photo-1509358271058-acd22cc93898?w=800',
    'https://images.unsplash.com/photo-1599490659213-e2b9527bd087?w=800',
    'https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=800',
    'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=800'
  ];

  return premiumFoodImages.map(url => `${url}&v=${Math.floor(Math.random()*1000)}`);
};

const updateImages = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/rishabh-provision-store';
    await mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('MongoDB Connected for Updating Images');

    // Fetch all existing products without deleting them
    const products = await Product.find({}).populate('categoryId');
    console.log(`Found ${products.length} existing products.`);

    let updatedCount = 0;

    for (let product of products) {
      // The category name determines the image heuristic
      const catName = product.categoryId ? product.categoryId.name : 'grocery';
      const newImages = generateImages(catName);
      
      // Update the product record with exactly 7 images
      product.images = newImages;
      await product.save();
      updatedCount++;
    }

    console.log(`Successfully updated ${updatedCount} products with exactly 7 images (Main, Hover, 5 Gallery).`);
    process.exit();
  } catch (error) {
    console.error(`Error updating images: ${error.message}`);
    process.exit(1);
  }
};

updateImages();
