(function () {
  'use strict';

  angular
    .module('purchases')
    .controller('PurchasesListController', PurchasesListController);

  PurchasesListController.$inject = ['PurchasesService', 'Authentication'];

  function PurchasesListController(PurchasesService, Authentication) {
    var vm = this;
    vm.authentication = Authentication;
    vm.purchases = PurchasesService.query();

  }
}());
