(function () {
  'use strict';

  // Accuralreceipts controller
  angular
    .module('accuralreceipts')
    .controller('AccuralreceiptsController', AccuralreceiptsController);

  AccuralreceiptsController.$inject = ['$scope', '$state', '$window', 'Authentication', 'accuralreceiptResolve', 'OrdersService', 'Users'];

  function AccuralreceiptsController($scope, $state, $window, Authentication, accuralreceipt, OrdersService, Users) {
    var vm = this;

    vm.authentication = Authentication;
    vm.accuralreceipt = accuralreceipt;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;
    vm.selectDeliver = selectDeliver;
    vm.readDeliver = readDeliver;
    vm.init = init;
    vm.delivers = [];
    vm.listorders = [];
    vm.selectedOrder = selectedOrder;
    vm.removeItem = removeItem;
    vm.calculate = calculate;
    vm.accuralreceipt.billamount = 0;
    vm.readOrder = readOrder;
    if (vm.accuralreceipt.items) {
      vm.accuralreceipt.items = vm.accuralreceipt.items;
    } else {
      vm.accuralreceipt.items = [];
    }


    // Remove existing Accuralreceipt
    function init() {
      vm.readOrder();
      vm.accuralreceipt.billamount = 0;
      vm.readDeliver();
      if (!vm.accuralreceipt._id) {
        vm.accuralreceipt.docdate = new Date();
        vm.accuralreceipt.docno = (+ new Date());

        vm.accuralreceipt.arstatus = 'wait for review';
        vm.accuralreceipt.historystatus = [{
          status: 'wait for review',
          datestatus: new Date()
        }];

      } else if (vm.accuralreceipt._id) {
        vm.accuralreceipt.docdate = new Date(vm.accuralreceipt.docdate);
      }

    }

    function readOrder() {
      vm.listorder = OrdersService.query(function () {
        vm.listorder.forEach(function (order) {
          if (order.namedeliver) {
            if (order.user._id === order.namedeliver._id) {
              vm.listorders.push(order);
            }
          }

        });
        // console.log(vm.listorders);
      });
    }

    function calculate(orders) {
      vm.accuralreceipt.billamount = 0;
      orders.forEach(function (order) {
        vm.accuralreceipt.billamount += order.totalamount;
        // console.log(order);
      });
    }

    function selectedOrder(ord) {

      if (vm.accuralreceipt.items.length > 0) {
        vm.accuralreceipt.items.forEach(function (list) {
          if (list._id === ord._id) {
            vm.status = 'have';
          }
        });
      }

      if (vm.status !== 'have') {
        vm.accuralreceipt.items.push(ord);
      }else{
        alert('คุณเลือกรายการซ้ำ');
      }


      vm.calculate(vm.accuralreceipt.items);
    }

    function selectDeliver(deli) {
      vm.deliver = deli;
      vm.accuralreceipt.namedeliver = vm.deliver;

    }

    function removeItem(item) {
      vm.accuralreceipt.items.splice(item, 1);
      vm.calculate(vm.accuralreceipt.items);
    }

    function readDeliver() {
      if (vm.authentication.user.roles[0] === 'admin') {
        vm.deliver = Users.query(function () {
          angular.forEach(vm.deliver, function (user) {
            if (user.roles[0] === 'deliver')
              vm.delivers.push(user);
          });
        });
        // console.log(vm.delivers);
      }

    }

    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.accuralreceipt.$remove($state.go('accuralreceipts.list'));
      }
    }

    // Save Accuralreceipt
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.accuralreceiptForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.accuralreceipt._id) {
        vm.accuralreceipt.$update(successCallback, errorCallback);
      } else {
        vm.accuralreceipt.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('accuralreceipts.list', {
          accuralreceiptId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
} ());
