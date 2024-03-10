const mongoose = require("mongoose");
const AutoIncrement = require('mongoose-sequence')(mongoose);

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  cost: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  online: {
    type: Boolean,
    required: true,
  },
  // amount: {
  //   type: Number,
  //   required: true,
  // },
  // lastModified: {
  //   type: Date
  // },
  code: {
    type: String,
    trim: true,
  },
  lastEdit:{
    type: Date
  },
  productID: {
    type: Number,
    unique: true
  }

},
{
  timestamps: true,
});

productSchema.plugin(AutoIncrement,  {inc_field: 'productID'} );
const Product = mongoose.model("Product", productSchema);
module.exports = Product;
