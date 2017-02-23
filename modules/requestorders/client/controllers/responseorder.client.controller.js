(function () {
  'use strict';

  angular
    .module('requestorders')
    .controller('ResponseorderController', ResponseorderController);

  ResponseorderController.$inject = ['$scope', 'Users', 'RequestordersService', 'Authentication'];

  function ResponseorderController($scope, Users, RequestordersService, Authentication) {
    var vm = this;
    vm.authentication = Authentication;
    vm.requestorders = RequestordersService.query();
    vm.init = init;
    vm.requestProduct = requestProduct;
    vm.listRequestOrder = listRequestOrder;
    vm.listRequest = [];
    vm.listResponse = [];
    vm.listReceived = [];
    vm.response = response;
    vm.addHis = addHis;
    // Responseorder controller logic
    // ...

    // init();

    function init() {
      vm.listRequestOrder();
    }
    function requestProduct(itm) {
      vm.requestprod = itm;
    }
    function listRequestOrder() {
      vm.listReq = RequestordersService.query(function () {
        angular.forEach(vm.listReq, function (req) {
          if (req.deliverystatus === 'request') {
            vm.listRequest.push(req);
          }
          if (req.transport) {
            if (req.transport._id === vm.authentication.user._id) {
              if (req.transport._id === vm.authentication.user._id && req.deliverystatus === 'response') {
                vm.listResponse.push(req);
              } else if (req.transport._id === vm.authentication.user._id && req.deliverystatus === 'received') {
                vm.listReceived.push(req);
              }
            }
          }
        });
      });
    }

    function response(item) {
      if (item.transport) {
        var fix = confirm('มีการยอมรับรายการแล้ว');
      } else {
        var conf = confirm('ยอมรับรายการ');
        if (conf) {
          item.transport = vm.authentication.user;
          item.deliverystatus = 'response';
          vm.addHis(item);

        }
      }


      item.$update(successCallback, errorCallback);
      function successCallback(res) {
        vm.listRequest = [];
        vm.listResponse = [];
        vm.listReceived = [];
        vm.init();
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }

    function addHis(item) {
      item.historystatus.push({
        status: item.deliverystatus,
        datestatus: new Date()
      });
    }


  }
})();
