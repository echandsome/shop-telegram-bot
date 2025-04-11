const { upsertUser } = require('../services/user');

// Mock Telegram message object
const mockMsg = {
  from: {
    username: 'testuser',
    first_name: 'Test',
    last_name: 'User'
  }
};

// Test the upsertUser function
const testUpsertUser = async () => {
  try {
    console.log('Testing upsertUser function...');
    
    // Use a test chat ID
    const chatId = 123456789;
    
    // Call the upsertUser function
    const result = await upsertUser(mockMsg, chatId);
    
    console.log('User upsert result:', result);
    console.log('Test completed successfully!');
  } catch (error) {
    console.error('Test failed:', error);
  }
};

// Run the test
testUpsertUser();
