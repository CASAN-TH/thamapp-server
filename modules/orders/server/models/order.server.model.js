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
  namedeliver: {
    type: Schema.ObjectId,
    ref: 'User'
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
      firstname: String,
      lastname: String,
      address: String,
      postcode: String,
      subdistrict: String,
      province: String,
      district: String,
      tel: String,
      email: String
    }
  },
  accounting: {
    type: String,
    required: 'Please fill Order accounting',
    default: 'bank'
  },
  imgslip: String,
  postcost: Number,
  discount: Number,
  comment: String,
  trackingnumber: String,
  delivery: {
    deliveryid: String,
    deliveryname: String,
    deliverylog: [{
      logdate: Date,
      detail: String
    }]
  },
  amount: Number,
  weight: String,
  deliveryamount: Number,
  totalamount: Number,
  cartdate: Date,
  deliverystatus: {
    type: String,
    default: 'confirmed'
  },
  drilldate: Date,
  deliverylog: [{
    logdate: Date,
    detail: String
  }],
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
