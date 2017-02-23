(function () {
  'use strict';

  angular
    .module('transports')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(menuService) {

    // // Set top bar menu items
    // menuService.addMenuItem('topbar', {
    //   title: 'บริษัทขนส่ง',
    //   state: 'transports',
    //   type: 'dropdown',
    //   roles: ['admin']
    // });

    // // Add the dropdown list item
    // menuService.addSubMenuItem('topbar', 'transports', {
    //   title: 'List Transports',
    //   state: 'transports.list'
    // });

    // // Add the dropdown create item
    // menuService.addSubMenuItem('topbar', 'transports', {
    //   title: 'Create Transport',
    //   state: 'transports.create',
    //   roles: ['admin']
    // });

  }
}());
