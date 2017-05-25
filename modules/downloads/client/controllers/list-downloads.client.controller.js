(function () {
  'use strict';

  angular
    .module('downloads')
    .controller('DownloadsListController', DownloadsListController);

  DownloadsListController.$inject = ['DownloadsService', 'Authentication'];

  function DownloadsListController(DownloadsService, Authentication) {
    var vm = this;
    vm.authentication = Authentication;
    vm.downloads = DownloadsService.query();
  }
}());
