const mongoose = require("mongoose");
const AutoIncrement = require('mongoose-sequence')(mongoose);

const orderSchema = new mongoose.Schema({
  client: {
    name: {
      type: String
    },
    phone:{
      type: String
    },
    address:{
      type: String
    }
  },
  products: [{
    productID:{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },
    name: {
      type: String,
    },
    price: {
      type: Number,
    },
    quantity: {
      type: Number,
    }
  }],
  total: {
    type: Number,
  },
  orderID: {
    type: Number,
    unique: true
  }

},
{
  timestamps: true,
});

orderSchema.plugin(AutoIncrement,  {inc_field: 'orderID'} );
const Order = mongoose.model("Order", orderSchema);
module.exports = Order;
