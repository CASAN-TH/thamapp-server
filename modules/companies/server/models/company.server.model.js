'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Company Schema
 */
var CompanySchema = new Schema({
  name: {
    type: String,
    unique: true,
    default: '',
    required: 'Please fill Company name',
    trim: true
  },
  address: {
    type: String,
    required: 'Please fill Company address'
  },
  taxid: {
    type: String,
    unique: true,
    required: 'Please fill Company taxid'
  },
  brunch: {
    type: String
  },
  telofficeno: {
    type: String
  },
  mobileno: {
    type: String
  },
  faxno: {
    type: String
  },
  email: {
    type: String
  },
  contact: {
    type: String
  },
  website: {
    type: String
  },
  creditday: {
    type: Number,
    default: 0
  },
  note: {
    type: String
  },
  accountno: {
    type: String,
    required: 'Please fill Company accountno'
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

mongoose.model('Company', CompanySchema);
