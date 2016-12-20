// Postcodes service used to communicate Postcodes REST endpoints
(function () {
  'use strict';

  angular
    .module('postcodes')
    .factory('PostcodesService', PostcodesService);

  PostcodesService.$inject = ['$resource'];

  function PostcodesService($resource) {
    return $resource('api/postcodes/:postcodeId', {
      postcodeId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
