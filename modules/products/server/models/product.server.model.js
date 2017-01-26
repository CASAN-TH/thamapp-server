'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Product Schema
 */
var ProductSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Product name',
    unique: true,
    trim: true
  },
  description: String,
  images: String,
  category: {
    type: String,
    required: 'Please fill Product category',
    trim: true
  },
  price: {
    type: Number,
    required: 'Please fill Product price'
  },
  grossweight:Number,
  maxstock:Number,
  minstock:Number,
  deliveryratetype: Number,
  valuetype1: Number,
  rangtype2: [{
    min: Number,
    max: Number,
    value: Number
  }],
  created: {
    type: Date,
    default: Date.now
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Product', ProductSchema);
