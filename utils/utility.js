
function getPriceFromQuantity(data) {
    const priceMap = {
      'add_1g': 80,
      'add_2g': 155,
      'add_3.5g': 219,
      'add_7g': 405,
      'add_14g': 790,
      'add_28g': 1550,
      'add_56g': 2800
    };
    return priceMap[data] || 0;
}

module.exports = {
    getPriceFromQuantity
}