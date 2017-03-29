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
    debits: [{
        account: {
            type: Schema.ObjectId,
            ref: 'Accountchart'
        },
        description: String,
        amount: {
            type: Number,
            default: 0
        }
    }],
    credits: [{
        account: {
            type: Schema.ObjectId,
            ref: 'Accountchart'
        },
        description: String,
        amount: {
            type: Number,
            default: 0
        }
    }],
    remark: String,
    totaldebit: {
        type: Number,
        default: 0
    },
    totalcredit: {
        type: Number,
        default: 0
    },
    gltype: {
        type: String,
        enum: ['AR', 'AP', 'PV', 'RV', 'JV']
    },
    status: {
        type: String,
        enum: ['Open', 'Closed'],
        default: 'Open'
    },
    batchno: Date,
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
