(function () {
  'use strict';

  angular
    .module('stocks')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(menuService) {
    // Set top bar menu items
    // menuService.addMenuItem('topbar', {
    //   title: 'สต๊อก',
    //   state: 'stocks',
    //   type: 'dropdown',
    //   roles: ['admin']
    // });

   

    
  }
}());
