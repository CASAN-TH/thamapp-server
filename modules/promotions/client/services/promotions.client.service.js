// Promotions service used to communicate Promotions REST endpoints
(function () {
  'use strict';

  angular
    .module('promotions')
    .factory('PromotionsService', PromotionsService);

  PromotionsService.$inject = ['$resource'];

  function PromotionsService($resource) {
    return $resource('api/promotions/:promotionId', {
      promotionId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
