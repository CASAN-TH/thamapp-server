// Managebanks service used to communicate Managebanks REST endpoints
(function () {
  'use strict';

  angular
    .module('managebanks')
    .factory('ManagebanksService', ManagebanksService);

  ManagebanksService.$inject = ['$resource'];

  function ManagebanksService($resource) {
    return $resource('api/managebanks/:managebankId', {
      managebankId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
