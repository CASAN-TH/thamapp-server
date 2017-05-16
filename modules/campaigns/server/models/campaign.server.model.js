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
            type: String,
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
    products: {
        required: 'Please fill Campaign products',
        type: [{
            product: {
                type: Schema.ObjectId,
                ref: 'Product'
            }
        }]
    },

    benefit: {
        required: 'Please fill Campaign benefit',
        type: {
            benefittype: {
                type: String,
                enum: ['DC', 'AP']
            },
            disctype: {
                type: String,
                enum: ['F', 'P']
            },
            discvalue: {
                type: Number
            }
        }
    },
    imageURL: {
        type: String
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
