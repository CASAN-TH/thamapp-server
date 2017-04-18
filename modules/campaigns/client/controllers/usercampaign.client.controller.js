(function() {
  'use strict';

  angular
    .module('campaigns')
    .controller('UsercampaignController', UsercampaignController);

  UsercampaignController.$inject = ['$scope'];

  function UsercampaignController($scope) {
    var vm = this;

    // Usercampaign controller logic
    // ...

    init();

    function init() {
    }
  }
})();
