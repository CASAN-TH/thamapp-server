(function () {
  'use strict';

  angular
    .module('orders')
    .controller('AssignlistController', AssignlistController);

  AssignlistController.$inject = ['$scope', 'Users', 'OrdersService', 'Authentication'];

  function AssignlistController($scope, Users, OrdersService, Authentication) {
    var vm = this;
    vm.authentication = Authentication;
    vm.orders = OrdersService.query();
    vm.init = init;
    vm.listAssign = listAssign;
    vm.listOrder = [];
    vm.listAccept = listAccept;
    vm.listOrderAccept = [];
    vm.listComplete = listComplete;
    vm.listOrderComplete = [];
    vm.accept = accept;
    vm.complete = complete;
    vm.reject = reject;
    vm.addHis = addHis;

    function init() {
      vm.listAssign();
      vm.listAccept();
      vm.listComplete();
    }

    function listAssign() {
      vm.list = OrdersService.query(function () {
        angular.forEach(vm.list, function (order) {
          console.log(order);
          if (order.namedeliver) {
            if (order.namedeliver._id === vm.authentication.user._id && order.deliverystatus === 'confirmed') {
              vm.listOrder.push(order);
            }

          }
        });
      });
    }

    function listAccept() {
      vm.listacc = OrdersService.query(function () {
        angular.forEach(vm.listacc, function (order) {
          console.log(order);
          if (order.namedeliver) {
            if (order.namedeliver._id === vm.authentication.user._id && order.deliverystatus === 'accept') {
              vm.listOrderAccept.push(order);
            }

          }
        });
      });
    }

    function listComplete() {
      vm.listCpt = OrdersService.query(function () {
        angular.forEach(vm.listCpt, function (order) {
          console.log(order);
          if (order.namedeliver) {
            if (order.namedeliver._id === vm.authentication.user._id && order.deliverystatus === 'complete') {
              vm.listOrderComplete.push(order);
            }

          }
        });
      });
    }

    function accept(item) {
      item.deliverystatus = 'accept';
      vm.addHis(item);
      item.$update(successCallback, errorCallback);
      function successCallback(res) {

      }

      function errorCallback(res) {
        vm.error = res.data.message;
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
      item.$update(successCallback, errorCallback);
      function successCallback(res) {

      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }

    function reject(item) {
      item.deliverystatus = 'reject';
      item.namedeliver = null;
      vm.addHis(item);
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