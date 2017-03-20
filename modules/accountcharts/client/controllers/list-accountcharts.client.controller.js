(function () {
  'use strict';

  angular
    .module('accountcharts')
    .controller('AccountchartsListController', AccountchartsListController);

  AccountchartsListController.$inject = ['$state', 'AccountchartsService', '$window'];

  function AccountchartsListController($state, AccountchartsService, $window) {
    var vm = this;
    vm.accountcharts = AccountchartsService.query();


    vm.remove = function (itm) {
      if ($window.confirm('คุณต้องการลบรายการนี้ ?')) {
        itm.$remove(successCallback, errorCallback);
      }

      function successCallback(res) {
        vm.accountcharts = AccountchartsService.query();
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
      // itm.$remove();
    };

    vm.update = function (itm) {
      if (itm._id) {
        $state.go('accountcharts.edit', {
          accountchartId: itm._id
        });
      }
    };
  }
}());
