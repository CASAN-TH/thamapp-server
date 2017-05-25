'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Download Schema
 */
var DownloadSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Download name',
    trim: true
  },
  android:{
    type: String
  },
  ios:{
    type: String
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

mongoose.model('Download', DownloadSchema);
