(function () {
  'use strict';

  angular
    .module('promotions')
    .controller('PromotionsListController', PromotionsListController);

  PromotionsListController.$inject = ['$state', 'PromotionsService', 'Authentication', '$window'];

  function PromotionsListController($state, PromotionsService, Authentication, $window) {
    var vm = this;
    vm.authentication = Authentication;
    vm.promotions = PromotionsService.query();
    vm.remove = function (itm) {
      if ($window.confirm('Are you sure you want to delete?')) {
        itm.$remove(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('promotions.list');
        vm.promotions = PromotionsService.query();        
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
      // itm.$remove();
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
