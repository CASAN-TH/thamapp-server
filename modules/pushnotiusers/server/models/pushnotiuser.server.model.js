'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Pushnotiuser Schema
 */
var PushnotiuserSchema = new Schema({
  user_id: {
    type: String,
    required: 'Please fill Pushnotiuser user id',
    trim: true
  },
  user_name: {
    type: String,
    trim: true
  },
  role: {
    type: String,
    required: 'Please fill Pushnotiuser role',
    trim: true
  },
  device_token: {
    type: String,
    required: 'Please fill Pushnotiuser device token',
    trim: true
  },
  client_ip: {
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

mongoose.model('Pushnotiuser', PushnotiuserSchema);
