'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Managebank Schema
 */
var ManagebankSchema = new Schema({
bankname:{
  type:String,
  required:'Please fill bankname'
},
accountname:{
  type:String,
  required:'Please fill accountname'
},
accountnumber:{
  type:String,
  required:'Please fill accountnumber',
  unique:true
},
branch:{
  type:String,
  required:'Please fill branch'
  
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

mongoose.model('Managebank', ManagebankSchema);
