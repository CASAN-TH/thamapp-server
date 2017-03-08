'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Returnorder Schema
 */
var ReturnorderSchema = new Schema({
  docno: {
    unique: true,
    type: String,
    default: '',
    required: 'Please fill Returnorder docno',
    trim: true
  },
  docdate: {
    type: Date,
    required: 'Please fill Returnorder docdate'
  },
  namedeliver: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  items: {
    required: 'Please fill Returnorder items',
    type: [{
      product: {
        type: Schema.ObjectId,
        ref: 'Product'
      },
      price: Number,
      qty: Number,
      retailerprice: {
        type: Number,
        default: 0
      },
      amount: Number,
      deliverycost: Number,
      discountamount: Number
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
      email: String,
      sharelocation: {
        latitude: String,
        longitude: String
      }
    }
  },
  accounting: {
    type: String,
    required: 'Please fill Returnorder accounting',
    default: 'cash'
  },
  imgslip: String,
  postcost: Number,
  discount: Number,
  discountpromotion: Number,
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
  remark: String,
  amountqty: Number,
  amount: Number,
  weight: String,
  deliveryamount: Number,
  totalamount: Number,
  cartdate: Date,
  deliverystatus: {
    type: String,
    default: 'return'
  },
  drilldate: Date,
  deliverylog: [{
    logdate: Date,
    detail: String
  }],
  historystatus: {
    type: [{
      status: String,
      datestatus: Date
    }]
  },
  transport: {
    type: Schema.ObjectId,
    ref: 'User'
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

mongoose.model('Returnorder', ReturnorderSchema);
