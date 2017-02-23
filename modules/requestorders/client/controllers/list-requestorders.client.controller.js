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
    vm.listRequest = [];
    vm.listResponse = [];
    vm.listReceived = [];
    vm.readdata = readdata;
    vm.init = init;
    function init() {
      vm.readdata();
    }
    function readdata() {
      vm.requestorder = RequestordersService.query(function () {
        vm.requestorder.forEach(function (order) {
          if (order.deliverystatus === 'request') {
            vm.listRequest.push(order);
          } else if (order.deliverystatus === 'response') {
            vm.listResponse.push(order);
          } else if (order.deliverystatus === 'received') {
            vm.listReceived.push(order);
          }
        });
      });
    }

    vm.remove = function (itm) {
      if ($window.confirm('คุณต้องการลบรายการนี้ ?')) {
        itm.$remove(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('requestorders.list');
        vm.listRequest = [];
        vm.listResponse = [];
        vm.listReceived = [];
        vm.init();
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