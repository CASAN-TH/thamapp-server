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
  place: {
    type: String,
    required: 'Please fill Marketplan place'
  },
  text: {
    type: String,
    required: 'Please fill Marketplan text'
  },
  startdate: {
    type: Date,
    required: 'Please fill Marketplan startdate'
  },
  enddate: {
    type: Date,
    required: 'Please fill Marketplan enddate'
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
