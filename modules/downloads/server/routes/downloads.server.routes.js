'use strict';

/**
 * Module dependencies
 */
var downloadsPolicy = require('../policies/downloads.server.policy'),
  downloads = require('../controllers/downloads.server.controller');

module.exports = function(app) {
  // Downloads Routes
  app.route('/api/downloads').all(downloadsPolicy.isAllowed)
    .get(downloads.list)
    .post(downloads.create);

  app.route('/api/downloads/:downloadId').all(downloadsPolicy.isAllowed)
    .get(downloads.read)
    .put(downloads.update)
    .delete(downloads.delete);

  // Finish by binding the Download middleware
  app.param('downloadId', downloads.downloadByID);
};
