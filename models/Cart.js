const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CartSchema = new Schema(
  {
    product: {
      type: Object,
      required: true,
    },
    size: {
      type: Number,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
  },
  { versionKey: false }
);

const Cart = mongoose.model('cart-item', CartSchema);

module.exports = Cart;
