const mongoose = require('mongoose');
const { Schema } = mongoose;

// Enum values
const categoryEnum = ['liquour', 'beauty'];
const tagEnum = ['duty-free', 'domestic'];
const unitEnum = ['ml', 'g', 'oz', 'l'];  // Assuming some common units for demonstration

// Product Schema
const productSchema = new Schema({
  url: { type: String, required: true },
  category: { type: String, enum: categoryEnum, required: true },
  title: { type: String, required: true },
  brand: { type: String, required: true },
  source: {
    website_base: { type: String, required: true },
    location: { type: String, required: true },
    tag: { type: String, enum: tagEnum, required: true }
  },
  created_at: { type: Date, default: Date.now },
  last_check: { type: Date, default: Date.now },
  price: [{ type: Schema.Types.ObjectId, ref: 'Price' }],
  map_ref: { type: Schema.Types.ObjectId, ref: 'Map', default:null },
  unit: { type: String, enum: unitEnum },
  quantity: {type: Number, required: true},
  sub_category:{type:String, required: true},
  img:{type:String, required: true}
});

// Create the model
const Product = mongoose.model('Product', productSchema);

module.exports = Product;
