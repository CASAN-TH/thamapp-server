'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Adjust Schema
 */
var AdjustSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Adjust name',
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

mongoose.model('Adjust', AdjustSchema);
