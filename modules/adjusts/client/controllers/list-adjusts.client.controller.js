(function () {
  'use strict';

  angular
    .module('adjusts')
    .controller('AdjustsListController', AdjustsListController);

  AdjustsListController.$inject = ['AdjustsService'];

  function AdjustsListController(AdjustsService) {
    var vm = this;

    vm.adjusts = AdjustsService.query();
  }
}());
