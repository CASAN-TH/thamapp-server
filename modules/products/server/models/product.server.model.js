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
  description:String,
  images:[String],
  category: {
    type: String,
    required: 'Please fill Product category',
    trim: true
  },
  price: {
    type: Number,
    required: 'Please fill Product price'
  },
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
