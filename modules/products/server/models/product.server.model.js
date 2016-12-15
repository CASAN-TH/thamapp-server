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
    unique: true,
    required: 'Please fill Product name',
    trim: true
  },
  description: {
    type: String
  },
  category: {
    type: String,
    enum: ['P', 'R', 'S', 'E']
  },
  isincludevat: {
    type: Boolean,
    required: 'Please fill Product isincludevat'
  },
  saleprice: {
    type: Number,
    required: 'Please fill Product saleprice'
  },
  buyprice: {
    type: Number
  },
  priceincludevat: {
    type: Number
  },
  priceexcludevat: {
    type: Number
  },
  unitname: {
    type: String
  },
  saleaccount: {
    type: String,
    required: 'Please fill Product saleaccount'
  },
  buyaccount: {
    type: String,
    required: 'Please fill Product buyaccount'
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
