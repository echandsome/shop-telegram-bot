const startCommand = require('./start');
const categoriesCommand = require('./categories');
const productsCommand = require('./products');
const cartCommand = require('./cart');
const profileCommand = require('./profile');
const reviewsCommand = require('./reviews');
const supportCommand = require('./support');
const pgpkeyCommand = require('./pgpkey');
const productsDetailCommand = require('./productsDetail');
const addToCartCommand = require('./addToCart');
const checkoutCommand = require('./checkout');
const paymentsCommand = require('./payments');
const shippingCommand = require('./shipping');

module.exports = {
    startCommand,
    categoriesCommand,
    productsCommand,
    cartCommand,
    profileCommand,
    reviewsCommand,
    supportCommand,
    pgpkeyCommand,
    productsDetailCommand,
    addToCartCommand,
    checkoutCommand,
    paymentsCommand,
    shippingCommand
  };
  