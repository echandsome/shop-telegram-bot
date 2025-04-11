const { Category } = require('../data');

/**
 * Get all categories
 * @returns {Promise<Array>} - Array of categories
 */
const getAllCategories = async () => {
  try {
    return await Category.find().sort({ order: 1, name: 1 });
  } catch (error) {
    console.error('Error getting all categories:', error);
    return [];
  }
};

/**
 * Get a category by ID
 * @param {String} categoryId - Category ID
 * @returns {Promise<Object>} - The category
 */
const getCategoryById = async (categoryId) => {
  try {
    return await Category.findOne({ categoryId });
  } catch (error) {
    console.error(`Error getting category ${categoryId}:`, error);
    return null;
  }
};

/**
 * Create a new category
 * @param {Object} categoryData - Category data
 * @returns {Promise<Object>} - The created category
 */
const createCategory = async (categoryData) => {
  try {
    const category = new Category({
      ...categoryData,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    return await category.save();
  } catch (error) {
    console.error('Error creating category:', error);
    throw error;
  }
};

/**
 * Update a category
 * @param {String} categoryId - Category ID
 * @param {Object} categoryData - Updated category data
 * @returns {Promise<Object>} - The updated category
 */
const updateCategory = async (categoryId, categoryData) => {
  try {
    return await Category.findOneAndUpdate(
      { categoryId },
      {
        ...categoryData,
        updatedAt: new Date()
      },
      { new: true }
    );
  } catch (error) {
    console.error(`Error updating category ${categoryId}:`, error);
    throw error;
  }
};

/**
 * Delete a category
 * @param {String} categoryId - Category ID
 * @returns {Promise<Boolean>} - Whether the category was deleted
 */
const deleteCategory = async (categoryId) => {
  try {
    const result = await Category.deleteOne({ categoryId });
    return result.deletedCount > 0;
  } catch (error) {
    console.error(`Error deleting category ${categoryId}:`, error);
    return false;
  }
};

/**
 * Format categories for display in Telegram keyboard
 * @returns {Promise<Array>} - Array of keyboard buttons
 */
const getCategoriesForKeyboard = async () => {
  try {
    const categories = await getAllCategories();
    
    return categories.map(category => [
      { text: category.name, callback_data: category.categoryId }
    ]);
  } catch (error) {
    console.error('Error formatting categories for keyboard:', error);
    return [];
  }
};

module.exports = {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
  getCategoriesForKeyboard
};
