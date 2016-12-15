(function () {
  'use strict';

  angular
    .module('gls')
    .controller('LedgerController', LedgerController);

  LedgerController.$inject = ['$scope', 'glResolve'];

  function LedgerController($scope, gl) {
    var vm = this;
    vm.gl = gl;
    vm.date = "";
    vm.getByDate = getByDate;
    vm.moneyDebit = [];
    vm.moneyCredit = [];
    vm.customer = [];
    vm.supplier = [];
    // Ledger controller logic
    // ...

    // init();
    getByDate();
    function init() {

    }

    function getByDate() {
      vm.moneyDebit = [];
      vm.moneyCredit = [];
      vm.customer = [];
      vm.supplier = [];
      angular.forEach(vm.gl.transaction, function (e) {
        var day = new Date(vm.date).getDate();
        var eday = new Date(e.date).getDate();
        if (day === eday) {
          if (e.refno.substr(0, 2) === 'RV') {

            vm.moneyDebit.push(e);

          } else if (e.refno.substr(0, 2) === 'PM') {

            vm.moneyCredit.push(e);

          } else if (e.refno.substr(0, 2) === 'IN') {

            vm.customer.push(e);

          } else {

            vm.supplier.push(e);

          }
        }
      });
    }
  }
})();
