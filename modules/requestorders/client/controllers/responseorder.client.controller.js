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
    vm.responsed = responsed;
    vm.addHis = addHis;
    $scope.setTabGreen = 'buttonGreenSet';


    vm.requestlist = function (req) {
      if (req.deliverystatus === 'request') {

        return true;

      }
    };

    vm.responselist = function (req) {
      if (req.transport) {
        if (req.transport._id === vm.authentication.user._id && req.deliverystatus === 'response') {
          return true;
        }
      }
    };

    vm.receivedlist = function (req) {
      if (req.transport) {
        if (req.transport._id === vm.authentication.user._id && req.deliverystatus === 'received') {
          return true;
        }
      }
    };

    function requestProduct(itm) {
      vm.requestprod = itm;
    }

    function responsed(item) {
      if (item.transport) {
        var fix = confirm('มีการยอมรับรายการแล้ว');
      } else {
        var conf = confirm('ยอมรับรายการ');
        if (conf === true) {
          item.transport = vm.authentication.user;
          item.deliverystatus = 'response';
          vm.addHis(item);

        }
      }


      item.$update(successCallback, errorCallback);
      function successCallback(res) {
        vm.requestorders = RequestordersService.query();
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
