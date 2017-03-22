(function () {
  'use strict';

  angular
    .module('sells')
    .controller('SellsListController', SellsListController);

  SellsListController.$inject = ['SellsService', 'Authentication'];

  function SellsListController(SellsService, Authentication) {
    var vm = this;
    vm.authentication = Authentication;
    vm.sells = SellsService.query();

  }
}());
