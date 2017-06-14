(function () {
  'use strict';

  angular
    .module('accuralreceipts')
    .controller('ArController', ArController);

  ArController.$inject = ['$scope', '$state', 'AccuralreceiptsService', 'Authentication', '$window'];

  function ArController($scope, $state, AccuralreceiptsService, Authentication, $window) {
    var vm = this;
    vm.authentication = Authentication;
    vm.accuralreceipts = AccuralreceiptsService.query();
    vm.statusWaitconfirmed = statusWaitconfirmed;
    vm.addHis = addHis;
    $scope.setTabBlueSky = 'buttonBlueSkySet';

    vm.setLimit = function () {
      $scope.topsearch = '';
      $scope.filterText = '';
    };

    $scope.filter = function (topsearch) {
      if (topsearch.length > 4) {
        $scope.filterText = topsearch;
      } else {
        $scope.filterText = '';
      }
    };

    function addHis(data) {
      data.historystatus.push({
        status: data.arstatus,
        datestatus: new Date()
      });
    }

    function statusWaitconfirmed(data) {
      data.arstatus = 'confirmed';
      vm.addHis(data);
      data.$update(successCallback, errorCallback);
      function successCallback(res) {

      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }

    vm.listwaitreview = function (items) {
      if (items.namedeliver._id === vm.authentication.user._id && items.arstatus === 'wait for review') {
        return true;
      }
    };

    vm.listwaitcomfirmed = function (items) {
      if (items.namedeliver._id === vm.authentication.user._id && items.arstatus === 'wait for confirmed') {
        return true;
      }
    };

    vm.listconfirmed = function (items) {
      if (items.namedeliver._id === vm.authentication.user._id && items.arstatus === 'confirmed') {
        return true;
      }
    };

    vm.listreceipt = function (items) {
      if (items.namedeliver._id === vm.authentication.user._id && items.arstatus === 'receipt') {
        return true;
      }
    };
  }
})();
