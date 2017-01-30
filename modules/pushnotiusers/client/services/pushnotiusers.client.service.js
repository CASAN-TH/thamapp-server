// Pushnotiusers service used to communicate Pushnotiusers REST endpoints
(function () {
  'use strict';

  angular
    .module('pushnotiusers')
    .factory('PushnotiusersService', PushnotiusersService);

  PushnotiusersService.$inject = ['$resource'];

  function PushnotiusersService($resource) {
    return $resource('api/pushnotiusers/:pushnotiuserId', {
      pushnotiuserId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
