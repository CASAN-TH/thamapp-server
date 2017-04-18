(function() {
  'use strict';

  angular
    .module('campaigns')
    .controller('UsercampaignController', UsercampaignController);

  UsercampaignController.$inject = ['$scope', '$state', '$window', 'Authentication', 'CampaignsService'];

  function UsercampaignController($scope, $state, $window, Authentication, CampaignsService) {
    var vm = this;
    vm.authentication = Authentication;
    vm.campaigns = CampaignsService.query();
   
  }
})();
