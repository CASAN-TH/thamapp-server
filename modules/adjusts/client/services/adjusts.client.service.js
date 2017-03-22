// Adjusts service used to communicate Adjusts REST endpoints
(function () {
  'use strict';

  angular
    .module('adjusts')
    .factory('AdjustsService', AdjustsService);

  AdjustsService.$inject = ['$resource'];

  function AdjustsService($resource) {
    return $resource('api/adjusts/:adjustId', {
      adjustId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
