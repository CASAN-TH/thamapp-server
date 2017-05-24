// Dowloads service used to communicate Dowloads REST endpoints
(function () {
  'use strict';

  angular
    .module('dowloads')
    .factory('DowloadsService', DowloadsService);

  DowloadsService.$inject = ['$resource'];

  function DowloadsService($resource) {
    return $resource('api/dowloads/:dowloadId', {
      dowloadId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
