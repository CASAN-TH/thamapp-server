(function () {
  'use strict';

  angular
    .module('promotions')
    .controller('PromotionsListController', PromotionsListController);

  PromotionsListController.$inject = ['$state', 'PromotionsService', 'Authentication'];

  function PromotionsListController($state, PromotionsService, Authentication) {
    var vm = this;
    vm.authentication = Authentication;
    vm.promotions = PromotionsService.query();
    vm.remove = function (itm) {
      itm.$remove();
      vm.promotions = PromotionsService.query();
    };

    vm.update = function (itm) {
      // console.log(itm._id);
      if (itm._id) {
        $state.go('promotions.edit', {
          promotionId: itm._id
        });
      }
    };

    vm.cliketoview = function (itm) {
      $state.go('promotions.view', {
        promotionId: itm._id
      });
    };
  }
} ());
