'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Gl Schema
 */
var GlSchema = new Schema({
  batchno: {
    type: String,
    default: '',
    unique: true,
    required: 'Please fill Gl batchno',
    trim: true
  },
  transaction: [{
    date: Date,
    actname: String,
    actno: String,
    debit: Number,
    credit: Number,
    refno: String,
    docno: String
  }],
  status: String,
  totaldebit: Number,
  totalcredit: Number,
  created: {
    type: Date,
    default: Date.now
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Gl', GlSchema);
