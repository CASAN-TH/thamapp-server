(function () {
  'use strict';

  angular
    .module('stocks')
    .controller('StocksListController', StocksListController);

  StocksListController.$inject = ['StocksService'];

  function StocksListController(StocksService) {
    var vm = this;
    vm.selected = '';
    vm.stocks = StocksService.query(function () {
      if (vm.stocks && vm.stocks.length > 0) {
        vm.selected = vm.stocks[0].name;
      }
    });


  }
} ());
