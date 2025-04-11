const logger = require('../../utils/log');
const { getUserProfile, getUserOrders, canLeaveReview } = require('../../services/profile');

module.exports = async (msg, bot) => {
    const chatId = msg.chat.id;

    try {
        // Get user profile and orders using our profile service
        const [userProfile, orders] = await Promise.all([
            getUserProfile(chatId),
            getUserOrders(chatId)
        ]);

        if (!userProfile) {
            throw new Error('Could not retrieve user profile');
        }

        // Build profile text
        let profileText = `👤 User Profile\n`;
        profileText += `ID: ${chatId}\n`;
        profileText += `Username: @${msg.from.username || 'Not set'}\n`;
        profileText += `Name: ${msg.from.first_name || ''} ${msg.from.last_name || ''}\n`;
        profileText += `Member since: ${new Date(userProfile.createdAt).toLocaleDateString()}\n\n`;

        profileText += `📦 Recent Orders:\n`;

        if (orders && orders.length > 0) {
            orders.slice(0, 5).forEach((order) => { // Show only the 5 most recent orders
                profileText += `\nOrder #${order.orderNumber}\n`;
                profileText += `Date: ${new Date(order.createdAt).toLocaleDateString()}\n`;
                profileText += `Status: ${order.status || 'Processing'}\n`;
                profileText += `Total: $${order.totalAmount.toFixed(2)}\n`;
                profileText += `------------------------\n`;
            });
        } else {
            profileText += `No orders yet\n`;
        }

        // Build profile buttons
        const profileButtons = [];

        if (orders && orders.length > 0) {
            orders.forEach((order) => {
                // Check if user can leave a review for this order
                if (canLeaveReview(order.createdAt) && !order.hasReview) {
                    profileButtons.push([{
                        text: `Leave Review for Order #${order.orderNumber}`,
                        callback_data: `review_${order.orderNumber}`
                    }]);
                }
            });
        }

       
        // Add view all orders button if there are more than 5 orders
        if (orders && orders.length > 5) {
            profileButtons.push([{
                text: "View All Orders",
                callback_data: "view_all_orders"
            }]);
        }

        // Add back to menu button
        profileButtons.push([{ text: "Back to Menu", callback_data: "menu" }]);

        // Send profile message
        await bot.sendMessage(chatId, profileText, {
            parse_mode: 'HTML',
            reply_markup: {
                inline_keyboard: profileButtons
            }
        });
    } catch (e) {
        logger.error(e);
        await bot.sendMessage(chatId, "Sorry, there was an error loading your profile.");
    }
}