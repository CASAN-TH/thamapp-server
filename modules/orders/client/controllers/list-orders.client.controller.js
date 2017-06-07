(function () {
  'use strict';

  angular
    .module('orders')
    .controller('OrdersListController', OrdersListController);

  OrdersListController.$inject = ['OrdersService', 'Authentication', '$scope', '$http'];

  function OrdersListController(OrdersService, Authentication, $scope, $http) {
    var vm = this;
    vm.authentication = Authentication;

    vm.limitTo = 8;
    $scope.Ordersconfirmed = [];
    $scope.Orderswait = [];
    $scope.Ordersaccept = [];
    $scope.Ordersreject = [];
    $scope.Orderscomplete = [];
    $scope.Orderscancel = [];
    vm.orders = OrdersService.query(function (ord) {
      $scope.Ordersconfirmed = ord[0].confirmed;
      $scope.Orderswait = ord[0].wait;
      $scope.Ordersaccept = ord[0].accept;
      $scope.Ordersreject = ord[0].reject;
      $scope.Orderscomplete = ord[0].complete;
      $scope.Orderscancel = ord[0].cancel;

      vm.orders = $scope.Ordersconfirmed.concat($scope.Orderswait, $scope.Ordersaccept, $scope.Ordersreject, $scope.Orderscomplete, $scope.Orderscancel);
      $scope.confirmedOrd = $scope.Ordersconfirmed.concat($scope.Orderswait);

      $scope.leftMoreOrders = vm.orders.length - vm.limitTo;
      $scope.leftMoreConfirmed = $scope.confirmedOrd.length - vm.limitTo;
      $scope.leftMoreAccept = $scope.Ordersaccept.length - vm.limitTo;
      $scope.leftMoreReject = $scope.Ordersreject.length - vm.limitTo;
      $scope.leftMoreComplete = $scope.Orderscomplete.length - vm.limitTo;
      $scope.leftMoreCancel = $scope.Orderscancel.length - vm.limitTo;
    });

    vm.confirmed = function (item) {
      return item.deliverystatus === 'confirmed' || item.deliverystatus === 'wait deliver';
    };

    vm.setLimit = function () {
      this.topsearch = '';
      $scope.filterText = '';
      vm.limitTo = 8;
      $scope.leftMoreOrders = vm.orders.length - vm.limitTo;
      $scope.leftMoreConfirmed = $scope.confirmedOrd.length - vm.limitTo;
      $scope.leftMoreAccept = $scope.Ordersaccept.length - vm.limitTo;
      $scope.leftMoreReject = $scope.Ordersreject.length - vm.limitTo;
      $scope.leftMoreComplete = $scope.Orderscomplete.length - vm.limitTo;
      $scope.leftMoreCancel = $scope.Orderscancel.length - vm.limitTo;

    };
    vm.loadmoreOrders = function () {
      vm.limitTo += 10;
      $scope.leftMoreOrders -= 10;
    };
    vm.loadmoreConfirmed = function () {
      vm.limitTo += 10;
      $scope.leftMoreConfirmed -= 10;
    };
    vm.loadmoreAccept = function () {
      vm.limitTo += 10;
      $scope.leftMoreAccept -= 10;
    };
    vm.loadmoreReject = function () {
      vm.limitTo += 10;
      $scope.leftMoreReject -= 10;
    };
    vm.loadmoreComplete = function () {
      vm.limitTo += 10;
      $scope.leftMoreComplete -= 10;
    };
    vm.loadmoreCancel = function () {
      vm.limitTo += 10;
      $scope.leftMoreCancel -= 10;
    };
    $scope.loadMore = function () {
      if ($scope.leftMoreOrders >= 0) {
        vm.limitTo += 10;
        $scope.leftMoreOrders -= 10;
      }
      if ($scope.leftMoreConfirmed >= 0) {
        vm.limitTo += 10;
        $scope.leftMoreConfirmed -= 10;
      }
      if ($scope.leftMoreAccept >= 0) {
        vm.limitTo += 10;
        $scope.leftMoreAccept -= 10;
      }
      if ($scope.leftMoreReject >= 0) {
        vm.limitTo += 10;
        $scope.leftMoreReject -= 10;
      }
      if ($scope.leftMoreComplete >= 0) {
        vm.limitTo += 10;
        $scope.leftMoreComplete -= 10;
      }
      if ($scope.leftMoreCancel >= 0) {
        vm.limitTo += 10;
        $scope.leftMoreCancel -= 10;
      }

    };
    $scope.filter = function (topsearch) {
      if (topsearch.length > 4) {
        $scope.filterText = topsearch;
        vm.limitTo = null;
        $scope.leftMoreOrders = null;
        $scope.leftMoreConfirmed = null;
        $scope.leftMoreAccept = null;
        $scope.leftMoreReject = null;
        $scope.leftMoreComplete = null;
        $scope.leftMoreCancel = null;
      } else {
        $scope.filterText = '';
        vm.setLimit();
      }
    };
  }
} ());
