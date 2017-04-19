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
        type: Date,
        required: 'Please fill Campaign startdate',
    },
    enddate: {
        type: Date,
        required: 'Please fill Campaign enddate',
    },
    usercount: {
        type: Number,
        required: 'Please fill Campaign usercount',
    },
    listusercampaign: [{
        identification: {
            type: Number,
        },
        acceptcampaigndate: {
            type: Schema.ObjectId,
            ref: 'Marketplan'
        },
        user: {
            type: Schema.ObjectId,
            ref: 'User'
        },
        facebook: String,
        lineid: String,
        status: {
            type: String,
            default: 'accept'
        }
    }],
    description: String,
    pointcount: {
        type: Number,
        default: 0
    },
    usertotal: {
        type: Number,
        default: 0
    },
    statuscampaign: {
        type: String,
        default: 'open'
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

mongoose.model('Campaign', CampaignSchema);
