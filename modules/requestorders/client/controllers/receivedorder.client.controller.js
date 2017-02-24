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
    vm.requestProduct = requestProduct;
    vm.receive = receive;
    vm.addHis = addHis;
    function requestProduct(itm) {
      vm.requestprod = itm;
    }

    function receive(item) {
      var conf = confirm('ยอมรับรายการ');
      if (conf === true) {
        item.deliverystatus = 'received';
        vm.addHis(item);

      }
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
