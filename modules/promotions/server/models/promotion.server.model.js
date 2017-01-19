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
  product: {
    type: Schema.ObjectId,
    ref: 'Product',
    required: 'Please fill Promotion product'
  },
  description: {
    type: String,
    required: 'Please fill Promotion productid',
    unique: true
  },
  condition: Number,
  discount: {
    fixBath: {
      type: Number,
      default: 0
    },
    percen: {
      type: Number,
      default: 0
    }
  },
  freeitem: {
    product: {
      _id: String,
      created: String,
      name: String,
      description: String,
      images: String,
      category: String,
      price: Number
    },
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
