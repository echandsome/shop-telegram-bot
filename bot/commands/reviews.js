const logger = require('../../utils/log');
const { getUserOrders, canLeaveReview, addReview, getUserReviews } = require('../../services/profile');
const { getOrderByNumber } = require('../../services/order');

module.exports = async (msg, bot, type, text) => {
    const chatId = msg.chat.id;

    try {
        if (!type || type === 'view') {
            // Get user reviews
            const reviews = await getUserReviews(chatId);

            if (!reviews || reviews.length === 0) {
                await bot.sendMessage(chatId,
                    "You haven't left any reviews yet. " +
                    "After receiving an order, you can leave a review from your profile.",
                    {
                        reply_markup: {
                            inline_keyboard: [
                                [{ text: "View Profile", callback_data: "profile" }],
                                [{ text: "Back to Menu", callback_data: "menu" }]
                            ]
                        }
                    }
                );
                return;
            }

            // Build message with all reviews
            let reviewsText = `⭐ Your Reviews:\n\n`;

            reviews.forEach((review, index) => {
                const stars = '⭐'.repeat(review.rating);
                reviewsText += `${stars} (${review.rating}/5)\n`;
                reviewsText += `Product: ${review.productId || 'Unknown'}\n`;
                reviewsText += `Comment: ${review.comment || 'No comment'}\n`;
                reviewsText += `Date: ${new Date(review.createdAt).toLocaleDateString()}\n`;

                if (index < reviews.length - 1) {
                    reviewsText += `------------------------\n\n`;
                }
            });

            // Send message with all reviews
            await bot.sendMessage(chatId, reviewsText, {
                parse_mode: 'HTML',
                reply_markup: {
                    inline_keyboard: [
                        [{ text: "Back to Profile", callback_data: "profile" }],
                        [{ text: "Back to Menu", callback_data: "menu" }]
                    ]
                }
            });
        } else if (type === 'start_review') {
            // Extract order number from callback data
            const orderNumber = text.replace('review_', '');

            // Get the order
            const order = await getOrderByNumber(orderNumber);

            if (!order) {
                await bot.sendMessage(chatId, "Sorry, we couldn't find that order.");
                return;
            }

            // Check if user can leave a review
            if (!canLeaveReview(order.createdAt)) {
                await bot.sendMessage(chatId,
                    "You can only leave a review for orders that are at least 5 days old. " +
                    "This ensures you've had time to receive and try the product."
                );
                return;
            }

            // Show review form
            await bot.sendMessage(chatId,
                `Please rate your experience with Order #${orderNumber}:\n\n` +
                `Choose a rating from 1 to 5 stars:`,
                {
                    reply_markup: {
                        inline_keyboard: [
                            [
                                { text: "⭐", callback_data: `rating_${orderNumber}_1` },
                                { text: "⭐⭐", callback_data: `rating_${orderNumber}_2` },
                                { text: "⭐⭐⭐", callback_data: `rating_${orderNumber}_3` },
                                { text: "⭐⭐⭐⭐", callback_data: `rating_${orderNumber}_4` },
                                { text: "⭐⭐⭐⭐⭐", callback_data: `rating_${orderNumber}_5` }
                            ]
                        ]
                    }
                }
            );
        } else if (type === 'submit_rating') {
            // Extract order number and rating from callback data
            const [orderNumber, rating] = text.replace('rating_', '').split('_');

            // Get the order
            const order = await getOrderByNumber(orderNumber);

            if (!order) {
                await bot.sendMessage(chatId, "Sorry, we couldn't find that order.");
                return;
            }

            // Ask for review comment
            await bot.sendMessage(chatId,
                `You've rated Order #${orderNumber} ${rating} stars.\n\n` +
                `Please type your review comments or type /skip to submit without comments:`,
                {
                    reply_markup: {
                        force_reply: true
                    }
                }
            );

            // Store the rating in user state (this would need to be implemented)
            // For now, we'll just use a simple approach
            await bot.sendMessage(chatId,
                `Your rating has been recorded. Thank you for your feedback!`,
                {
                    reply_markup: {
                        inline_keyboard: [
                            [{ text: "Back to Profile", callback_data: "profile" }]
                        ]
                    }
                }
            );

            // Add the review
            await addReview(chatId, {
                orderNumber,
                rating: parseInt(rating),
                comment: "No comment provided",
                productId: order.items[0]?.product || "Unknown product"
            });
        }
    } catch (e) {
        logger.error(e);
        await bot.sendMessage(chatId, "Sorry, there was an error processing your review.");
    }
};