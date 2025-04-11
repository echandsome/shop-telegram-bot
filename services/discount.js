const { Cart } = require('../data');

// Discount codes and their rates
const DISCOUNT_CODES = {
  'WELCOME10': 0.10,  // 10% off
  'SPECIAL20': 0.20,  // 20% off
  'SUPER30': 0.30,    // 30% off
};

/**
 * Apply a discount code to a user's cart
 * @param {Number} userId - User ID (chat ID)
 * @param {String} discountCode - Discount code to apply
 * @returns {Promise<Object>} - Result of the operation with success status and message
 */
const applyDiscount = async (userId, discountCode) => {
  try {
    // Find the user's cart
    const cart = await Cart.findOne({ userId });

    // Check if cart exists and has items
    if (!cart || !cart.items || cart.items.length === 0) {
      return { success: false, message: "Your cart is empty." };
    }

    // Check if the discount code is valid
    const discountRate = DISCOUNT_CODES[discountCode.toUpperCase()];
    if (!discountRate) {
      return { success: false, message: "Invalid discount code." };
    }

    // Calculate total price
    let totalPrice = 0;
    cart.items.forEach(item => {
      totalPrice += item.price * (item.quantityNumeric || 1);
    });

    // Calculate discount amount and final price
    const discountAmount = totalPrice * discountRate;
    const finalPrice = totalPrice - discountAmount;

    // Update the cart with discount information
    await Cart.findOneAndUpdate(
      { userId },
      {
        $set: {
          discountCode: discountCode,
          discountAmount: discountAmount,
          finalPrice: finalPrice,
          updatedAt: new Date()
        }
      }
    );

    // Return success message with price details
    return {
      success: true,
      message: `Discount applied successfully!\n\nOriginal Total: $${totalPrice.toFixed(2)}\nDiscount (${(discountRate * 100)}%): -$${discountAmount.toFixed(2)}\nFinal Total: $${finalPrice.toFixed(2)}`
    };
  } catch (error) {
    console.error('Error applying discount:', error);
    return { success: false, message: "Error applying discount. Please try again." };
  }
};

/**
 * Remove a discount from a user's cart
 * @param {Number} userId - User ID (chat ID)
 * @returns {Promise<Object>} - Result of the operation with success status and message
 */
const removeDiscount = async (userId) => {
  try {
    // Find the user's cart
    const cart = await Cart.findOne({ userId });

    // Check if cart exists
    if (!cart) {
      return { success: false, message: "Cart not found." };
    }

    // Check if there's a discount to remove
    if (!cart.discountCode) {
      return { success: false, message: "No discount code applied to remove." };
    }

    // Update the cart to remove discount information
    await Cart.findOneAndUpdate(
      { userId },
      {
        $set: {
          discountCode: null,
          discountAmount: 0,
          finalPrice: 0, // This will be recalculated when viewing the cart
          updatedAt: new Date()
        }
      }
    );

    return {
      success: true,
      message: "Discount code removed successfully."
    };
  } catch (error) {
    console.error('Error removing discount:', error);
    return { success: false, message: "Error removing discount. Please try again." };
  }
};

/**
 * Check if a discount code is valid
 * @param {String} discountCode - Discount code to check
 * @returns {Boolean} - Whether the discount code is valid
 */
const isValidDiscountCode = (discountCode) => {
  return !!DISCOUNT_CODES[discountCode.toUpperCase()];
};

/**
 * Get all available discount codes
 * @returns {Object} - Object with discount codes as keys and rates as values
 */
const getDiscountCodes = () => {
  return { ...DISCOUNT_CODES };
};

/**
 * Get the discount rate for a specific code
 * @param {String} discountCode - Discount code
 * @returns {Number|null} - Discount rate or null if code is invalid
 */
const getDiscountRate = (discountCode) => {
  return DISCOUNT_CODES[discountCode.toUpperCase()] || null;
};

module.exports = {
  applyDiscount,
  removeDiscount,
  isValidDiscountCode,
  getDiscountCodes,
  getDiscountRate,
  DISCOUNT_CODES
};
