const { 
  getChatHistory, 
  addMessage, 
  clearChatHistory, 
  enterSupportChat, 
  exitSupportChat, 
  formatChatHistory 
} = require('../services/support');

// Test data
const userId = 123456789;

// Test the support functions
const testSupportFunctions = async () => {
  try {
    console.log('Testing support functions...');
    
    // Clear chat history to start fresh
    console.log('Clearing chat history...');
    await clearChatHistory(userId);
    
    // Enter support chat
    console.log('Entering support chat...');
    const userInChat = await enterSupportChat(userId);
    console.log('User in chat:', userInChat);
    
    // Add system message
    console.log('Adding system message...');
    await addMessage(userId, 'Support chat opened', 'system');
    
    // Add user message
    console.log('Adding user message...');
    await addMessage(userId, 'Hello, I need help with my order', 'user');
    
    // Add seller message
    console.log('Adding seller message...');
    await addMessage(userId, 'Hi there! How can I help you?', 'seller');
    
    // Get chat history
    console.log('Getting chat history...');
    const chatHistory = await getChatHistory(userId);
    console.log('Chat history:', chatHistory);
    
    // Format chat history
    console.log('Formatting chat history...');
    const formattedHistory = formatChatHistory(chatHistory);
    console.log('Formatted history:');
    console.log(formattedHistory);
    
    // Clear chat history
    console.log('Clearing chat history again...');
    await clearChatHistory(userId);
    
    // Get empty chat history
    console.log('Getting empty chat history...');
    const emptyChatHistory = await getChatHistory(userId);
    console.log('Empty chat history:', emptyChatHistory);
    
    // Exit support chat
    console.log('Exiting support chat...');
    const userOutOfChat = await exitSupportChat(userId);
    console.log('User out of chat:', userOutOfChat);
    
    console.log('Test completed successfully!');
  } catch (error) {
    console.error('Test failed:', error);
  }
};

// Run the test
testSupportFunctions();
