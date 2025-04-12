const { getAllReviews, addReview } = require('../services/review');

// Test data
const userId1 = 123456789;
const userId2 = 987654321;
const productId = 'test-product-all-reviews';

// Test the getAllReviews function
const testAllReviews = async () => {
  try {
    console.log('Testing getAllReviews function...');
    
    // Create some test reviews from different users
    console.log('Creating test reviews from multiple users...');
    
    // Create 5 reviews from user 1
    for (let i = 0; i < 5; i++) {
      const orderNumber = `TEST-ALL-REVIEWS-USER1-${Date.now()}-${i}`;
      
      await addReview(userId1, {
        orderNumber,
        rating: Math.floor(Math.random() * 5) + 1, // Random rating 1-5
        comment: `This is test review #${i + 1} from user 1`,
        productId
      });
      
      // Small delay to ensure unique timestamps
      await new Promise(resolve => setTimeout(resolve, 10));
    }
    
    // Create 5 reviews from user 2
    for (let i = 0; i < 5; i++) {
      const orderNumber = `TEST-ALL-REVIEWS-USER2-${Date.now()}-${i}`;
      
      await addReview(userId2, {
        orderNumber,
        rating: Math.floor(Math.random() * 5) + 1, // Random rating 1-5
        comment: `This is test review #${i + 1} from user 2`,
        productId
      });
      
      // Small delay to ensure unique timestamps
      await new Promise(resolve => setTimeout(resolve, 10));
    }
    
    console.log('Created 10 test reviews from 2 different users');
    
    // Get all reviews
    console.log('\nTesting getAllReviews:');
    
    // Get first page (8 reviews)
    const page1 = await getAllReviews(0, 8);
    console.log(`Page 1: ${page1.reviews.length} reviews, Total: ${page1.pagination.totalReviews}, Pages: ${page1.pagination.totalPages}`);
    console.log('Has next page:', page1.pagination.hasNextPage);
    console.log('Has prev page:', page1.pagination.hasPrevPage);
    console.log('Average rating:', page1.summary.averageRating);
    console.log('Total reviews:', page1.summary.totalReviews);
    
    // Display the first few reviews
    console.log('\nSample reviews:');
    page1.reviews.slice(0, 3).forEach((review, index) => {
      console.log(`Review ${index + 1}:`);
      console.log(`- Rating: ${review.rating}/5`);
      console.log(`- User: ${review.username || review.userId}`);
      console.log(`- Comment: ${review.comment}`);
      console.log(`- Product: ${review.productId}`);
      console.log('---');
    });
    
    if (page1.pagination.hasNextPage) {
      // Get second page
      const page2 = await getAllReviews(1, 8);
      console.log(`\nPage 2: ${page2.reviews.length} reviews`);
      console.log('Has next page:', page2.pagination.hasNextPage);
      console.log('Has prev page:', page2.pagination.hasPrevPage);
    }
    
    console.log('\nTest completed successfully!');
  } catch (error) {
    console.error('Test failed:', error);
  }
};

// Run the test
testAllReviews();
