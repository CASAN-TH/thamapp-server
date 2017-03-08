(function () {
  'use strict';

  angular
    .module('returnorders')
    .controller('ReturnordersListController', ReturnordersListController);

  ReturnordersListController.$inject = ['ReturnordersService'];

  function ReturnordersListController(ReturnordersService) {
    var vm = this;

    vm.returnorders = ReturnordersService.query();
  }
}());
