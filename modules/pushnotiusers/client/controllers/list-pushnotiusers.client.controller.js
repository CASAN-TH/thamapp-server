(function () {
  'use strict';

  angular
    .module('pushnotiusers')
    .controller('PushnotiusersListController', PushnotiusersListController);

  PushnotiusersListController.$inject = ['PushnotiusersService'];

  function PushnotiusersListController(PushnotiusersService) {
    var vm = this;

    vm.pushnotiusers = PushnotiusersService.query();
  }
}());
