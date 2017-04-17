'use strict';

/**
 * Module dependencies
 */
var campaignsPolicy = require('../policies/campaigns.server.policy'),
  campaigns = require('../controllers/campaigns.server.controller');

module.exports = function(app) {
  // Campaigns Routes
  app.route('/api/campaigns').all(campaignsPolicy.isAllowed)
    .get(campaigns.list)
    .post(campaigns.create);

  app.route('/api/campaigns/:campaignId').all(campaignsPolicy.isAllowed)
    .get(campaigns.read)
    .put(campaigns.update)
    .delete(campaigns.delete);

  // Finish by binding the Campaign middleware
  app.param('campaignId', campaigns.campaignByID);
};
