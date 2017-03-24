(function () {
  'use strict';

  angular
    .module('postcodes')
    .controller('PostcodesListController', PostcodesListController);

  PostcodesListController.$inject = ['$state','PostcodesService'];

  function PostcodesListController($state,PostcodesService) {
    var vm = this;

    vm.postcodes = PostcodesService.query();

    vm.remove = function(itm){
     itm.$remove();
      vm.postcodes = PostcodesService.query();

    };
       
     vm.update = function(itm){
      //  console.log(itm._id);
       if (itm._id) {
         $state.go('postcodes.edit', {
          postcodeId: itm._id
        });
      } 
    };
  }
}());
