
const menuOptions = [
    [
      { text: '🚀Products', callback_data: 'products' },
      { text: '🛒Cart', callback_data: 'cart' }
    ],
    [
      { text: '👤My Profile', callback_data: 'myprofile' },
      { text: '⭐️Reviews', callback_data: 'reviews' }
    ],
    [
      { text: '🛟Support' , callback_data: 'support'  },
      { text: '🔒PGP Key', callback_data: 'pgpkey' }
    ]
];

const carts = [
  [ { text: 'Checkout', callback_data: 'checkout' } ],
  [
    { text: '🤑I have discount code', callback_data: 'enter_discount' },
    { text: 'Menu', callback_data: 'menu' }
  ]
]

const paymentMethodButtons = [
  [
    { text: "Bitcoin", callback_data: "payment_Bitcoin" }
  ],
  [
    { text: "Back", callback_data: "back" }
  ]
];

const paymentMethods = {
  "Bitcoin": [
    [
      { text: "2-5 Business Days $0.00🚚", callback_data: "2-5 Business Days $0.00🚚" }
    ],
    [
      { text: "Back", callback_data: "back" }
    ]
  ]
};

const categories = [
  [ { text: 'Hydroxide', callback_data: 'Hydroxide' } ],
  [ { text: 'Ammonia', callback_data: 'Ammonia' } ],
  [ { text: 'Ethanol', callback_data: 'Ethanol' } ],
  [ { text: 'Acetone', callback_data: 'Acetone' } ],
  [ { text: 'Sulphuric acid', callback_data: 'Sulphuric acid' } ],
  [
    { text: 'Sodium bicarbonate', callback_data: 'Sodium bicarbonate' }
  ],
  [ { text: 'Benzene', callback_data: 'Benzene' } ],
  [ { text: '🛒Cart', callback_data: 'cart' } ],
  [ { text: 'Back', callback_data: 'back' } ]
];

const baseSubproductOptions = [
  [{ text: "Add: 1g - $80", callback_data: "add_1g" }],
  [{ text: "Add: 2g - $155", callback_data: "add_2g" }],
  [{ text: "Add: 3.5g - $219", callback_data: "add_3.5g" }],
  [{ text: "Add: 7g - $405", callback_data: "add_7g" }],
  [{ text: "Add: 14g - $790", callback_data: "add_14g" }],
  [{ text: "Add: 28g - $1550", callback_data: "add_28g" }],
  [{ text: "Add: 56g - $2800", callback_data: "add_56g" }],
  [{ text: "🛒Cart", callback_data: "cart" }],
  [{ text: "Back", callback_data: "back" }, { text: "Menu", callback_data: "menu" }]
];

const products = {
  "Corrosion": baseSubproductOptions,
  "Pyophorics": baseSubproductOptions,
  "Aerosols": baseSubproductOptions,
  "Self-Reactive": baseSubproductOptions
};

const commonOptions = [
  { text: "Corrosion [$80~2800]", callback_data: "Corrosion" },
  { text: "Pyophorics [$87~2200]", callback_data: "Pyophorics" },
  { text: "Aerosols [$69~6449]", callback_data: "Aerosols" },
  { text: "Self-Reactive [$274~5166]", callback_data: "Self-Reactive" }
];

const hydroxideOnly = [
  { text: "Medium [$274~5166]", callback_data: "Medium" }
];

const withCart = [
  { text: "🛒Cart", callback_data: "cart" }
];

function buildKeyboard(extraOptions = []) {
  const allOptions = [...commonOptions, ...extraOptions, ...withCart];
  return allOptions.map(option => [option]); 
}

const products_detail = {
  "Hydroxide": buildKeyboard(hydroxideOnly),
  "Ammonia": buildKeyboard(),
  "Ethanol": buildKeyboard(),
  "Acetone": buildKeyboard(),
  "Sulphuric acid": buildKeyboard(),
  "Sodium bicarbonate": buildKeyboard(),
  "Benzene": buildKeyboard()
};

module.exports = { menuOptions, carts, categories, products, products_detail, paymentMethods, paymentMethodButtons };