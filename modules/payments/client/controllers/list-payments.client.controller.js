(function () {
  'use strict';

  angular
    .module('payments')
    .controller('PaymentsListController', PaymentsListController);

  PaymentsListController.$inject = ['PaymentsService', 'Authentication'];

  function PaymentsListController(PaymentsService, Authentication) {
    var vm = this;
    vm.authentication = Authentication;
    vm.payments = PaymentsService.query();
  }
} ());
