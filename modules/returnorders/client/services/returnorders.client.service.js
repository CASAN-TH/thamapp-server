// Returnorders service used to communicate Returnorders REST endpoints
(function () {
  'use strict';

  angular
    .module('returnorders')
    .factory('ReturnordersService', ReturnordersService);

  ReturnordersService.$inject = ['$resource'];

  function ReturnordersService($resource) {
    return $resource('api/returnorders/:returnorderId', {
      returnorderId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
