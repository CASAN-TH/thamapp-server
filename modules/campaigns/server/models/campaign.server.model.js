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
    usercount: {
        type: Number,
        required: 'Please fill Campaign usercount',
    },
    listusercampaign: [{
        identification: {
            type: Number,
            required: 'Please fill Campaign identification',
        },
        acceptcampaigndate: {
            type: String,
            required: 'Please fill Campaign acceptcampaigndate',
        },
        facebook: String,
        lineid: String,
        status: String
    }],
    description: String,
    pointcount: String,
    usertotal: String,
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
