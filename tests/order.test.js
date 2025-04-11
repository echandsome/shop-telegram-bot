const { addToCart, clearCart } = require('../services/cart');
const { createOrder, getUserOrders, getOrderByNumber } = require('../services/order');

// Test data
const userId = 123456789;
const orderNumber = 'TEST-' + Date.now();
const shippingAddress = '123 Test Street, Test City, Test Country';

// Products to add to cart
const products = [
  {
    product: 'Test Product 1',
    quantity: '2 units',
    price: 10.99,
    addedAt: new Date()
  },
  {
    product: 'Test Product 2',
    quantity: '1 unit',
    price: 15.99,
    addedAt: new Date()
  }
];

// Test the order functions
const testOrderFunctions = async () => {
  try {
    console.log('Testing order functions...');
    
    // Clear the cart first
    console.log('Clearing cart...');
    await clearCart(userId);
    
    // Add products to the cart
    console.log('Adding products to cart...');
    for (const product of products) {
      await addToCart(userId, product);
    }
    
    // Create an order
    console.log('Creating order...');
    const order = await createOrder(userId, orderNumber, shippingAddress);
    console.log('Order created:', order);
    
    // Get the user's orders
    console.log('Getting user orders...');
    const userOrders = await getUserOrders(userId);
    console.log('User orders:', userOrders);
    
    // Get the order by number
    console.log('Getting order by number...');
    const retrievedOrder = await getOrderByNumber(orderNumber);
    console.log('Retrieved order:', retrievedOrder);
    
    console.log('Test completed successfully!');
  } catch (error) {
    console.error('Test failed:', error);
  }
};

// Run the test
testOrderFunctions();
