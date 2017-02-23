(function () {
  'use strict';

  angular
    .module('requestorders')
    .controller('ReceivedorderController', ReceivedorderController);

  ReceivedorderController.$inject = ['$scope', 'Users', 'RequestordersService', 'Authentication'];

  function ReceivedorderController($scope, Users, RequestordersService, Authentication) {
    var vm = this;
    vm.authentication = Authentication;
    vm.requestorders = RequestordersService.query();
    vm.init = init;
    vm.requestProduct = requestProduct;
    vm.listRequestOrder = listRequestOrder;
    vm.listRequest = [];
    vm.listResponse = [];
    vm.listReceived = [];
    vm.receive = receive;
    vm.addHis = addHis;
    // console.log(vm.requestorders);

    function init() {
      vm.listRequestOrder();
    }
    // init();
    function requestProduct(itm) {
      vm.requestprod = itm;
    }
    function listRequestOrder() {
      vm.listReq = RequestordersService.query(function () {
        angular.forEach(vm.listReq, function (req) {
          if (req.namedeliver) {
            if (req.namedeliver._id === vm.authentication.user._id) {
              if (req.namedeliver._id === vm.authentication.user._id && req.deliverystatus === 'request') {
                vm.listRequest.push(req);
              } else if (req.namedeliver._id === vm.authentication.user._id && req.deliverystatus === 'response') {
                vm.listResponse.push(req);
              } else if (req.namedeliver._id === vm.authentication.user._id && req.deliverystatus === 'received') {
                vm.listReceived.push(req);
              }
            }
          }
        });
      });
    }

    function receive(item) {
      var conf = confirm('ยอมรับรายการ');
      if (conf === true) {
        item.deliverystatus = 'received';
        vm.addHis(item);
        
      }
      item.$update(successCallback, errorCallback);
        function successCallback(res) {
          vm.listRequest = [];
          vm.listResponse = [];
          vm.listReceived = [];
          vm.init();
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
