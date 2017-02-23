// Requestorders service used to communicate Requestorders REST endpoints
(function () {
  'use strict';

  angular
    .module('requestorders')
    .factory('RequestordersService', RequestordersService);

  RequestordersService.$inject = ['$resource'];

  function RequestordersService($resource) {
    return $resource('api/requestorders/:requestorderId', {
      requestorderId: '@_id'
    }, {
        update: {
          method: 'PUT'
        }
      });
  }
}());