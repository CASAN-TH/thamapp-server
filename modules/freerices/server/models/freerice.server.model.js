'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Freerice Schema
 */
var FreericeSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Freerice name',
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

mongoose.model('Freerice', FreericeSchema);
