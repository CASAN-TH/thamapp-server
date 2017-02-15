'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Transport Schema
 */
var TransportSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Transport name',
    trim: true
  },
  address: {
    address: String,
    postcode: String,
    subdistrict: String,
    province: String,
    district: String,
    tel: String,
    email: String,
    sharelocation: {
      latitude: String,
      longitude: String
    }
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

mongoose.model('Transport', TransportSchema);
