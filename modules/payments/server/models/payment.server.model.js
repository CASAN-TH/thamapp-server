'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
 * Payment Schema
 */
var PaymentSchema = new Schema({
    docno: {
        type: String,
        default: '',
        unique: true,
        required: 'Please fill Payment docno',
        trim: true
    },
    docdate: {
        type: Date,
        default: Date.now
    },
    payfor: [{
        paytype: {
            type: Schema.ObjectId,
            ref: 'Accountchart'
        },
        description: String,
        amount: {
            type: Number,
            default: 0
        }
    }],
    payby: [{
        paytype: {
            type: Schema.ObjectId,
            ref: 'Accountchart'
        },
        description: String,
        amount: {
            type: Number,
            default: 0
        },
        totalamount: Number
    }],
    totalamountpayby: {
        type: Number,
        default: 0
    },
    totalamountpayfor: {
        type: Number,
        default: 0
    },
    remark: String,
    status: {
        type: String,
        default: 'buy',
        trim: true
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

mongoose.model('Payment', PaymentSchema);
