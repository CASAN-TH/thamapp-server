'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Promotion Schema
 */
var PromotionSchema = new Schema({
  products: [{
    product:{
      type: Schema.ObjectId,
      ref: 'Product',
      required: 'Please fill Promotion product'
    }
  }],
  description: {
    type: String,
    required: 'Please fill Promotion productid',
    unique: true
  },
  discount: {
    fixBath: Number,
    percen: Number
  },
  freeitem: {
    product: String,
    qty: Number,
    price: Number,
    amount: Number
  },
  expdate: Date,
  status: String,
  created: {
    type: Date,
    default: Date.now
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Promotion', PromotionSchema);
