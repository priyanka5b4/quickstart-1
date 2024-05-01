const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const itemSchema = new Schema({
  access_token: { type: String, required: true },
  item_id: { type: String, required: true },
  institution_id: { type: String, required: true },
  available_products: [String],
  billed_products: [String],
  consent_expiration_time: Date,
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
  cursor: { type: String, default: null },
});

module.exports = mongoose.model('Item', itemSchema);
