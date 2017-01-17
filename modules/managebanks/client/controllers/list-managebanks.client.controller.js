(function () {
  'use strict';

  angular
    .module('managebanks')
    .controller('ManagebanksListController', ManagebanksListController);

  ManagebanksListController.$inject = ['ManagebanksService'];

  function ManagebanksListController(ManagebanksService) {
    var vm = this;

    vm.managebanks = ManagebanksService.query();
  }
}());
