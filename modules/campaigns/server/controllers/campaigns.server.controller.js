'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Campaign = mongoose.model('Campaign'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Campaign
 */
exports.create = function (req, res) {
  var campaign = new Campaign(req.body);
  campaign.user = req.user;

  //checkdate
  if (campaign.startdate && campaign.enddate && campaign.startdate > campaign.enddate) {
    return res.status(400).send({
      message: 'Invalid! please check date!'
    });
  }

  campaign.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(campaign);
    }
  });
};

/**
 * Show the current Campaign
 */
exports.read = function (req, res) {
  // convert mongoose document to JSON
  var campaign = req.campaign ? req.campaign.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  campaign.isCurrentUserOwner = req.user && campaign.user && campaign.user._id.toString() === req.user._id.toString();

  res.jsonp(campaign);
};

/**
 * Update a Campaign
 */
exports.update = function (req, res) {
  var campaign = req.campaign;
  campaign = _.extend(campaign, req.body);
  var error = '';
  if (campaign.listusercampaign.length > 0) {
    var chkIden = [];
    campaign.listusercampaign.forEach(function (iden) {
      if (chkIden.indexOf(iden.identification) === -1) {
        chkIden.push(iden.identification);
      } else {
        error = 'Identification is already!';
      }
    });
  }

  if (error !== '' && error === 'Identification is already!') {
    return res.status(400).send({
      message: error
    });
  }

  if (campaign.usercount - campaign.listusercampaign.length < 0) {
    return res.status(400).send({
      message: 'List is limited'
    });
  }

  campaign.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(campaign);
    }
  });
};

/**
 * Delete an Campaign
 */
exports.delete = function (req, res) {
  var campaign = req.campaign;

  campaign.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(campaign);
    }
  });
};

/**
 * List of Campaigns
 */
exports.list = function (req, res) {
  Campaign.find({ statuscampaign: 'open', enddate: { $gte: new Date() } }).sort('-created').populate('user', 'displayName').populate('listusercampaign.user', 'displayName').populate('listusercampaign.acceptcampaigndate').exec(function (err, campaigns) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(campaigns);
    }
  });
};

/**
 * Campaign middleware
 */
exports.campaignByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Campaign is invalid'
    });
  }

  Campaign.findById(id).populate('user', 'displayName').populate('listusercampaign.user', 'displayName').populate('listusercampaign.acceptcampaigndate').exec(function (err, campaign) {
    if (err) {
      return next(err);
    } else if (!campaign) {
      return res.status(404).send({
        message: 'No Campaign with that identifier has been found'
      });
    }
    req.campaign = campaign;
    next();
  });
};
