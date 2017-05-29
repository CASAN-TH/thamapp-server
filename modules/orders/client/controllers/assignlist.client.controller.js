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
    vm.accept = accept;
    vm.complete = complete;
    vm.reject = reject;
    vm.addHis = addHis;

    vm.assignlist = function (order) {
      if (order.namedeliver) {
        if (order.namedeliver._id === vm.authentication.user._id && order.deliverystatus === 'wait deliver') {
          return true;
        }

      }
    };

    vm.acceptlist = function (order) {
      if (order.namedeliver) {
        if (order.namedeliver._id === vm.authentication.user._id && order.deliverystatus === 'accept') {
          return true;
        }

      }else{ //jigkoh3 update for meet all order is not have  namedeliver
        return true;
      }
    };

    vm.completelist = function (order) {
      if (order.namedeliver) {
        if (order.namedeliver._id === vm.authentication.user._id && order.deliverystatus === 'complete') {
          return true;
        }

      }
    };


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