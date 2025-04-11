const { Cart } = require('../data');
const { getDiscountRate } = require('./discount');

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
      quantity: quantity,
    };

    // Check if the product already exists in the cart
    const existingCart = await Cart.findOne({
      userId: userId,
      'items.product': product.product
    });

    let result;
    if (existingCart) {
      // Update existing product in cart
      result = await Cart.updateOne(
        {
          userId: userId,
          'items.product': product.product
        },
        {
          $inc: { 
            'items.$.quantity': quantity,
          'items.$.price': product.price, }, // Increment numeric quantity
          $set: {
            updatedAt: new Date()
          }
        }
      );
    } else {
      // Add new product to cart
      result = await Cart.findOneAndUpdate(
        { userId: userId },
        {
          $push: { items: productToSave },
          $setOnInsert: { createdAt: new Date() },
          $set: { updatedAt: new Date() }
        },
        { upsert: true, new: true }
      );
    }

    // Recalculate cart totals if a discount is applied
    const cart = await Cart.findOne({ userId });
    await updateCartTotals(userId);

    return result;
  } catch (error) {
    console.error('Error adding to cart:', error);
    throw error;
  }
};

/**
 * Update cart totals (recalculate prices with discount)
 * @param {Number} userId - User ID (chat ID)
 * @returns {Promise} - Result of the database operation
 */
const updateCartTotals = async (userId) => {
  try {
    const cart = await Cart.findOne({ userId });

    if (!cart || !cart.items || cart.items.length === 0) {
      return null;
    }

    // Calculate total price
    let totalPrice = 0;
    cart.items.forEach(item => {
      totalPrice += item.price * (item.quantity || 1);
    });

    // Apply discount if there is one
    let finalPrice = totalPrice;
    let discountAmount = 0;

    if (cart.discountCode) {
      const discountRate = getDiscountRate(cart.discountCode);
      if (discountRate) {
        discountAmount = totalPrice * discountRate;
        finalPrice = totalPrice - discountAmount;
      }
    }

    // Update the cart with the new totals
    return await Cart.findOneAndUpdate(
      { userId },
      {
        $set: {
          discountAmount: discountAmount,
          finalPrice: finalPrice,
          updatedAt: new Date()
        }
      },
      { new: true }
    );
  } catch (error) {
    console.error('Error updating cart totals:', error);
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
    const cart = await Cart.findOne({ userId });

    // If cart has items but no finalPrice, calculate it
    if (cart && cart.items && cart.items.length > 0 && !cart.finalPrice) {
      return await updateCartTotals(userId);
    }

    return cart;
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
      {
        $set: {
          items: [],
          discountCode: null,
          discountAmount: 0,
          finalPrice: 0,
          updatedAt: new Date()
        }
      }
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
    const cart = await Cart.findOne({ userId: userId });

    if (!cart || !cart.items || !cart.items[productId]) {
      return false;
    }

    cart.items.splice(productId, 1);

    if (cart.items.length === 0) {
      return await Cart.deleteOne({ userId: userId });
    } else {
      return await Cart.updateOne(
        { userId: userId },
        { $set: { items: cart.items } }
      );
    }

    // Recalculate cart totals
    return await updateCartTotals(userId);
  } catch (error) {
    console.error('Error removing from cart:', error);
    throw error;
  }
};

/**
 * Calculate cart summary (items count, subtotal, discount, total)
 * @param {Number} userId - User ID (chat ID)
 * @returns {Promise<Object>} - Cart summary object
 */
const getCartSummary = async (userId) => {
  try {
    const cart = await getCart(userId);

    if (!cart || !cart.items || cart.items.length === 0) {
      return {
        itemsCount: 0,
        subtotal: 0,
        discount: 0,
        total: 0,
        discountCode: null
      };
    }

    // Count items
    const itemsCount = cart.items.reduce((total, item) => total + (item.quantity || 1), 0);

    // Calculate subtotal
    const subtotal = cart.items.reduce((total, item) => total + (item.price * (item.quantity || 1)), 0);

    // Get discount and total
    const discount = cart.discountAmount || 0;
    const total = cart.finalPrice || subtotal;

    return {
      itemsCount,
      subtotal,
      discount,
      total,
      discountCode: cart.discountCode
    };
  } catch (error) {
    console.error('Error getting cart summary:', error);
    throw error;
  }
};

module.exports = {
  addToCart,
  getCart,
  clearCart,
  removeFromCart,
  updateCartTotals,
  getCartSummary
};
