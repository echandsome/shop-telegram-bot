const { addToCart, getCart, clearCart, removeFromCart } = require('../services/cart');

// Test data
const userId = 123456789;
const product = {
  product: 'Test Product',
  quantity: '2 units',
  price: 10.99,
  addedAt: new Date()
};

// Test the cart functions
const testCartFunctions = async () => {
  try {
    console.log('Testing cart functions...');
    
    // Clear the cart first
    console.log('Clearing cart...');
    await clearCart(userId);
    
    // Add a product to the cart
    console.log('Adding product to cart...');
    const addResult = await addToCart(userId, product);
    console.log('Add result:', addResult);
    
    // Get the cart
    console.log('Getting cart...');
    const cart = await getCart(userId);
    console.log('Cart:', cart);
    
    // Add the same product again to test quantity increment
    console.log('Adding same product again...');
    const addAgainResult = await addToCart(userId, product);
    console.log('Add again result:', addAgainResult);
    
    // Get the updated cart
    console.log('Getting updated cart...');
    const updatedCart = await getCart(userId);
    console.log('Updated cart:', updatedCart);
    
    // Remove the product from the cart
    console.log('Removing product from cart...');
    const removeResult = await removeFromCart(userId, product.product);
    console.log('Remove result:', removeResult);
    
    // Get the cart after removal
    console.log('Getting cart after removal...');
    const finalCart = await getCart(userId);
    console.log('Final cart:', finalCart);
    
    console.log('Test completed successfully!');
  } catch (error) {
    console.error('Test failed:', error);
  }
};

// Run the test
testCartFunctions();
