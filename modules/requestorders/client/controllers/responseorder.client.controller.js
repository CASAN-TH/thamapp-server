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
    vm.requestProduct = requestProduct;
    vm.response = response;
    vm.addHis = addHis;

    function requestProduct(itm) {
      vm.requestprod = itm;
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
