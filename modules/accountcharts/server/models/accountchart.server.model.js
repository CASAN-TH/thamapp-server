'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Accountchart Schema
 */
var AccountchartSchema = new Schema({
  accountno: {
    unique: true,
    type: String,
    default: '',
    required: 'Please fill Accountchart accountno',
    trim: true
  },
  accountname: {
    type: String,
    default: '',
    required: 'Please fill Accountchart accountname',
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

mongoose.model('Accountchart', AccountchartSchema);
