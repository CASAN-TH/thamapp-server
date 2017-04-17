'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Campaign Schema
 */
var CampaignSchema = new Schema({
  name: {
    type: String,
    required: 'Please fill Campaign name',
    trim: true,
    unique: true
  },
  startdate: {
    type: String,
    required: 'Please fill Campaign startdate',
  },
  enddate: {
    type: String,
    required: 'Please fill Campaign enddate',
  },
  uesrcount: {
    type: Number,
    required: 'Please fill Campaign uesrcount',
  },
  listuesrcampaign: [{
    identification: {
      type: Number,
      required: 'Please fill Campaign identification',
    }
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

mongoose.model('Campaign', CampaignSchema);
