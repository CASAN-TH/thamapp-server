'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Postcode Schema
 */
var PostcodeSchema = new Schema({
  locationcode: {
    type: String,
    default: '',
    required: 'Please fill Postcode locationcode',
    unique:true,
    trim: true
  },
  district: {
    type: String,
    default: '',
    required: 'Please fill Postcode district',
    trim: true
  },
   province: {
    type: String,
    default: '',
    required: 'Please fill Postcode province',
    trim: true
  },
   postcode: {
    type: String,
    default: '',
    required: 'Please fill Postcode postcode',
    trim: true
  },
  subdistrict: String,
  created: {
    type: Date,
    default: Date.now
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Postcode', PostcodeSchema);
