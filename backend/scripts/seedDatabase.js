const mongoose = require('mongoose');
const path = require('path');
const dotenv = require('dotenv');
const Product = require('../models/Product');
const Category = require('../models/Category');

dotenv.config({ path: path.join(__dirname, '../.env') }); // Load env variables

// Extended Category List requested by user
const categoryNames = [
  "Rice", "Atta", "Dal", "Oil", "Milk", "Curd", "Butter", "Cheese", 
  "Bread", "Eggs", "Tea", "Coffee", "Sugar", "Salt", "Spices", 
  "Dry Fruits", "Vegetables", "Fruits", "Juices", "Soft Drinks", 
  "Chocolates", "Biscuits", "Noodles", "Pasta", "Frozen Foods", 
  "Cleaning", "Detergents", "Kitchen", "Stationery", "Baby Care", 
  "Pet Food", "Personal Care", "Hair Care", "Skin Care"
];

// Reusable Image Sets (Unsplash / Placeholder)
const imageSets = {
  vegetables: ['https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=800', 'https://images.unsplash.com/photo-1566842600175-97dca489844f?w=800'],
  fruits: ['https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=800', 'https://images.unsplash.com/photo-1576433249079-c5c829e50e93?w=800'],
  dairy: ['https://images.unsplash.com/photo-1550583724-b2692b85b150?w=800', 'https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=800'],
  pantry: ['https://images.unsplash.com/photo-1588147426615-18e38d726b21?w=800', 'https://images.unsplash.com/photo-1509358271058-acd22cc93898?w=800'],
  snacks: ['https://images.unsplash.com/photo-1599490659213-e2b9527bd087?w=800', 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800'],
  beverages: ['https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=800', 'https://images.unsplash.com/photo-1581006852262-e4307cf6283a?w=800'],
  generic: ['https://images.unsplash.com/photo-1542838132-92c53300491e?w=800', 'https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=800']
};

const getImages = (categoryName) => {
  const name = categoryName.toLowerCase();
  if (name.includes('vegetable')) return imageSets.vegetables;
  if (name.includes('fruit')) return imageSets.fruits;
  if (name.includes('milk') || name.includes('cheese') || name.includes('butter') || name.includes('curd')) return imageSets.dairy;
  if (name.includes('rice') || name.includes('dal') || name.includes('oil') || name.includes('atta') || name.includes('sugar') || name.includes('salt') || name.includes('spices')) return imageSets.pantry;
  if (name.includes('snack') || name.includes('biscuit') || name.includes('chocolate') || name.includes('noodle')) return imageSets.snacks;
  if (name.includes('drink') || name.includes('juice') || name.includes('coffee') || name.includes('tea')) return imageSets.beverages;
  return imageSets.generic;
};

// Generates an array of 200+ highly detailed products
const generateProducts = (categoryDocs) => {
  const products = [];
  const brands = ['Amul', 'Aashirvaad', 'Fortune', 'Maggi', 'Tata', 'Haldirams', 'Lays', 'Britannia', 'Nestle', 'Dabur', 'Himalaya', 'Patanjali', 'Parle'];
  
  let pId = 1;

  for (let cat of categoryDocs) {
    // Generate 6 products per category (34 categories * 6 = 204 products!)
    for (let i = 0; i < 6; i++) {
      const mrp = Math.floor(Math.random() * 500) + 50;
      const discount = Math.floor(Math.random() * 20); // 0 to 20% discount
      const price = Math.floor(mrp - (mrp * (discount / 100)));
      const brand = brands[Math.floor(Math.random() * brands.length)];
      const weightVariations = ['500g', '1kg', '2kg', '5kg', '250g', '100g'];
      const weight = weightVariations[Math.floor(Math.random() * weightVariations.length)];
      
      products.push({
        name: `${brand} Premium ${cat.name} - Variant ${i+1}`,
        brand: brand,
        price: price, // Added price as requested
        sellingPrice: price, // Keep sellingPrice for backward compatibility in existing schema
        mrp: mrp,
        discountPercentage: discount,
        stock: Math.floor(Math.random() * 100) + 10,
        description: `Experience the highest quality with this premium ${cat.name.toLowerCase()}. Sourced carefully and packaged cleanly to preserve freshness. Trusted by millions of households.`,
        rating: (Math.random() * 2 + 3).toFixed(1), // 3.0 to 5.0
        reviews: Math.floor(Math.random() * 500), // Random review count
        images: getImages(cat.name),
        categoryId: cat._id,
        subcategory: `${cat.name} Essentials`, // Subcategory as requested
        weight: weight,
        unit: weight,
        barcode: `890${Math.floor(Math.random() * 1000000000)}`,
        sku: `SKU-${cat.name.substring(0,3).toUpperCase()}-${brand.substring(0,3).toUpperCase()}-${pId}`,
        // Premium schema fields
        isBestSeller: Math.random() > 0.8,
        isNewArrival: Math.random() > 0.8,
        nutritionInfo: 'Per 100g: Calories 200kcal, Protein 5g, Carbohydrates 40g, Fat 2g',
        ingredients: `100% Pure ${cat.name.toLowerCase()}`,
        storageInstructions: 'Store in a cool, dry place away from direct sunlight.',
        expiryDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)), // 1 year from now
        countryOfOrigin: 'India',
      });
      pId++;
    }
  }

  return products;
};

const importData = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/rishabh-provision-store';
    await mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('MongoDB Connected for Seeding');

    // Wipe existing
    await Product.deleteMany();
    await Category.deleteMany();
    console.log('Existing Products and Categories wiped.');

    // Seed Categories
    const categoriesToInsert = categoryNames.map((name) => ({
      name,
      description: `All your ${name} needs.`,
      image: getImages(name)[0]
    }));

    const insertedCategories = await Category.insertMany(categoriesToInsert);
    console.log(`Seeded ${insertedCategories.length} Categories!`);

    // Seed Products
    const productsToInsert = generateProducts(insertedCategories);
    const insertedProducts = await Product.insertMany(productsToInsert);
    console.log(`Successfully seeded ${insertedProducts.length} Premium Products!`);

    process.exit();
  } catch (error) {
    console.error(`Error with Seed: ${error.message}`);
    process.exit(1);
  }
};

// Execute if run directly
if (require.main === module) {
  importData();
}

module.exports = { generateProducts, importData };
