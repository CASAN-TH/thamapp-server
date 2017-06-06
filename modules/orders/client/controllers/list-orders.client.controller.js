(function () {
  'use strict';

  angular
    .module('orders')
    .controller('OrdersListController', OrdersListController);

  OrdersListController.$inject = ['OrdersService', 'Authentication', '$scope', '$http'];

  function OrdersListController(OrdersService, Authentication, $scope, $http) {
    var vm = this;
    vm.authentication = Authentication;
    // vm.orders = OrdersService.query(function (ord) {
    //   $scope.leftMoreOrders = ord.length;
    // });
    vm.limitTo = 8;
    $scope.Ordersconfirmed = [];
    $scope.Orderswait = [];
    $scope.Ordersaccept = [];
    $scope.Ordersreject = [];
    $scope.Orderscomplete = [];
    $scope.Orderscancel = [];
    $http.get('api/listorder/v2')
      .then(function (ord) {
        $scope.Ordersconfirmed = ord.data.confirmed;
        $scope.Orderswait = ord.data.wait;
        $scope.Ordersaccept = ord.data.accept;
        $scope.Ordersreject = ord.data.reject;
        $scope.Orderscomplete = ord.data.complete;
        $scope.Orderscancel = ord.data.cancel;

        vm.orders = $scope.Ordersconfirmed.concat($scope.Orderswait, $scope.Ordersaccept, $scope.Ordersreject, $scope.Orderscomplete, $scope.Orderscancel);
        $scope.confirmedOrd = $scope.Ordersconfirmed.concat($scope.Orderswait);

        $scope.leftMoreOrders = vm.orders.length - vm.limitTo;
        $scope.leftMoreConfirmed = $scope.confirmedOrd.length - vm.limitTo;
        $scope.leftMoreAccept = $scope.Ordersaccept.length - vm.limitTo;
        $scope.leftMoreReject = $scope.Ordersreject.length - vm.limitTo;
        $scope.leftMoreComplete = $scope.Orderscomplete.length - vm.limitTo;
        $scope.leftMoreCancel = $scope.Orderscancel.length - vm.limitTo;

      }, function (err) {
        alert(err.message);
      });



    vm.confirmed = function (item) {
      return item.deliverystatus === 'confirmed' || item.deliverystatus === 'wait deliver';
    };

    vm.setLimit = function () {
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
  }
}());
