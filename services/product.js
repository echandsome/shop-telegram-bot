const { Product } = require('../data');

/**
 * Get all products
 * @returns {Promise<Array>} - Array of products
 */
const getAllProducts = async () => {
  try {
    return await Product.find().sort({ name: 1 });
  } catch (error) {
    console.error('Error getting all products:', error);
    return [];
  }
};

/**
 * Get products by category
 * @param {String} category - Category ID
 * @returns {Promise<Array>} - Array of products in the category
 */
const getProductsByCategory = async (category) => {
  try {
    return await Product.find({ category }).sort({ name: 1 });
  } catch (error) {
    console.error(`Error getting products for category ${category}:`, error);
    return [];
  }
};

/**
 * Get a product by ID
 * @param {String} productId - Product ID
 * @returns {Promise<Object>} - The product
 */
const getProductById = async (productId) => {
  try {
    return await Product.findOne({ productId });
  } catch (error) {
    console.error(`Error getting product ${productId}:`, error);
    return null;
  }
};

/**
 * Create a new product
 * @param {Object} productData - Product data
 * @returns {Promise<Object>} - The created product
 */
const createProduct = async (productData) => {
  try {
    const product = new Product({
      ...productData,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    return await product.save();
  } catch (error) {
    console.error('Error creating product:', error);
    throw error;
  }
};

/**
 * Update a product
 * @param {String} productId - Product ID
 * @param {Object} productData - Updated product data
 * @returns {Promise<Object>} - The updated product
 */
const updateProduct = async (productId, productData) => {
  try {
    return await Product.findOneAndUpdate(
      { productId },
      {
        ...productData,
        updatedAt: new Date()
      },
      { new: true }
    );
  } catch (error) {
    console.error(`Error updating product ${productId}:`, error);
    throw error;
  }
};

/**
 * Delete a product
 * @param {String} productId - Product ID
 * @returns {Promise<Boolean>} - Whether the product was deleted
 */
const deleteProduct = async (productId) => {
  try {
    const result = await Product.deleteOne({ productId });
    return result.deletedCount > 0;
  } catch (error) {
    console.error(`Error deleting product ${productId}:`, error);
    return false;
  }
};

/**
 * Get product options with prices
 * @param {String} productId - Product ID
 * @returns {Promise<Array>} - Array of product options with prices
 */
const getProductOptions = async (productId) => {
  try {
    const product = await getProductById(productId);
    return product ? product.options : [];
  } catch (error) {
    console.error(`Error getting options for product ${productId}:`, error);
    return [];
  }
};

/**
 * Get product price by option
 * @param {String} productId - Product ID
 * @param {String} optionName - Option name
 * @returns {Promise<Number>} - Price for the option
 */
const getProductPriceByOption = async (productId, optionName) => {
  try {
    const product = await getProductById(productId);
    
    if (!product) {
      return 0;
    }
    
    const option = product.options.find(opt => opt.name === optionName);
    return option ? option.price : product.price;
  } catch (error) {
    console.error(`Error getting price for product ${productId} option ${optionName}:`, error);
    return 0;
  }
};

module.exports = {
  getAllProducts,
  getProductsByCategory,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductOptions,
  getProductPriceByOption
};
