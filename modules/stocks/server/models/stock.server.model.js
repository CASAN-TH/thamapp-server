'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Stock Schema
 */
var StockSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Stock name',
    trim: true
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

mongoose.model('Stock', StockSchema);
