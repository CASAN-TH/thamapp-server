(function () {
  'use strict';

  angular
    .module('requestorders')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(menuService) {
    // Set top bar menu items
    menuService.addMenuItem('topbar', {
      title: 'รายการขนส่งข้าว',
      state: 'requestorders',
      type: 'dropdown',
      roles: ['deliver', 'admin']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'requestorders', {
      title: 'List Requestorders',
      state: 'requestorders.list',
      roles: ['deliver', 'admin']
    });

    // Add the dropdown create item
    menuService.addSubMenuItem('topbar', 'requestorders', {
      title: 'Create Requestorder',
      state: 'requestorders.create',
      roles: ['deliver', 'admin']
    });
  }
}());