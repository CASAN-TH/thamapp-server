(function() {
  'use strict';

  angular
    .module('returnorders')
    .controller('ReturnresponseController', ReturnresponseController);

  ReturnresponseController.$inject = ['$scope', 'Users', 'ReturnordersService', 'Authentication'];

  function ReturnresponseController($scope, Users, ReturnordersService, Authentication) {
    var vm = this;
    vm.authentication = Authentication;
    vm.returnorders = ReturnordersService.query();
    vm.returnProduct = returnProduct;
    vm.responsed = responsed;
    vm.addHis = addHis;
    $scope.setTabGreen = 'buttonGreenSet';


    vm.returnlist = function (req) {
      if (req.deliverystatus === 'return') {

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

    function returnProduct(itm) {
      vm.returnprod = itm;
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
        vm.returnorders = ReturnordersService.query();
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