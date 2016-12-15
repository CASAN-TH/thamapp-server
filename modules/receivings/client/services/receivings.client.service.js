// Receivings service used to communicate Receivings REST endpoints
(function () {
  'use strict';

  angular
    .module('receivings')
    .factory('ReceivingsService', ReceivingsService);

  ReceivingsService.$inject = ['$resource'];

  function ReceivingsService($resource) {
    return $resource('api/receivings/:receivingId', {
      receivingId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
