const { Order } = require('../data');
const { getCart, clearCart } = require('./cart');

/**
 * Create a new order from a user's cart
 * @param {Number} userId - User ID (chat ID)
 * @param {String} orderNumber - Unique order number
 * @param {String} shippingAddress - Shipping address for the order
 * @returns {Promise<Object>} - The created order
 */
const createOrder = async (userId, orderNumber, shippingAddress) => {
  try {
    // Get the user's cart
    const cart = await getCart(userId);
    
    if (!cart || !cart.items || cart.items.length === 0) {
      throw new Error('Cart is empty');
    }
    
    // Calculate total amount
    let totalAmount = 0;
    cart.items.forEach(item => {
      totalAmount += item.price * (item.quantityNumeric || 1);
    });
    
    // Apply discount if available
    const discountAmount = cart.discountAmount || 0;
    const finalAmount = totalAmount - discountAmount;
    
    // Create the order
    const order = new Order({
      userId: userId,
      orderNumber: orderNumber,
      items: cart.items,
      status: 'pending',
      shippingAddress: shippingAddress,
      totalAmount: finalAmount,
      discountCode: cart.discountCode || null,
      discountAmount: discountAmount,
      originalAmount: totalAmount,
      paymentAddress: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh', // This should be generated dynamically in a real app
      createdAt: new Date()
    });
    
    // Save the order
    const savedOrder = await order.save();
    
    // Clear the cart
    await clearCart(userId);
    
    return savedOrder;
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
};

/**
 * Get all orders for a user
 * @param {Number} userId - User ID (chat ID)
 * @returns {Promise<Array>} - Array of orders
 */
const getUserOrders = async (userId) => {
  try {
    return await Order.find({ userId }).sort({ createdAt: -1 });
  } catch (error) {
    console.error('Error getting user orders:', error);
    throw error;
  }
};

/**
 * Get a specific order by ID
 * @param {String} orderId - Order ID
 * @returns {Promise<Object>} - The order
 */
const getOrderById = async (orderId) => {
  try {
    return await Order.findById(orderId);
  } catch (error) {
    console.error('Error getting order by ID:', error);
    throw error;
  }
};

/**
 * Get a specific order by order number
 * @param {String} orderNumber - Order number
 * @returns {Promise<Object>} - The order
 */
const getOrderByNumber = async (orderNumber) => {
  try {
    return await Order.findOne({ orderNumber });
  } catch (error) {
    console.error('Error getting order by number:', error);
    throw error;
  }
};

/**
 * Update an order's status
 * @param {String} orderId - Order ID
 * @param {String} status - New status
 * @returns {Promise<Object>} - The updated order
 */
const updateOrderStatus = async (orderId, status) => {
  try {
    return await Order.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );
  } catch (error) {
    console.error('Error updating order status:', error);
    throw error;
  }
};

module.exports = {
  createOrder,
  getUserOrders,
  getOrderById,
  getOrderByNumber,
  updateOrderStatus
};
