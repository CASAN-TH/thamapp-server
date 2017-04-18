(function () {
  'use strict';

  angular
    .module('marketplans')
    .controller('MarketplansListController', MarketplansListController);

  MarketplansListController.$inject = ['MarketplansService'];

  function MarketplansListController(MarketplansService) {
    var vm = this;

    vm.marketplans = MarketplansService.query();

    
  }
}());
