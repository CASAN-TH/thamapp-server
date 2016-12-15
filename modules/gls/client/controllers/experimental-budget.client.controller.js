(function() {
  'use strict';

  angular
    .module('gls')
    .controller('ExperimentalBudgetController', ExperimentalBudgetController);

  ExperimentalBudgetController.$inject = ['$scope', 'glResolve'];

  function ExperimentalBudgetController($scope, gl) {
    var vm = this;
    vm.gl = gl;
    vm.init = init;

    // Experimental budget controller logic
    // ...

    init();

    function init() {
    }
  }
})();
