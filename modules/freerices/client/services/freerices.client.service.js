// Freerices service used to communicate Freerices REST endpoints
(function () {
  'use strict';

  angular
    .module('freerices')
    .factory('FreericesService', FreericesService);

  FreericesService.$inject = ['$resource'];

  function FreericesService($resource) {
    return $resource('api/freerices/:freericeId', {
      freericeId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
