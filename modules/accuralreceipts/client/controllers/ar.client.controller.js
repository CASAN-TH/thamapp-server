(function () {
  'use strict';

  angular
    .module('accuralreceipts')
    .controller('ArController', ArController);

  ArController.$inject = ['$scope', 'Users', 'AccuralreceiptsService', 'Authentication'];

  function ArController($scope, Users, AccuralreceiptsService, Authentication) {
    var vm = this;
    vm.authentication = Authentication;
    vm.accuralreceipts = AccuralreceiptsService.query();
    vm.init = init;
    // Ar controller logic
    // ...

    init();

    function init() {
    }
  }
})();
