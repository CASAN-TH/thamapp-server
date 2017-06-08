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

    vm.limitTo = 8;
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

        $scope.leftMoreassign = $scope.assignLength - vm.limitTo;
        $scope.leftMoreaccept = $scope.acceptLength - vm.limitTo;
        $scope.leftMorecomplete = $scope.completeLength - vm.limitTo;

      });
    };
    $scope.loadOrder();

    vm.loadmoreAssign = function () {
      vm.limitTo += 10;
      $scope.leftMoreassign -= 10;
    };
    vm.loadmoreAccept = function () {
      vm.limitTo += 10;
      $scope.leftMoreaccept -= 10;
    };
    vm.loadmoreComplete = function () {
      vm.limitTo += 10;
      $scope.leftMorecomplete -= 10;
    };

    vm.setLimit = function () {
      $scope.topsearch = '';
      $scope.filterText = '';
      vm.limitTo = 8;
      $scope.leftMoreassign = $scope.assignLength - vm.limitTo;
      $scope.leftMoreaccept = $scope.acceptLength - vm.limitTo;
      $scope.leftMorecomplete = $scope.completeLength - vm.limitTo;
    };
    $scope.loadMore = function () {
      vm.limitTo += 1;

      if ($scope.leftMoreassign >= 0) {
        $scope.leftMoreassign -= 1;
      }
      if ($scope.leftMoreaccept >= 0) {
        $scope.leftMoreaccept -= 1;
      }
      if ($scope.leftMorecomplete >= 0) {
        $scope.leftMorecomplete -= 1;
      }
    };
    $scope.filter = function (topsearch) {
      if (topsearch.length > 4) {
        $scope.filterText = topsearch;
        vm.limitTo = null;
        $scope.leftMoreassign = null;
        $scope.leftMoreaccept = null;
        $scope.leftMorecomplete = null;
      } else {
        $scope.filterText = '';
        vm.setLimit();
      }
    };

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