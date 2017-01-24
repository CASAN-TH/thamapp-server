'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Stock Schema
 */
var StockSchema = new Schema([{
  name:String,
  max: Number,
  min: Number,
  stocks: [{
    delivery: {
      deliveryid: String,
      deliveryname: String,
      sold: Number
    },
  }]
}]);

mongoose.model('Stock', StockSchema);
