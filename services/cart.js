const { Cart } = require('../data');

/**
 * Add a product to the user's cart
 * @param {Number} userId - User ID (chat ID)
 * @param {Object} product - Product object with product, quantity, and price
 * @returns {Promise} - Result of the database operation
 */
const addToCart = async (userId, product) => {
  try {
    let quantity = 1; // Default to 1
    if (typeof product.quantity === 'string') {
      const match = product.quantity.match(/^(\d+\.?\d*)/);
      if (match && match[1]) {
        quantity = parseFloat(match[1]);
      }
    } else if (typeof product.quantity === 'number') {
      quantity = product.quantity;
    }

    const productToSave = {
      ...product,
      quantity: quantity
    };

    // Check if the product already exists in the cart
    const existingCart = await Cart.findOne({
      userId: userId,
      'items.product': product.product
    });

    if (existingCart) {
      // Update existing product in cart
      return await Cart.updateOne(
        {
          userId: userId,
          'items.product': product.product
        },
        {
          $inc: { 'items.$.quantity': parseInt(quantity) }, // Increment quantity
          $set: {
            'items.$.price': product.price,
            updatedAt: new Date()
          }
        }
      );
    } else {
      // Add new product to cart
      return await Cart.findOneAndUpdate(
        { userId: userId },
        {
          $push: { items: productToSave },
          $setOnInsert: { createdAt: new Date() },
          $set: { updatedAt: new Date() }
        },
        { upsert: true, new: true }
      );
    }
  } catch (error) {
    console.error('Error adding to cart:', error);
    throw error;
  }
};

/**
 * Get a user's cart
 * @param {Number} userId - User ID (chat ID)
 * @returns {Promise<Object>} - User's cart
 */
const getCart = async (userId) => {
  try {
    return await Cart.findOne({ userId });
  } catch (error) {
    console.error('Error getting cart:', error);
    throw error;
  }
};

/**
 * Clear a user's cart
 * @param {Number} userId - User ID (chat ID)
 * @returns {Promise} - Result of the database operation
 */
const clearCart = async (userId) => {
  try {
    return await Cart.updateOne(
      { userId },
      { $set: { items: [], updatedAt: new Date() } }
    );
  } catch (error) {
    console.error('Error clearing cart:', error);
    throw error;
  }
};

/**
 * Remove an item from a user's cart
 * @param {Number} userId - User ID (chat ID)
 * @param {String} productId - Product ID to remove
 * @returns {Promise} - Result of the database operation
 */
const removeFromCart = async (userId, productId) => {
  try {
    return await Cart.updateOne(
      { userId },
      { 
        $pull: { items: { product: productId } },
        $set: { updatedAt: new Date() }
      }
    );
  } catch (error) {
    console.error('Error removing from cart:', error);
    throw error;
  }
};

module.exports = {
  addToCart,
  getCart,
  clearCart,
  removeFromCart
};
