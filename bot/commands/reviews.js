const logger = require('../../utils/log');
const { canLeaveReview, addReview, getAllReviews } = require('../../services/review');
const { getOrderByNumber } = require('../../services/order');
const { updateUserState } = require('../../services/user');

module.exports = async (msg, bot, type, text) => {
    const chatId = msg.chat.id;

    try {
        if (!type || type === 'view' || type === 'page') {
            // Get page number from text if it's a pagination request
            let page = 0;
            if (type === 'page' && text) {
                page = parseInt(text) || 0;
            }

            // Get all reviews with pagination
            const { reviews, pagination, summary } = await getAllReviews(page);

            if (!reviews || reviews.length === 0) {
                await bot.sendMessage(chatId,
                    "There are no reviews in the system yet. " +
                    "After receiving an order, you can leave a review from your profile.",
                    {
                        reply_markup: {
                            inline_keyboard: [
                                [{ text: "View Profile", callback_data: "myprofile" }],
                                [{ text: "Back to Menu", callback_data: "menu" }]
                            ]
                        }
                    }
                );
                return;
            }

            // Build message with reviews for current page
            // Add summary at the top
            const averageStars = '⭐'.repeat(Math.round(summary.averageRating));
            let reviewsText = `📊 Review Summary:\n`;
            reviewsText += `Average Rating: ${averageStars} (${summary.averageRating}/5)\n`;
            reviewsText += `Total Reviews: ${summary.totalReviews}\n\n`;
            reviewsText += `📝 All Reviews (${pagination.currentPage + 1}/${pagination.totalPages}):\n\n`;

            reviews.forEach((review, index) => {
                const stars = '⭐'.repeat(review.rating);
                const displayName = review.username || `User ${review.userId}`;

                reviewsText += `${stars} (${review.rating}/5)\n`;
                reviewsText += `By: ${displayName}\n`;
                reviewsText += `Product: ${review.productId || 'Unknown'}\n`;
                reviewsText += `Comment: ${review.comment || 'No comment'}\n`;
                reviewsText += `Date: ${new Date(review.createdAt).toLocaleDateString()}\n`;

                if (index < reviews.length - 1) {
                    reviewsText += `------------------------\n\n`;
                }
            });

            // Create pagination buttons
            const paginationButtons = [];

            // Add navigation buttons if needed
            if (pagination.hasPrevPage || pagination.hasNextPage) {
                const navButtons = [];

                if (pagination.hasPrevPage) {
                    navButtons.push({
                        text: "« Previous",
                        callback_data: `reviews_page_${pagination.currentPage - 1}`
                    });
                }

                if (pagination.hasNextPage) {
                    navButtons.push({
                        text: "Next »",
                        callback_data: `reviews_page_${pagination.currentPage + 1}`
                    });
                }

                paginationButtons.push(navButtons);
            }

            // Add back buttons
            paginationButtons.push([
                { text: "Back to Profile", callback_data: "myprofile" },
                { text: "Back to Menu", callback_data: "menu" }
            ]);

            // Send message with reviews and pagination
            await bot.sendMessage(chatId, reviewsText, {
                parse_mode: 'HTML',
                reply_markup: {
                    inline_keyboard: paginationButtons
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

            // Store the rating information in user state
            await updateUserState(chatId, 'awaiting_review_comment');

            // Save the review data temporarily
            global.reviewData = global.reviewData || {};
            global.reviewData[chatId] = {
                orderNumber,
                rating: parseInt(rating),
                productId: order.items[0]?.product || "Unknown product"
            };

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
        } else if (type === 'submit_comment') {
            // Get the saved review data
            const reviewData = global.reviewData && global.reviewData[chatId];

            if (!reviewData) {
                await bot.sendMessage(chatId, "Sorry, we couldn't find your review information. Please try again.");
                return;
            }

            // Add the comment to the review data
            reviewData.comment = text === '/skip' ? 'No comment provided' : text;

            // Add the review
            await addReview(chatId, reviewData);

            // Reset user state
            await updateUserState(chatId, 'main_menu');

            // Clean up temporary data
            delete global.reviewData[chatId];

            // Confirm to the user
            await bot.sendMessage(chatId,
                `Your review has been submitted. Thank you for your feedback!`,
                {
                    reply_markup: {
                        inline_keyboard: [
                            [{ text: "Back to Profile", callback_data: "myprofile" }],
                            [{ text: "Back to Menu", callback_data: "menu" }]
                        ]
                    }
                }
            );
        }
    } catch (e) {
        logger.error(e);
        await bot.sendMessage(chatId, "Sorry, there was an error processing your review.");
    }
};