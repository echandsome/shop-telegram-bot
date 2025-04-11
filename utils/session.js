/**
 * In-memory session storage
 * This object stores user sessions with userId as the key
 */
const sessions = {};

/**
 * Get a user's session, creating a new one if it doesn't exist
 * @param {string|number} userId - The user's unique identifier
 * @returns {Object} - The user's session object
 */
function getSession(userId) {
  if (!sessions[userId]) {
    sessions[userId] = {};
  }
  return sessions[userId];
}

/**
 * Set a value in the user's session
 * @param {string|number} userId - The user's unique identifier
 * @param {string} key - The key to set
 * @param {any} value - The value to store
 */
function setSessionValue(userId, key, value) {
  const session = getSession(userId);
  session[key] = value;
}

/**
 * Get a value from the user's session
 * @param {string|number} userId - The user's unique identifier
 * @param {string} key - The key to retrieve
 * @returns {any} - The stored value or undefined if not found
 */
function getSessionValue(userId, key) {
  const session = getSession(userId);
  return session[key];
}

module.exports = {
  getSession,
  setSessionValue,
  getSessionValue
};
