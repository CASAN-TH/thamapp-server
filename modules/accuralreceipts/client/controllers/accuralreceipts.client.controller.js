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
    vm.removeadjust = removeadjust;
    vm.calculate = calculate;
    vm.addPaid = addPaid;
    vm.sum = 0;
    vm.caladjust = caladjust;
    vm.statusWaitreceipt = statusWaitreceipt;
    $scope.totalCount = 0;
    $scope.countInit = function () {
      return $scope.totalCount++;
    };
    // vm.accuralreceipt.billamount = 0;
    vm.readOrder = readOrder;
    if (vm.accuralreceipt.namedeliver) {
      vm.accuralreceipt.namedeliver = vm.accuralreceipt.namedeliver;
    } else {
      vm.accuralreceipt.namedeliver = [];
    }
    if (vm.accuralreceipt.items) {
      vm.accuralreceipt.items = vm.accuralreceipt.items;
    } else {
      vm.accuralreceipt.items = [];
    }

    // Remove existing Accuralreceipt
    function init() {
      vm.readOrder();
      vm.readDeliver();
      if (!vm.accuralreceipt._id) {
        vm.accuralreceipt.billamount = 0;
        vm.accuralreceipt.totalamount = 0;
        vm.accuralreceipt.adjustamount = 0;
        vm.accuralreceipt.docdate = new Date();
        vm.accuralreceipt.docno = (+ new Date());

        vm.accuralreceipt.arstatus = 'wait for review';
        vm.accuralreceipt.historystatus = [{
          status: 'wait for review',
          datestatus: new Date()
        }];
        vm.accuralreceipt.adjustments = [];

      } else if (vm.accuralreceipt._id) {
        vm.accuralreceipt.docdate = new Date(vm.accuralreceipt.docdate);
        vm.accuralreceipt.adjustments = vm.accuralreceipt.adjustments;
      }

    }
    function addPaid() {
      vm.accuralreceipt.adjustments.push({
        paid: {
          typepaid: '',
          total: 0
        }
      });

      // vm.sumadjust(vm.accuralreceipt.adjustments);
    }
    // function sumadjust(item) {
    //   item.forEach(function(amount){
    //     console.log(amount);
    //   });
    //   // vm.sum += item.paid.total;
    //   // vm.accuralreceipt.adjustamount = vm.sum;
    //   // vm.accuralreceipt.adjustments.totalamount = vm.accuralreceipt.billamount - vm.accuralreceipt.adjustamount;
    // }
    function caladjust() {
      var sum = 0;
      vm.accuralreceipt.adjustments.forEach(function (adjust) {
        sum += adjust.paid.total;
      });
      vm.accuralreceipt.adjustamount = sum;
      vm.accuralreceipt.totalamount = vm.accuralreceipt.billamount - vm.accuralreceipt.adjustamount;

    }
    function readOrder(deliver) {
      if (vm.accuralreceipt._id) {
        vm.listorders = [];
        vm.listorder = OrdersService.query(function () {
          vm.listorder.forEach(function (order) {
            if (order.namedeliver) {
              if (vm.accuralreceipt.namedeliver._id === order.namedeliver._id) {
                if (order.deliverystatus === 'complete') {
                  vm.listorders.push(order);
                }
              }
            }
          });
        });
      } else if (deliver) {
        vm.listorders = [];
        vm.listorder = OrdersService.query(function () {
          vm.listorder.forEach(function (order) {
            if (order.namedeliver) {
              if (deliver._id === order.namedeliver._id) {
                if (order.deliverystatus === 'complete') {
                  vm.listorders.push(order);
                }
              }
            }

          });
        });
      }

    }

    function calculate(orders) {
      console.log(vm.accuralreceipt.adjustments);
      vm.accuralreceipt.billamount = 0;
      orders.forEach(function (order) {
        order.items.forEach(function (itm) {
          vm.accuralreceipt.billamount += itm.product.retailerprice * itm.qty;
        });
        //vm.accuralreceipt.billamount += order.totalamount;
        // console.log(order);
      });
      vm.accuralreceipt.totalamount = vm.accuralreceipt.billamount - vm.accuralreceipt.adjustamount;
    }

    function selectedOrder(ord) {
      vm.status = '';
      if (vm.accuralreceipt.items.length > 0) {
        vm.accuralreceipt.items.forEach(function (list) {
          if (list._id === ord._id) {
            vm.status = 'have';
          }
        });

      }

      if (vm.status === '' || vm.status !== 'have') {
        vm.accuralreceipt.items.push(ord);
      } else {
        alert('คุณเลือกรายการซ้ำ');
      }
      vm.calculate(vm.accuralreceipt.items);
    }
    function selectDeliver(deli) {
      vm.accuralreceipt.items = [];
      vm.deliver = deli;
      vm.accuralreceipt.namedeliver = vm.deliver;
      vm.readOrder(vm.deliver);

    }

    function removeItem(item) {
      console.log(item);
      // item.deliverystatus = 'complete';
      // item.refdoc = '';
      vm.accuralreceipt.items[item].deliverystatus = 'complete';
      vm.accuralreceipt.items[item].refdoc = '';
      vm.accuralreceipt.items.splice(item, 1);

      vm.calculate(vm.accuralreceipt.items);
    }

    function removeadjust(item) {
      vm.accuralreceipt.adjustments.splice(item, 1);
      vm.caladjust();
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
    vm.setdates = new Date();
    function statusWaitreceipt() {
      // console.log(vm.setdates);
      vm.accuralreceipt.paiddate = vm.setdates;
      vm.accuralreceipt.arstatus = 'receipt';
      vm.accuralreceipt.historystatus.push({
        status: vm.accuralreceipt.arstatus,
        datestatus: new Date()
      });
      vm.accuralreceipt.$update(successCallback, errorCallback);
      function successCallback(res) {
        $state.go('accuralreceipts.list');
      }

      function errorCallback(res) {
        vm.error = res.data.message;
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
        console.log(vm.accuralreceipt);
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
}());
