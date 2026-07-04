const Product = require('../models/Product');

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
  try {
    const { keyword, category, minPrice, maxPrice, brand, rating, inStock } = req.query;

    let query = {};

    // 1. Text Search
    if (keyword) {
      query.$or = [
        { name: { $regex: keyword, $options: 'i' } },
        { description: { $regex: keyword, $options: 'i' } },
        { tags: { $regex: keyword, $options: 'i' } },
      ];
    }

    // 2. Category Filter
    if (category) {
      query.categoryId = category;
    }

    // 3. Price Filter
    if (minPrice || maxPrice) {
      query.sellingPrice = {};
      if (minPrice) query.sellingPrice.$gte = Number(minPrice);
      if (maxPrice) query.sellingPrice.$lte = Number(maxPrice);
    }

    // 4. Brand Filter
    if (brand) {
      const brandsArray = brand.split(','); // handle comma separated multiple brands
      query.brand = { $in: brandsArray.map(b => new RegExp(`^${b}$`, 'i')) };
    }

    // 5. Rating Filter
    if (rating) {
      query.rating = { $gte: Number(rating) };
    }

    // 6. In-Stock Filter
    if (inStock === 'true') {
      query.stock = { $gt: 0 };
    }

    const products = await Product.find(query).populate('categoryId', 'name');
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = async (req, res) => {
  try {
    const product = new Product(req.body);
    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      await product.deleteOne();
      res.json({ message: 'Product removed' });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Bulk upload products from CSV/JSON
// @route   POST /api/products/bulk
// @access  Private/Admin
const bulkUploadProducts = async (req, res) => {
  try {
    const products = req.body.products; // Assuming JSON array is sent directly from frontend after client-side parsing for simplicity, or parsed CSV array
    if (!products || products.length === 0) {
      return res.status(400).json({ message: 'No products provided for upload' });
    }

    const insertedProducts = await Product.insertMany(products);
    res.status(201).json({ message: `${insertedProducts.length} products added successfully`, count: insertedProducts.length });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getProducts, getProductById, createProduct, updateProduct, deleteProduct, bulkUploadProducts };
