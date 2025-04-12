const { getUserReviews, getProductReviews, addReview } = require('../services/review');

// Test data
const userId = 123456789;
const productId = 'test-product-pagination';

// Test the review pagination
const testReviewPagination = async () => {
  try {
    console.log('Testing review pagination...');

    // Create some test reviews
    console.log('Creating test reviews...');

    // Clear any existing reviews for this test
    // Note: In a real application, you would use a test database

    // Create 20 test reviews
    for (let i = 0; i < 20; i++) {
      const orderNumber = `TEST-PAGINATION-${Date.now()}-${i}`;

      await addReview(userId, {
        orderNumber,
        rating: Math.floor(Math.random() * 5) + 1, // Random rating 1-5
        comment: `This is test review #${i + 1} for pagination testing`,
        productId
      });

      // Small delay to ensure unique timestamps
      await new Promise(resolve => setTimeout(resolve, 10));
    }

    console.log('Created 20 test reviews');

    // Test user reviews pagination
    console.log('\nTesting user reviews pagination:');

    // Get first page (8 reviews)
    const page1 = await getUserReviews(userId, 0, 8);
    console.log(`Page 1: ${page1.reviews.length} reviews, Total: ${page1.pagination.totalReviews}, Pages: ${page1.pagination.totalPages}`);
    console.log('Has next page:', page1.pagination.hasNextPage);
    console.log('Has prev page:', page1.pagination.hasPrevPage);
    console.log('Average rating:', page1.summary.averageRating);
    console.log('Total reviews:', page1.summary.totalReviews);

    if (page1.pagination.hasNextPage) {
      // Get second page
      const page2 = await getUserReviews(userId, 1, 8);
      console.log(`\nPage 2: ${page2.reviews.length} reviews`);
      console.log('Has next page:', page2.pagination.hasNextPage);
      console.log('Has prev page:', page2.pagination.hasPrevPage);

      if (page2.pagination.hasNextPage) {
        // Get third page
        const page3 = await getUserReviews(userId, 2, 8);
        console.log(`\nPage 3: ${page3.reviews.length} reviews`);
        console.log('Has next page:', page3.pagination.hasNextPage);
        console.log('Has prev page:', page3.pagination.hasPrevPage);
      }
    }

    // Test product reviews pagination
    console.log('\nTesting product reviews pagination:');

    // Get first page (8 reviews)
    const productPage1 = await getProductReviews(productId, 0, 8);
    console.log(`Page 1: ${productPage1.reviews.length} reviews, Total: ${productPage1.pagination.totalReviews}, Pages: ${productPage1.pagination.totalPages}`);
    console.log('Has next page:', productPage1.pagination.hasNextPage);
    console.log('Has prev page:', productPage1.pagination.hasPrevPage);
    console.log('Average rating:', productPage1.summary.averageRating);
    console.log('Total reviews:', productPage1.summary.totalReviews);

    if (productPage1.pagination.hasNextPage) {
      // Get second page
      const productPage2 = await getProductReviews(productId, 1, 8);
      console.log(`\nPage 2: ${productPage2.reviews.length} reviews`);
      console.log('Has next page:', productPage2.pagination.hasNextPage);
      console.log('Has prev page:', productPage2.pagination.hasPrevPage);
    }

    console.log('\nTest completed successfully!');
  } catch (error) {
    console.error('Test failed:', error);
  }
};

// Run the test
testReviewPagination();
