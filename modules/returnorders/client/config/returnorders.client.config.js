(function () {
  'use strict';

  angular
    .module('returnorders')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(menuService) {
    // Set top bar menu items
    menuService.addMenuItem('topbar', {
      title: 'รายการใบแจ้งคืน',
      state: 'returnorders',
      type: 'dropdown',
      roles: ['deliver', 'admin']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'returnorders', {
      title: 'List Returnorders',
      state: 'returnorders.list',
      roles: ['deliver', 'admin']
    });

    // Add the dropdown create item
    menuService.addSubMenuItem('topbar', 'returnorders', {
      title: 'Create Returnorder',
      state: 'returnorders.create',
      roles: ['deliver', 'admin']
    });
  }
}());
