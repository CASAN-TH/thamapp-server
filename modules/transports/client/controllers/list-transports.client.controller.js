(function () {
  'use strict';

  angular
    .module('transports')
    .controller('TransportsListController', TransportsListController);

  TransportsListController.$inject = ['$state', 'TransportsService', 'Authentication', '$window'];

  function TransportsListController($state, TransportsService, Authentication, $window) {
    var vm = this;
    vm.authentication = Authentication;
    vm.transports = TransportsService.query();
    vm.remove = function (itm) {
      if ($window.confirm('คุณต้องการลบรายการนี้ ?')) {
        itm.$remove(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('transports.list');
        vm.transports = TransportsService.query();
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
      // itm.$remove();
    };

    vm.update = function (itm) {
      // console.log(itm._id);
      if (itm._id) {
        $state.go('transports.edit', {
          transportId: itm._id
        });
      }
    };
  }
}());

