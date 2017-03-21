'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  auditLog = require('audit-log'),
  Schema = mongoose.Schema;
/**
 * Accountchart Schema
 */
var AccountchartSchema = new Schema({
  accountno: {
    unique: true,
    type: String,
    default: '',
    required: 'Please fill Accountchart accountno',
    trim: true
  },
  accountname: {
    type: String,
    default: '',
    required: 'Please fill Accountchart accountname',
    trim: true
  },
  status: {
    type: String,
    default: 'active'
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
var pluginFn = auditLog.getPlugin('mongoose', { modelName: 'Accountchart', namePath: 'accountname' }); // setup occurs here 
AccountchartSchema.plugin(pluginFn.handler);

var pluginFn1 = auditLog.getPlugin('mongoose', { modelName: 'Accountchart', namePath: 'accountno' }); // setup occurs here 
AccountchartSchema.plugin(pluginFn1.handler);
mongoose.model('Accountchart', AccountchartSchema);

var conn = process.env.MONGOHQ_URL || process.env.MONGOLAB_URI || process.env.MONGODB_URI || 'mongodb://' + (process.env.DB_1_PORT_27017_TCP_ADDR || 'localhost') + '/mean-dev';
// console.log(conn);
auditLog.addTransport('mongoose', { connectionString: conn });
// either or both -- up to you where your messages are sent! 
auditLog.addTransport('console');
