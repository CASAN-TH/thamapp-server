'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Marketplan Schema
 */
var MarketplanSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Marketplan name',
    trim: true
  },
  year: {
    type: Number,
    required: 'Please fill Marketplan year'
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

mongoose.model('Marketplan', MarketplanSchema);
