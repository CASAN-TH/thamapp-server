(function () {
  'use strict';

  angular
    .module('requestorders')
    .controller('RequestordersListController', RequestordersListController);

  RequestordersListController.$inject = ['$state', 'RequestordersService', 'Authentication', '$window'];

  function RequestordersListController($state, RequestordersService, Authentication, $window) {
    var vm = this;
    vm.authentication = Authentication;
    vm.requestProduct = requestProduct;
    vm.requestorders = RequestordersService.query();

    vm.remove = function (itm) {
      if ($window.confirm('คุณต้องการลบรายการนี้ ?')) {
        itm.$remove(successCallback, errorCallback);
      }

      function successCallback(res) {
        // $state.go('requestorders.list');
        vm.requestorders = RequestordersService.query();
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
      // itm.$remove();
    };

    vm.update = function (itm) {
      if (itm._id) {
        $state.go('requestorders.edit', {
          requestorderId: itm._id
        });
      }
    };

    function requestProduct(req) {
      vm.requestprod = req;
      // console.log(vm.requestprod);
    }
  }
}());