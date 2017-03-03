(function () {
  'use strict';

  angular
    .module('stocks')
    .controller('DeliverstockController', DeliverstockController);

  DeliverstockController.$inject = ['$scope', 'StocksService', 'Authentication'];

  function DeliverstockController($scope, StocksService, Authentication) {
    var vm = this;
    vm.authentication = Authentication;
    vm.stocks = StocksService.query();
    vm.liststock = function(stock){
      if(vm.authentication.user._id === stock.namedeliver._id){
        return true;
      }
    };
  }
})();
