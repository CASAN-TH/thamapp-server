(function () {
  'use strict';

  angular
    .module('orders')
    .controller('AssignlistController', AssignlistController);

  AssignlistController.$inject = ['$scope', 'Users', 'OrdersService', 'Authentication'];

  function AssignlistController($scope, Users, OrdersService, Authentication) {
    var vm = this;
    vm.authentication = Authentication;
    $scope.assignlist = [];
    $scope.assignNewList = [];
    $scope.ordConfirmed = [];
    $scope.ordWait = [];
    $scope.ordReject = [];
    $scope.assignLength = 0;
    $scope.acceptLength = 0;
    $scope.completeLength = 0;

    $scope.loadOrder = function () {
      vm.orders = OrdersService.query(function (ord) {
        $scope.ordConfirmed = ord[0].confirmed;
        $scope.ordWait = ord[0].wait;
        $scope.ordReject = ord[0].reject;
        $scope.ordAccept = ord[0].accept;
        $scope.ordComplete = ord[0].complete;

        $scope.assignNewList = $scope.ordConfirmed.concat($scope.ordWait, $scope.ordReject);
        // $scope.assignlist = $scope.waitForBind;
        $scope.assignLength = $scope.assignNewList.length;
        $scope.acceptLength = $scope.ordAccept.length;
        $scope.completeLength = $scope.ordComplete.length;
      });
    };
    $scope.loadOrder();

    vm.accept = accept;
    vm.complete = complete;
    vm.reject = reject;
    vm.addHis = addHis;

    function accept(item) {
      if (item.namedeliver) {
        item.deliverystatus = 'accept';
      } else {
        item.namedeliver = vm.authentication.user;
        item.deliverystatus = 'accept';
      }

      vm.addHis(item);
      var acceptOrder = new OrdersService(item);
      acceptOrder.$update(successCallback, errorCallback);
      function successCallback(res) {
        $scope.loadOrder();
      }

      function errorCallback(res) {
        vm.error = res.data.message;
        alert(vm.error);
      }
    }

    function complete(item) {
      item.deliverystatus = 'sent';
      vm.addHis(item);
      item.deliverystatus = 'pending';
      vm.addHis(item);
      item.deliverystatus = 'paid';
      vm.addHis(item);
      item.deliverystatus = 'complete';
      vm.addHis(item);
      var completeOrder = new OrdersService(item);

      completeOrder.$update(successCallback, errorCallback);
      function successCallback(res) {
        $scope.loadOrder();
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }

    function reject(item) {
      item.deliverystatus = 'reject';
      item.namedeliver = null;
      vm.addHis(item);
      var rejectOrder = new OrdersService(item);
      rejectOrder.$update(successCallback, errorCallback);
      function successCallback(res) {
        vm.orders = OrdersService.query();
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