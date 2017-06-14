(function () {
  'use strict';

  angular
    .module('returnorders')
    .controller('ReturndeliverController', ReturndeliverController);

  ReturndeliverController.$inject = ['$scope', 'Users', 'ReturnordersService', 'Authentication'];

  function ReturndeliverController($scope, Users, ReturnordersService, Authentication) {
    var vm = this;
    vm.authentication = Authentication;
    vm.returnorders = ReturnordersService.query();
    vm.returnProduct = returnProduct;
    vm.addHis = addHis;
    $scope.setTabGreen = 'buttonGreenSet';

     vm.setLimit = function () {
      $scope.topsearch = '';
      $scope.filterText = '';
    };

    $scope.filter = function (topsearch) {
      if (topsearch.length > 4) {
        $scope.filterText = topsearch;
      } else {
        $scope.filterText = '';
      }
    };


    vm.returnlist = function (req) {
      if (req.namedeliver._id === vm.authentication.user._id && req.deliverystatus === 'return') {
        return true;
      }
    };
    vm.responselist = function (req) {
      if (req.namedeliver._id === vm.authentication.user._id && req.deliverystatus === 'response') {
        return true;
      }
    };

    vm.receivedlist = function (req) {
      if (req.namedeliver._id === vm.authentication.user._id && req.deliverystatus === 'received') {
        return true;
      }
    };


    function returnProduct(itm) {
      vm.returnprod = itm;
    }


    function addHis(item) {
      item.historystatus.push({
        status: item.deliverystatus,
        datestatus: new Date()
      });
    }

  }
})();