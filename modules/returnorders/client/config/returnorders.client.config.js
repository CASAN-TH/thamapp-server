(function () {
  'use strict';

  angular
    .module('returnorders')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    // Set top bar menu items
    menuService.addMenuItem('topbar', {
      title: 'Returnorders',
      state: 'returnorders',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'returnorders', {
      title: 'List Returnorders',
      state: 'returnorders.list'
    });

    // Add the dropdown create item
    menuService.addSubMenuItem('topbar', 'returnorders', {
      title: 'Create Returnorder',
      state: 'returnorders.create',
      roles: ['user']
    });
  }
}());
