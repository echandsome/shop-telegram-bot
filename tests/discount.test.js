const { setAwaitingDiscount, getUserById } = require('../services/user');

// Test data
const userId = 123456789;

// Test the setAwaitingDiscount function
const testSetAwaitingDiscount = async () => {
  try {
    console.log('Testing setAwaitingDiscount function...');
    
    // Set awaitingDiscount to true
    console.log('Setting awaitingDiscount to true...');
    const userWithDiscount = await setAwaitingDiscount(userId, true);
    console.log('User with discount:', userWithDiscount);
    
    // Verify that awaitingDiscount is set to true
    console.log('Verifying awaitingDiscount is true...');
    const user = await getUserById(userId);
    console.log('User:', user);
    
    if (user && user.awaitingDiscount === true) {
      console.log('✅ awaitingDiscount is set to true');
    } else {
      console.log('❌ awaitingDiscount is not set to true');
    }
    
    // Set awaitingDiscount back to false
    console.log('Setting awaitingDiscount back to false...');
    const userWithoutDiscount = await setAwaitingDiscount(userId, false);
    console.log('User without discount:', userWithoutDiscount);
    
    // Verify that awaitingDiscount is set to false
    console.log('Verifying awaitingDiscount is false...');
    const updatedUser = await getUserById(userId);
    console.log('Updated user:', updatedUser);
    
    if (updatedUser && updatedUser.awaitingDiscount === false) {
      console.log('✅ awaitingDiscount is set to false');
    } else {
      console.log('❌ awaitingDiscount is not set to false');
    }
    
    console.log('Test completed successfully!');
  } catch (error) {
    console.error('Test failed:', error);
  }
};

// Run the test
testSetAwaitingDiscount();
