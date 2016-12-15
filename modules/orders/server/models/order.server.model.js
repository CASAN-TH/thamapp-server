'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Order Schema
 */
var OrderSchema = new Schema({
  docno: {
    unique: true,
    type: String,
    default: '',
    required: 'Please fill Order docno',
    trim: true
  },
  docdate: {
    type: Date,
    required: 'Please fill Order docdate'
  },
  items: {
    required: 'Please fill Order items',
    type: [{
      product: {
        type: Schema.ObjectId,
        ref: 'Product'
      },
      qty: Number,
      amount: Number
    }]
  },
  shipping: {
    required: '',
    type: {
      postcode: String,
      subdistrict: String,
      province: String,
      district: String,
      tel: String,
      email: String
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

mongoose.model('Order', OrderSchema);
