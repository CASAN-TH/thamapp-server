(function () {
  'use strict';

  angular
    .module('receipts')
    .controller('ReceiptsListController', ReceiptsListController);

  ReceiptsListController.$inject = ['ReceiptsService', 'Authentication'];

  function ReceiptsListController(ReceiptsService, Authentication) {
    var vm = this;
    vm.authentication = Authentication;
    vm.receipts = ReceiptsService.query();

  }
}());
