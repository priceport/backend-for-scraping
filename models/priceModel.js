const mongoose = require('mongoose');
const { Schema } = mongoose;

// Price Schema
const priceSchema = new Schema({
  min_price: { type: Number, required: true },
  max_price: { type: Number, required: true },
  promo: [{text: {type:String}, price:{type:Number}}],
  created_at: { type: Date, default: Date.now },
  product_ref: { type: Schema.Types.ObjectId, ref: 'Product' },
});

// Create the model
const Price = mongoose.model('Price', priceSchema);

module.exports = Price;
