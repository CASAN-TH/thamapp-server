(function () {
  'use strict';

  angular
    .module('orders')
    .controller('CompleteController', CompleteController);

  CompleteController.$inject = ['$scope', 'orderResolve'];

  function CompleteController($scope, orderResolve) {
    var vm = this;
    vm.complete = orderResolve;
    // Complete controller logic
    // ...
    vm.allQty = 0;
    vm.complete.items.forEach(function(i){
      vm.allQty += i.qty;
    });
    // console.log(vm.complete);
    init();

    function init() {
    }
  }
})();
