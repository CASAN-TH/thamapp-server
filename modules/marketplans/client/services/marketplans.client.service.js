// Marketplans service used to communicate Marketplans REST endpoints
(function () {
  'use strict';

  angular
    .module('marketplans')
    .factory('MarketplansService', MarketplansService);

  MarketplansService.$inject = ['$resource'];

  function MarketplansService($resource) {
    return $resource('api/marketplans/:marketplanId', {
      marketplanId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
