// Gls service used to communicate Gls REST endpoints
(function () {
  'use strict';

  angular
    .module('gls')
    .factory('GlsService', GlsService);

  GlsService.$inject = ['$resource'];

  function GlsService($resource) {
    return $resource('api/gls/:glId', {
      glId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
