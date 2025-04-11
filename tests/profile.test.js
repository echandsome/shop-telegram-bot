const { getUserProfile, getUserOrders, canLeaveReview, addReview, getUserReviews, formatUserProfile } = require('../services/profile');

// Test data
const userId = 123456789;

// Test the profile functions
const testProfileFunctions = async () => {
  try {
    console.log('Testing profile functions...');
    
    // Get or create user profile
    console.log('Getting user profile...');
    const userProfile = await getUserProfile(userId);
    console.log('User profile:', userProfile);
    
    // Format user profile
    console.log('Formatting user profile...');
    const formattedProfile = formatUserProfile(userProfile);
    console.log('Formatted profile:', formattedProfile);
    
    // Get user orders
    console.log('Getting user orders...');
    const orders = await getUserOrders(userId);
    console.log('User orders:', orders);
    
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
    
    // Add a test review if there are orders
    if (orders && orders.length > 0) {
      console.log('Adding test review...');
      const testReview = {
        orderNumber: orders[0].orderNumber,
        rating: 5,
        comment: 'This is a test review',
        productId: orders[0].items[0]?.product || 'Test Product'
      };
      
      const reviewResult = await addReview(userId, testReview);
      console.log('Review result:', reviewResult);
      
      // Get user reviews
      console.log('Getting user reviews...');
      const reviews = await getUserReviews(userId);
      console.log('User reviews:', reviews);
    } else {
      console.log('No orders found to add a test review');
    }
    
    console.log('Test completed successfully!');
  } catch (error) {
    console.error('Test failed:', error);
  }
};

// Run the test
testProfileFunctions();
