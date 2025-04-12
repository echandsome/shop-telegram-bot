const { addReview, getUserReviews, getProductReviews, canLeaveReview, hasOrderBeenReviewed } = require('../services/review');
const { createOrder } = require('../services/order');
const { addToCart } = require('../services/cart');

// Test data
const userId = 123456789;
const productId = 'test-product-1';
const orderNumber = 'TEST-' + Date.now();

// Test the review functions
const testReviewFunctions = async () => {
  try {
    console.log('Testing review functions...');
    
    // Add a test product to cart
    console.log('Adding test product to cart...');
    await addToCart(userId, {
      product: productId,
      quantity: '1 unit',
      price: 19.99,
      addedAt: new Date()
    });
    
    // Create a test order
    console.log('Creating test order...');
    const order = await createOrder(userId, orderNumber, '123 Test Street, Test City');
    console.log('Test order created:', order);
    
    // Test canLeaveReview function
    console.log('Testing canLeaveReview function...');
    
    // Create dates for testing
    const today = new Date();
    const sixDaysAgo = new Date();
    sixDaysAgo.setDate(sixDaysAgo.getDate() - 6);
    const fourDaysAgo = new Date();
    fourDaysAgo.setDate(fourDaysAgo.getDate() - 4);
    
    // Test with different dates
    console.log('Can leave review for order from today:', canLeaveReview(today));
    console.log('Can leave review for order from 4 days ago:', canLeaveReview(fourDaysAgo));
    console.log('Can leave review for order from 6 days ago:', canLeaveReview(sixDaysAgo));
    
    // Check if order has been reviewed
    console.log('Checking if order has been reviewed...');
    const hasReview = await hasOrderBeenReviewed(orderNumber);
    console.log('Order has review:', hasReview);
    
    // Add a test review
    console.log('Adding test review...');
    const testReview = {
      orderNumber: orderNumber,
      rating: 5,
      comment: 'This is a test review',
      productId: productId
    };
    
    const reviewResult = await addReview(userId, testReview);
    console.log('Review result:', reviewResult);
    
    // Check if order has been reviewed after adding review
    console.log('Checking if order has been reviewed after adding review...');
    const hasReviewAfter = await hasOrderBeenReviewed(orderNumber);
    console.log('Order has review after adding:', hasReviewAfter);
    
    // Get user reviews
    console.log('Getting user reviews...');
    const userReviews = await getUserReviews(userId);
    console.log('User reviews:', userReviews);
    
    // Get product reviews
    console.log('Getting product reviews...');
    const productReviews = await getProductReviews(productId);
    console.log('Product reviews:', productReviews);
    
    console.log('Test completed successfully!');
  } catch (error) {
    console.error('Test failed:', error);
  }
};

// Run the test
testReviewFunctions();
